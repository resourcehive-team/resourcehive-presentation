import { chromium } from 'playwright-chromium'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://127.0.0.1:3031'
const output = new URL('../output/qa/', import.meta.url)
mkdirSync(output, { recursive: true })
const expected = ['ResourceHive', ...[...readFileSync(new URL('../slides.md', import.meta.url), 'utf8').matchAll(/^title: (.+)$/gm)].slice(1).map(match => match[1])]
const browser = await chromium.launch({ headless: true })
const report = { base, slides: [], externalRequests: [], runtimeErrors: [], failedResponses: [] }

try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } })
  // A headless browser cannot keep a physical display awake. Disable only that browser setting.
  await context.addInitScript(() => localStorage.setItem('slidev-wake-lock', 'false'))
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (url.origin !== new URL(base).origin) {
        report.externalRequests.push(url.href)
        return route.abort()
      }
    }
    return route.continue()
  })
  const page = await context.newPage()
  page.on('pageerror', error => report.runtimeErrors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.runtimeErrors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) report.failedResponses.push({ url: response.url(), status: response.status() }) })

  for (let number = 1; number <= 16; number++) {
    await page.goto(`${base}/${number}`, { waitUntil: 'networkidle' })
    const slide = page.locator(`[data-slidev-no="${number}"] .slidev-layout`).first()
    await slide.waitFor({ state: 'visible' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(250)
    if ([4, 5, 7, 8, 9, 10, 12, 15].includes(number)) {
      await slide.locator('.mermaid svg').first().waitFor({ state: 'visible' })
    }
    const result = await slide.evaluate(root => {
      const bounds = root.getBoundingClientRect()
      const textNodes = [...root.querySelectorAll('h1,h2,p,li,td,th,pre,.technique')]
      const overflow = textNodes.filter(element => {
        const rect = element.getBoundingClientRect()
        return rect.width && rect.height && (rect.right > bounds.right + 2 || rect.bottom > bounds.bottom - 34 || rect.left < bounds.left - 2 || rect.top < bounds.top - 2)
      }).map(element => ({ tag: element.tagName, text: element.textContent.slice(0, 100) }))
      const codeOverflow = [...root.querySelectorAll('pre')].filter(element => element.scrollWidth > element.clientWidth + 2).length
      return {
        title: root.querySelector('h1')?.textContent?.trim(),
        words: root.innerText.trim().split(/\s+/).length,
        font: getComputedStyle(root).fontFamily,
        robotoLoaded: document.fonts.check('24px Roboto'),
        paragraphOpacity: [...root.querySelectorAll('p')].map(element => getComputedStyle(element).opacity),
        headingSize: getComputedStyle(root.querySelector('h1')).fontSize,
        diagrams: root.querySelectorAll('.mermaid svg').length,
        icons: root.querySelectorAll('svg:not(.mermaid svg)').length,
        overflow,
        codeOverflow,
      }
    })
    // Mermaid renders SVGs in an open shadow root; Playwright locators pierce it.
    result.diagrams = await slide.locator('.mermaid svg').count()
    result.number = number
    report.slides.push(result)
    await slide.screenshot({ path: new URL(`slide-${String(number).padStart(2, '0')}.png`, output).pathname.replace(/^\/(\w:)/, '$1') })
    console.log(`${number}: ${result.title} | ${result.words} words | ${result.diagrams} diagrams | ${result.overflow.length} overflowing blocks`)
    assert.equal(result.title, expected[number - 1], `Unexpected title on slide ${number}`)
    assert.equal(result.overflow.length, 0, `Content outside slide ${number}`)
    assert.equal(result.codeOverflow, 0, `Code overflows on slide ${number}`)
    assert.match(result.font, /Roboto/, `Roboto is not applied on slide ${number}`)
    assert.equal(result.robotoLoaded, true, `Roboto has not loaded on slide ${number}`)
    assert.ok(result.paragraphOpacity.every(opacity => opacity === '1'), `Supporting text is faded on slide ${number}`)
    if ([4, 5, 7, 8, 9, 10, 12, 15].includes(number)) assert.equal(result.diagrams, 1, `Missing diagram on slide ${number}`)
  }

  await page.goto(`${base}/1`, { waitUntil: 'networkidle' })
  await page.keyboard.press('ArrowRight')
  await page.waitForURL('**/2')
  await page.keyboard.press('ArrowLeft')
  await page.waitForURL('**/1')
  report.keyboardNavigation = 'passed'

  await page.goto(`${base}/presenter/5`, { waitUntil: 'networkidle' })
  await page.getByText('An initial availability check is useful', { exact: false }).first().waitFor({ state: 'visible' })
  report.presenterNotes = 'passed'
  await page.screenshot({ path: new URL('presenter.png', output).pathname.replace(/^\/(\w:)/, '$1') })

  assert.equal(report.externalRequests.length, 0, 'The deck requested external assets')
  assert.equal(report.runtimeErrors.length, 0, 'Browser runtime errors were found')
  assert.equal(report.failedResponses.length, 0, 'Local asset requests failed')
  console.log('All 16 slides, navigation, presenter notes, fonts, and local-only asset checks passed.')
} finally {
  writeFileSync(new URL('rendering-report.json', output), JSON.stringify(report, null, 2))
  await browser.close()
}

import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const source = readFileSync(new URL('../slides.md', import.meta.url), 'utf8')
const titles = [...source.matchAll(/^title: (.+)$/gm)].map(match => match[1])
const timings = [...source.matchAll(/Time: (\d+):(\d+)\./g)]
const totalSeconds = timings.reduce((sum, match) => sum + Number(match[1]) * 60 + Number(match[2]), 0)
assert.equal(titles.length, 16, 'The deck must contain exactly 16 slides')
assert.equal(timings.length, 16, 'Each slide must have a speaking-time note')
assert.ok(totalSeconds >= 720 && totalSeconds <= 900, 'Speaking time must be between 12 and 15 minutes')
assert.ok(!/https?:\/\/fonts\./.test(source), 'Fonts must be bundled locally')
console.log(JSON.stringify({ slides: titles.length, speakingTime: `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`, titles }, null, 2))

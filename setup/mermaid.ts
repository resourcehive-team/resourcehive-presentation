import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '22px',
    primaryColor: '#f7f7f7',
    primaryTextColor: '#171717',
    primaryBorderColor: '#777777',
    secondaryColor: '#ffffff',
    tertiaryColor: '#ffffff',
    lineColor: '#555555',
    edgeLabelBackground: '#ffffff',
    clusterBkg: '#ffffff',
    clusterBorder: '#bbbbbb',
    actorBkg: '#f7f7f7',
    actorBorder: '#777777',
    actorTextColor: '#171717',
    signalColor: '#555555',
    signalTextColor: '#171717',
    noteBkgColor: '#f7f7f7',
    noteTextColor: '#171717',
    noteBorderColor: '#bbbbbb',
  },
  flowchart: { curve: 'linear', nodeSpacing: 22, rankSpacing: 35, padding: 12 },
  sequence: { mirrorActors: false, actorMargin: 25, messageMargin: 25, noteMargin: 10 },
}))

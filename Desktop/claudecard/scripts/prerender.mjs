import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const clientDir = join(root, 'dist')
const serverDir = join(root, 'dist-ssr')

const { render } = await import(join(serverDir, 'entry-server.js'))

const template = readFileSync(join(clientDir, 'index.html'), 'utf-8')

const ROUTES = [
  '/',
  '/rewards',
  '/privacy',
  '/terms',
  '/accessibility',
]

for (const url of ROUTES) {
  let appHtml, helmet
  try {
    ;({ html: appHtml, helmet } = render(url))
  } catch (err) {
    console.error(`✗ ${url} — render error:`, err.message)
    continue
  }

  // Remove interim SSR placeholder and inject real prerendered markup
  let page = template.replace(
    /<!-- Interim SSR:.*?-->\s*/s,
    ''
  ).replace(
    '<div id="root">',
    `<div id="root">${appHtml}`
  )

  // Inject per-page <head> tags from react-helmet-async
  if (helmet) {
    const titleTag = helmet.title?.toString() ?? ''
    const metaTags = helmet.meta?.toString()  ?? ''
    const linkTags = helmet.link?.toString()  ?? ''

    if (titleTag) page = page.replace(/<title>[^<]*<\/title>/, titleTag)
    page = page.replace('</head>', `${metaTags}${linkTags}</head>`)
  }

  const outDir = url === '/'
    ? clientDir
    : join(clientDir, url.slice(1))

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), page)
  console.log(`✓ prerendered ${url}`)
}

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import RewardsPage from './pages/RewardsPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AccessibilityPage from './pages/AccessibilityPage'

const ROUTES = {
  '/':              HomePage,
  '/rewards':       RewardsPage,
  '/privacy':       PrivacyPage,
  '/terms':         TermsPage,
  '/accessibility': AccessibilityPage,
}

export function render(url) {
  const helmetContext = {}
  const Component = ROUTES[url] ?? HomePage

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[url]}>
        <Nav />
        <Component />
      </MemoryRouter>
    </HelmetProvider>
  )

  return { html, helmet: helmetContext.helmet }
}

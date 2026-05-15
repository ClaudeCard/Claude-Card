import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import About from '../components/About';
import Worlds from '../components/Worlds';
import { Footer } from '../components/SignupFooter';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>ClaudeCard | Claude's Food, Wellness, Service & Adventure Worlds</title>
        <meta name="description" content="One membership, one rewards circle, one passport across every world Claude builds — chef experiences, cookies, scuba, wellness, and service." />
      </Helmet>
    <div id="top">
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Worlds />
      </main>
      <Footer />
    </div>
  </>
  );
}

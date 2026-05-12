import Hero from '../components/Hero';
import About from '../components/About';
import Worlds from '../components/Worlds';
import { Footer } from '../components/SignupFooter';

export default function HomePage() {
  return (
    <div id="top">
      <main>
        <Hero />
        <About />
        <Worlds />
      </main>
      <Footer />
    </div>
  );
}

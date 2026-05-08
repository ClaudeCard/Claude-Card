import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Worlds from './components/Worlds';
import Rewards from './components/Rewards';
import { Signup, Footer } from './components/SignupFooter';
import './styles/globals.css';

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Hero />
        <About />
        <Worlds />
        <Rewards />
        <Signup />
      </main>
      <Footer />
    </div>
  );
}

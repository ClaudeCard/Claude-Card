import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Worlds from './components/Worlds';
import Rewards from './components/Rewards';
import RidiculousPassport from './components/RidiculousPassport';
import { Signup, Footer } from './components/SignupFooter';
import './styles/globals.css';

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <About />
        <Worlds />
        <Rewards />
        <RidiculousPassport />
        <Signup />
      </main>
      <Footer />
    </div>
  );
}

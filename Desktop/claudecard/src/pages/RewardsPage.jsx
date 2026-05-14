import Rewards from '../components/Rewards';
import { Signup, Footer } from '../components/SignupFooter';

export default function RewardsPage() {
  return (
    <div id="top">
      <main id="main-content" tabIndex={-1}>
        <Rewards />
        <Signup />
      </main>
      <Footer />
    </div>
  );
}

import { Helmet } from 'react-helmet-async';
import Rewards from '../components/Rewards';
import { Signup, Footer } from '../components/SignupFooter';

export default function RewardsPage() {
  return (
    <>
      <Helmet>
        <title>My Passport — ClaudeCard Rewards</title>
        <meta name="description" content="View your ClaudeCard Passport, track rewards across every connected world, and manage your account." />
      </Helmet>
    <div id="top">
      <main id="main-content" tabIndex={-1}>
        <Rewards />
        <Signup />
      </main>
      <Footer />
    </div>
  </>
  );
}

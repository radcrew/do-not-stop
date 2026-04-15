import { useNavigate } from 'react-router-dom';

import Layout from '../../components/layout/Layout';
import {
  CommunitySection,
  FeatureInteractionsSection,
  FeaturedPetsSection,
  FooterSection,
  HeroSection,
  StatsBandSection,
} from '../../components/landing';
import { useDynamicContext } from '../../contexts/dynamic';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const walletConnected = Boolean(user || primaryWallet);

  const handleStartPlaying = () => {
    if (walletConnected) {
      navigate('/main');
    } else {
      setShowAuthFlow(true);
    }
  };

  return (
    <Layout containerClassName="landing-layout">
      <div className="landing">
        <HeroSection onStartPlaying={handleStartPlaying} />
        <FeatureInteractionsSection />
        <FeaturedPetsSection />
        <StatsBandSection />
        <CommunitySection />
        <FooterSection />
      </div>
    </Layout>
  );
}

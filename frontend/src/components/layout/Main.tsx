import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@do-not-stop/shared-auth';
import { useDynamicContext } from '../../contexts/dynamic';

import AccountDropdown from '../wallet/AccountDropdown';
import SolanaWalletTrigger from '../wallet/SolanaWalletTrigger';
import ZombieGallery from '../zombie/ZombieGallery';
import { isStandaloneInteractionPath } from '../../constants/interactionRoutes';
import './Main.css';

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user, primaryWallet } = useDynamicContext();
  const isLoggedIn = Boolean(user || primaryWallet);
  const location = useLocation();
  /** Full-page interaction routes hide the pet collection. */
  const hideGallery = isStandaloneInteractionPath(location.pathname);

  return (
    <div className="main-container">
      <div className="main-header">
        <div className="header-title-row">
          <h1>Crypto Pets</h1>
        </div>
        <div className="wallet-section">
          <AccountDropdown />
        </div>
      </div>

      <div className={`main-content ${isAuthenticated || isLoggedIn ? 'authenticated' : ''}`}>
        {isAuthenticated || isLoggedIn ? (
          <>
            <Outlet />
            {!hideGallery && <ZombieGallery />}
          </>
        ) : (
          <div className="welcome-section">
            <br />
            <p>Connect your wallet to start creating and managing your crypto pet collection!</p>
            <div className="features">
              <div className="feature">
                <h3>🐾 Create Pets</h3>
                <p>Generate unique pets with random DNA and rarity</p>
              </div>
              <div className="feature">
                <h3>⚔️ Battle System</h3>
                <p>Pit your pets against each other in epic battles</p>
              </div>
              <div className="feature">
                <h3>🧬 Breeding</h3>
                <p>Combine two pets to create new offspring</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Solana wallet trigger */}
      <SolanaWalletTrigger />
    </div>
  );
};

export default Main;

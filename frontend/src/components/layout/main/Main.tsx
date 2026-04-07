import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AccountDropdown from '../../wallet/AccountDropdown';
import SolanaWalletTrigger from '../../wallet/SolanaWalletTrigger';
import PetGallery from '../../pet/PetGallery';
import { isInteractionRoute } from '../../../constants/interactionRoutes';
import './Main.css';

const Main: React.FC = () => {
  const location = useLocation();
  /** Full-page interaction routes hide the pet collection. */
  const isGalleryHidden = isInteractionRoute(location.pathname);

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

      <div className="main-content authenticated">
        <Outlet />
        {!isGalleryHidden && <PetGallery />}
      </div>

      <SolanaWalletTrigger />
    </div>
  );
};

export default Main;

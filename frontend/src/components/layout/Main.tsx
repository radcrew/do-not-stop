import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@do-not-stop/shared-auth';
import { useDynamicContext } from '../../contexts/dynamic';

import AccountDropdown from '../wallet/AccountDropdown';
import SolanaWalletTrigger from '../wallet/SolanaWalletTrigger';
import PetGallery from '../pet/PetGallery';
import { NeonButton, NeonCard } from '../common';
import {
  LANDING_COMMUNITY_CARDS,
  LANDING_FEATURE_CARDS,
  LANDING_FEATURED_PETS,
} from '../../constants/landingContent';
import { isInteractionRoute } from '../../constants/interactionRoutes';
import './Main.css';

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user, primaryWallet } = useDynamicContext();
  const isLoggedIn = Boolean(user || primaryWallet);
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

      <div className={`main-content ${isAuthenticated || isLoggedIn ? 'authenticated' : ''}`}>
        {isAuthenticated || isLoggedIn ? (
          <>
            <Outlet />
            {!isGalleryHidden && <PetGallery />}
          </>
        ) : (
          <div className="landing">
            <section className="landing-hero">
              <div className="hero-copy">
                <h2>Collect, Battle &amp; Breed Your Dream Pets!</h2>
                <p>10K+ handcrafted digital pets in the ultimate on-chain adventure.</p>
                <div className="hero-actions">
                  <NeonButton tone="emerald">Start Playing</NeonButton>
                  <NeonButton tone="azure">Watch Trailer</NeonButton>
                </div>
              </div>
            </section>

            <section className="landing-section">
              <h3 className="section-title">Pet Interactions</h3>
              <div className="feature-grid">
                {LANDING_FEATURE_CARDS.map((feature) => (
                  <NeonCard key={feature.title} className="feature-card feature-card-media-left">
                    <div className="feature-icon" aria-hidden="true">
                      {feature.iconImage ? (
                        <img src={feature.iconImage} alt="" className="feature-icon-image" />
                      ) : (
                        feature.icon
                      )}
                    </div>
                    <div className="feature-copy">
                      <h4>{feature.title}</h4>
                      <p>{feature.text}</p>
                    </div>
                  </NeonCard>
                ))}
              </div>
            </section>

            <section className="landing-section featured-pets">
              <h3 className="section-title">PETS</h3>
              <div className="pet-showcase-grid">
                {LANDING_FEATURED_PETS.map((pet) => (
                  <NeonCard key={pet.name} className="pet-showcase-card">
                    <div className="pet-avatar">
                      <img src={pet.image} alt={pet.name} className="pet-avatar-image" />
                    </div>
                    <h4>{pet.name}</h4>
                    <p>Lv. {pet.level} · {pet.rarity}</p>
                    <NeonButton tone="amber" size="sm">Send</NeonButton>
                  </NeonCard>
                ))}
              </div>
            </section>

            <section className="stats-band" aria-label="Project statistics">
              <div className="stat-item"><strong>10,000+</strong><span>Unique Pets</span></div>
              <div className="stat-item"><strong>5,250+</strong><span>Pet Holders</span></div>
              <div className="stat-item"><strong>1M+</strong><span>Battles Fought</span></div>
              <div className="stat-item"><strong>$2.5M</strong><span>Rewards Earned</span></div>
            </section>

            <section className="landing-section">
              <h3 className="section-title">Join Our Community</h3>
              <div className="community-grid">
                {LANDING_COMMUNITY_CARDS.map((community) => (
                  <NeonCard key={community.name} className={`community-card ${community.color}`}>
                    <div className="community-icon" aria-hidden="true">{community.icon}</div>
                    <h4>{community.name}</h4>
                    <p>{community.members}</p>
                    <NeonButton tone="cyan" size="sm">Join Now</NeonButton>
                  </NeonCard>
                ))}
              </div>
            </section>

            <footer className="landing-footer">
              <div className="footer-brand">
                <h4>CryptoPet</h4>
                <p>Build your dream pet roster, rule the arena, and trade legendary companions.</p>
              </div>
              <div className="footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>About</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Roadmap</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Docs</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* Hidden Solana wallet trigger */}
      <SolanaWalletTrigger />
    </div>
  );
};

export default Main;

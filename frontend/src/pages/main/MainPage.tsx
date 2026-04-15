import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Layout from '../../components/layout/Layout';
import PetGallery from '../../components/pet/PetGallery';
import { isInteractionRoute } from '../../constants/interactionRoutes';
import './MainPage.css';

const MainPage: React.FC = () => {
  const location = useLocation();
  /** Full-page interaction routes hide the pet collection. */
  const isGalleryHidden = isInteractionRoute(location.pathname);

  return (
    <Layout contentClassName="authenticated">
      <Outlet />
      {!isGalleryHidden && <PetGallery />}
    </Layout>
  );
};

export default MainPage;

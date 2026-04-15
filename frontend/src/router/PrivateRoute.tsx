import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@shared/core';

import { useDynamicContext } from '../contexts/dynamic';

/** JWT and/or Dynamic wallet session. */
export function useAppLoggedIn(): boolean {
  const { isAuthenticated } = useAuth();
  const { user, primaryWallet } = useDynamicContext();
  return Boolean(isAuthenticated || user || primaryWallet);
}

/**
 * Route guard: render wrapped children when logged in, otherwise redirect to `/landing`.
 * Falls back to an {@link Outlet} for nested-route usage.
 */
export type PrivateRouteProps = {
  children?: React.ReactElement;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isLoggedIn = useAppLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/landing" replace />;
  }
  return children ?? <Outlet />;
}

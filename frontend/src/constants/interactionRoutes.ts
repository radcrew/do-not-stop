/** Dashboard home (hub + gallery). */
export const DASHBOARD_HOME = '/dashboard';

/** Top-level interaction routes (e.g. /breed) — no gallery; interaction UI only. */
export const BREED_PATH = '/breed';
export const BATTLE_PATH = '/battle';
export const LEVELUP_PATH = '/levelup';
export const RENAME_PATH = '/rename';

/** Routes where the layout shows only the interaction flow (gallery hidden). */
export const INTERACTION_ROUTES: readonly string[] = [
  BREED_PATH,
  BATTLE_PATH,
  LEVELUP_PATH,
  RENAME_PATH,
];

export function isInteractionRoute(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return INTERACTION_ROUTES.includes(p);
}

/** Nested interactions under dashboard (legacy / bookmarked URLs). */
export const DASHBOARD_INTERACTIONS = '/dashboard/interactions';

export type InteractionSlug = 'breed' | 'battle' | 'levelup' | 'rename';

export function interactionPath(slug: InteractionSlug): string {
  return `${DASHBOARD_INTERACTIONS}/${slug}`;
}

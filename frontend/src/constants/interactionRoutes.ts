/** Dashboard home (hub + gallery). */
export const DASHBOARD_HOME = '/dashboard';

/** Standalone flows — no gallery; single interaction only. */
export const BREED_PATH = '/breed';
export const BATTLE_PATH = '/battle';
export const LEVELUP_PATH = '/levelup';
export const RENAME_PATH = '/rename';

/** Paths that hide the pet gallery (full-page interaction). */
export const STANDALONE_INTERACTION_PATHS: readonly string[] = [
  BREED_PATH,
  BATTLE_PATH,
  LEVELUP_PATH,
  RENAME_PATH,
];

export function isStandaloneInteractionPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return STANDALONE_INTERACTION_PATHS.includes(p);
}

/** Nested interactions under dashboard (legacy / bookmarked URLs). */
export const DASHBOARD_INTERACTIONS = '/dashboard/interactions';

export type InteractionSlug = 'breed' | 'battle' | 'levelup' | 'rename';

export function interactionPath(slug: InteractionSlug): string {
  return `${DASHBOARD_INTERACTIONS}/${slug}`;
}

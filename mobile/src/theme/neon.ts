/**
 * Neon / cyberpunk palette — shared across screens (landing + in-app).
 */
export const neon = {
    bgDeep: '#05050d',
    bgPanel: '#0a0a18',
    bgCard: '#0f1022',
    bgInput: '#121428',
    cyan: '#00f5ff',
    magenta: '#ff2da6',
    purple: '#c084fc',
    violet: '#7c3aed',
    text: '#eef0ff',
    textMuted: '#8b95b8',
    textDim: '#5c6688',
    border: 'rgba(0, 245, 255, 0.28)',
    borderMagenta: 'rgba(255, 45, 166, 0.35)',
    danger: '#ff4d6d',
    success: '#39ffb4',
    overlay: 'rgba(5, 5, 13, 0.92)',
} as const;

/** iOS glow; Android leans on `elevation` + neon borders on cards. */
export function neonGlow(color: string, radius = 14, opacity = 0.55) {
    return {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: 10,
    };
}

import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const headerRoot = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  backgroundColor: `rgba(10,10,10,0.92)`,
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${vars.color.border}`,
});

export const headerTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.label,
  color: vars.color.text,
  fontWeight: 700,
  letterSpacing: '0.05em',
  flexShrink: 0,
});

export const headerMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

export const pill = style({
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.micro,
  fontFamily: vars.font.body,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
});

export const pillAct1 = style({ borderColor: vars.color.border });
export const pillAct2 = style({ borderColor: vars.color.accent, color: vars.color.accent });
export const pillAct3 = style({ borderColor: vars.color.accentBright, color: vars.color.accentBright });
export const pillDanger = style({ borderColor: vars.color.accentBright, color: vars.color.accentBright });
export const pillCode = style({
  fontFamily: 'monospace',
  letterSpacing: '0.15em',
  borderColor: vars.color.textMuted,
  color: vars.color.text,
});

export const resetBtn = style({
  appearance: 'none',
  background: 'none',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.micro,
  padding: `2px ${vars.space.sm}`,
  cursor: 'pointer',
  fontFamily: vars.font.body,
  ':hover': { borderColor: vars.color.textMuted, color: vars.color.text },
  transition: `all ${vars.transition.fast}`,
});

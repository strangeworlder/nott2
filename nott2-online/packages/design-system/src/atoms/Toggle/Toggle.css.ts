import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const toggleButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.micro,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  border: `1px solid`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: `all ${vars.transition.normal}`,
  background: 'transparent',
  outline: 'none',
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentBright}`,
    outlineOffset: '2px',
  },
});

export const toggleButtonOn = style({
  borderColor: vars.color.successBright,
  color: vars.color.successBright,
  backgroundColor: 'rgba(45, 90, 45, 0.1)',
  boxShadow: vars.shadow.glowGreenBright,
});

export const toggleButtonOff = style({
  borderColor: vars.color.borderSubtle,
  color: vars.color.textMuted,
  ':hover': {
    borderColor: vars.color.text,
    color: vars.color.text,
  },
});

// Switch variant
export const switchWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  cursor: 'pointer',
  userSelect: 'none',
});

export const switchTrack = style({
  position: 'relative',
  width: '48px',
  height: '24px',
  borderRadius: vars.radius.full,
  transition: `all ${vars.transition.normal}`,
  flexShrink: 0,
});

export const switchTrackOn = style({
  backgroundColor: 'rgba(45, 90, 45, 0.2)',
  border: `1px solid ${vars.color.successBright}`,
});

export const switchTrackOff = style({
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: `1px solid ${vars.color.borderSubtle}`,
});

export const switchThumb = style({
  position: 'absolute',
  top: '3px',
  width: '16px',
  height: '16px',
  borderRadius: vars.radius.full,
  transition: `all ${vars.transition.normal}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
});

export const switchThumbOn = style({
  left: '27px',
  backgroundColor: vars.color.successBright,
  boxShadow: vars.shadow.glowGreenSubtle,
});

export const switchThumbOff = style({
  left: '3px',
  backgroundColor: 'rgba(255,255,255,0.5)',
});

export const switchLabel = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.micro,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,
  transition: `color ${vars.transition.normal}`,
});

export const switchLabelOn = style({ color: vars.color.successBright });
export const switchLabelOff = style({ color: vars.color.textMuted });

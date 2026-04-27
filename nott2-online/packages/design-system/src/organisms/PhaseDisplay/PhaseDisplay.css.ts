import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const phaseRoot = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: vars.space['2xl'],
  flex: 1,
});

export const phaseAccent = style({
  boxShadow: `inset 0 0 80px rgba(138, 0, 0, 0.08)`,
});

export const phaseContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  maxWidth: '700px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center',
});

export const phaseTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h1,
  color: vars.color.text,
  margin: 0,
  lineHeight: 1.1,
});

export const phaseSubtitle = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.h3,
  color: vars.color.textMuted,
  margin: 0,
  fontStyle: 'italic',
  lineHeight: 1.4,
});

export const phaseBody = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.body,
  color: vars.color.text,
  margin: 0,
  lineHeight: 1.6,
});

export const phaseSlot = style({
  marginTop: vars.space.lg,
  width: '100%',
});

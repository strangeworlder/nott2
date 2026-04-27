import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const chatPanel = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const messageList = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  scrollbarWidth: 'thin',
  scrollbarColor: `${vars.color.border} transparent`,
});

export const chatBubble = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80%',
  alignSelf: 'flex-start',
});

export const ownBubble = style({
  alignSelf: 'flex-end',
  alignItems: 'flex-end',
});

export const bubbleSender = style({
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  marginBottom: '2px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

export const bubbleText = style({
  backgroundColor: vars.color.surfaceElevated,
  color: vars.color.text,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.label,
  fontFamily: vars.font.body,
  lineHeight: 1.5,
});

export const systemMessage = style({
  textAlign: 'center',
  fontSize: vars.fontSize.micro,
  color: vars.color.textMuted,
  fontStyle: 'italic',
  padding: `${vars.space.xs} 0`,
  borderTop: `1px solid ${vars.color.border}`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const escalationMessage = style({
  backgroundColor: 'rgba(138, 0, 0, 0.1)',
  border: `1px solid ${vars.color.accent}`,
  borderRadius: vars.radius.md,
  color: vars.color.accentBright,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.fontSize.label,
  fontStyle: 'italic',
});

export const genrePointMessage = style({
  backgroundColor: 'rgba(45, 90, 45, 0.1)',
  border: `1px solid ${vars.color.success}`,
  borderRadius: vars.radius.md,
  color: '#4ade80',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.fontSize.label,
});

export const inputRow = style({
  display: 'flex',
  gap: vars.space.xs,
  padding: vars.space.md,
  borderTop: `1px solid ${vars.color.border}`,
});

export const chatInput = style({
  flex: 1,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.label,
  outline: 'none',
  ':focus': { borderColor: vars.color.borderActive },
});

export const sendButton = style({
  backgroundColor: vars.color.accent,
  color: vars.color.text,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: `${vars.space.xs} ${vars.space.md}`,
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  ':disabled': { opacity: 0.4, cursor: 'not-allowed' },
  ':hover': { backgroundColor: vars.color.accentBright },
  transition: `background-color ${vars.transition.fast}`,
});

import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/theme.css';

export const bannerRecipe = recipe({
  base: {
    position: 'relative',
    padding: vars.space['3xl'], // Lots of padding to make it a dominant ribbon
    textAlign: 'center',
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // Remove the straight borders and use an uneven clip-path to make it look physical
    clipPath: 'polygon(1% 2%, 99% 0%, 100% 98%, 0% 100%)',
    // Slight rotation to add to the unsettled feeling
    transform: 'rotate(-1deg)',
  },
  variants: {
    outcome: {
      success: {
        backgroundColor: vars.color.success,
      },
      failure: {
        backgroundColor: vars.color.accent,
      },
    },
  },
  defaultVariants: { outcome: 'failure' },
});

export const bannerTextureOverlay = style({
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  mixBlendMode: 'color-dodge',
  opacity: 0.7,
  pointerEvents: 'none',
  zIndex: 0,
});

export const bannerContent = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  filter: `drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4))`, // Helps the text pop from the background
});

export const bannerWord = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.hero,
  fontWeight: 900,
  margin: 0,
  lineHeight: 1,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.normal,

  // Apply dark metallic/grunge texture to text via inline styles in React
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  WebkitBackgroundClip: 'text',
  WebkitTextStroke: '1px rgba(255, 179, 0, 0.8)', // Amber stroke
  textShadow: '0 0 15px rgba(0, 0, 0, 0.8)',
  backgroundClip: 'text',
  mixBlendMode: 'overlay',
  color: 'transparent',
  opacity: 0.9,
});

export const bannerDetail = style({
  position: 'relative',
  zIndex: 1,
  fontSize: vars.fontSize.lead,
  fontFamily: vars.font.body,
  fontWeight: 700,
  color: vars.color.background, // Solid dark color matching the theme background
  marginTop: vars.space.sm,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.widest,

  '::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '-10%',
    right: '-10%',
    height: '20px',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(90deg, transparent, rgba(255, 179, 0, 0.85), transparent)', // Amber glow
    boxShadow: '0 0 20px 10px rgba(255, 179, 0, 0.5)', // Amber shadow
    borderRadius: '100%',
    zIndex: -1,
  }
});

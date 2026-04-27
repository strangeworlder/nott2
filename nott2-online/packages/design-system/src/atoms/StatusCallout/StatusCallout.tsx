/**
 * StatusCallout
 *
 * Philosophical:
 * These are the game's stage directions — contextual whispers from the system
 * to the player. A purple highlight when aptitude activates. A blue note about
 * round order. A red warning when the breaking point arrives. Each has its own
 * emotional temperature, but they share a common voice: calm, precise, diegetic.
 * They do not shout. They observe.
 *
 * Technical:
 * A bordered callout box with 5 semantic variants. Accepts any children for
 * maximum flexibility. Optionally prepends an icon from the design system.
 *
 * Props:
 * - variant: 'info' | 'warning' | 'danger' | 'success' | 'highlight'. Defaults to 'info'.
 * - icon: Optional IconName rendered before children.
 * - id: Optional id attribute.
 * - children: Callout content.
 */

import React from 'react';
import { statusCalloutRecipe, calloutContent } from './StatusCallout.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

type CalloutVariant = 'info' | 'warning' | 'danger' | 'success' | 'highlight';

interface StatusCalloutProps {
  variant?: CalloutVariant;
  icon?: IconName;
  id?: string;
  children: React.ReactNode;
}

export function StatusCallout({
  variant = 'info',
  icon,
  id,
  children,
}: StatusCalloutProps) {
  return (
    <div id={id} className={statusCalloutRecipe({ variant })} role="status">
      {icon && <Icon name={icon} size={18} />}
      <div className={calloutContent}>{children}</div>
    </div>
  );
}

/**
 * Card (Container)
 *
 * Philosophical:
 * The Card container is the surface on which the game's content rests — a
 * diegetic piece of dark wood or aged paper, depending on the variant. It
 * creates depth and separation in the interface, grouping related mechanics
 * into a single visual unit.
 *
 * In its most common role, Card is an *operational step* — a discrete unit of
 * player action within a phase screen. The `complete` prop marks the step as
 * resolved (green border + checkmark), and the `collapsible` / `collapsed`
 * props allow the content to fold away when no longer needed.
 *
 * Technical:
 * A content grouping container with multiple visual variants. Supports
 * optional title header, interactive hover states, noPadding mode,
 * step completion indicator, and collapsible content.
 *
 * Props:
 * - variant: Visual style. Defaults to 'default'.
 * - title: Optional header string.
 * - interactive: Hover glow effect. Defaults to false.
 * - noPadding: Remove internal padding. Defaults to false.
 * - complete: Mark the step as resolved (green border + checkmark). Defaults to false.
 * - completionLabel: Optional label for the completion indicator (e.g., "Sacrifice confirmed").
 * - collapsible: Whether the card's children can be collapsed. Defaults to false.
 * - collapsed: Whether the card's children are currently collapsed. Defaults to false.
 * - onToggleCollapse: Callback fired when the user clicks the collapse toggle.
 * - children: Card content.
 */

import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon/Icon';
import {
  cardRecipe,
  cardTitleRow,
  cardTitleText,
  cardTitle as cardTitleLegacy,
  completionIndicator,
  collapsibleContent,
  collapsibleContentOpen,
  collapsibleContentClosed,
  collapseToggle,
} from './Card.css';

export type CardVariant =
  | 'default' | 'muted' | 'highlighted' | 'success'
  | 'failure' | 'instruction' | 'ghost';

export interface CardProps {
  variant?: CardVariant;
  title?: string;
  interactive?: boolean;
  noPadding?: boolean;
  complete?: boolean;
  completionLabel?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  children: React.ReactNode;
  id?: string;
}

export function Card({
  variant = 'default',
  title,
  interactive = false,
  noPadding = false,
  complete = false,
  completionLabel,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  children,
  id,
}: CardProps) {
  const renderTitle = () => {
    if (!title) return null;

    if (complete) {
      return (
        <div className={cardTitleRow}>
          <Icon name="check_circle" size={20} color="success" />
          <h3 className={cardTitleText} style={{ color: 'var(--color-success)' }}>{title}</h3>
        </div>
      );
    }

    return <h3 className={cardTitleLegacy}>{title}</h3>;
  };

  const renderCompletionLabel = () => {
    if (!complete || !completionLabel) return null;
    return (
      <div className={completionIndicator} data-testid="completion-indicator">
        {completionLabel}
      </div>
    );
  };

  const renderCollapseToggle = () => {
    if (!collapsible) return null;
    return (
      <button
        type="button"
        className={collapseToggle}
        onClick={onToggleCollapse}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand card content' : 'Collapse card content'}
      >
        <Icon name={collapsed ? 'expand_more' : 'expand_less'} size={16} />
        {collapsed ? 'Show details' : 'Hide details'}
      </button>
    );
  };

  return (
    <div
      id={id}
      className={cardRecipe({ variant: complete ? 'success' : variant, interactive, noPadding, complete })}
    >
      {renderTitle()}
      {renderCompletionLabel()}
      {collapsible ? (
        <div className={clsx(collapsibleContent, collapsed ? collapsibleContentClosed : collapsibleContentOpen)}>
          {children}
        </div>
      ) : (
        children
      )}
      {renderCollapseToggle()}
    </div>
  );
}

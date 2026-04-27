/**
 * Separator
 *
 * Philosophical:
 * A visual breath between content sections. In horror, silence can be as important as
 * sound — this separator creates a moment of pause, a thin line between what came before
 * and what lurks ahead. It is deliberately understated: a suggestion of division,
 * not a wall.
 *
 * Technical:
 * A simple horizontal rule rendered as an <hr> element.
 *
 * Props:
 * - None.
 */

import React from 'react';
import { separatorStyle } from './Separator.css';

export function Separator() {
  return <hr className={separatorStyle} role="separator" />;
}

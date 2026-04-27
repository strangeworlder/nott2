/**
 * TextField
 *
 * Philosophical:
 * The TextField is the gateway to player expression — naming a character, scrawling
 * a desperate note, entering a room code. In a horror TTRPG, every input carries weight;
 * the field's dark surface and blood-red focus glow remind the player they are inscribing
 * something into the game's reality. Error states pulse with warning, helper text whispers
 * guidance from the margins.
 *
 * Technical:
 * A controlled single-line text input with an integrated label, helper/error messaging,
 * and optional character count. Built on Vanilla Extract recipes for variant/size theming.
 *
 * Props:
 * - value: Current input value (controlled).
 * - onChange: Value change handler.
 * - label: Optional visible label above the input.
 * - placeholder: Placeholder text.
 * - helperText: Guidance text below the input.
 * - error: Error message; when set, the field enters an error state.
 * - variant: Visual style — 'default' or 'ghost'. Defaults to 'default'.
 * - size: Size scale — 'sm' | 'md' | 'lg'. Defaults to 'md'.
 * - disabled: Disables interaction.
 * - required: Marks the field as required (visual indicator + aria).
 * - maxLength: Maximum character count (shows counter when set).
 * - type: HTML input type. Defaults to 'text'.
 * - autoComplete: HTML autocomplete attribute.
 * - autoFocus: Whether to autofocus on mount.
 * - name: Form field name.
 * - id: HTML id (auto-generated if label is provided and id is omitted).
 * - onBlur: Blur handler.
 * - onFocus: Focus handler.
 * - onKeyDown: Keyboard event handler.
 *
 * Events:
 * - onChange(value: string)
 * - onBlur(event: React.FocusEvent)
 * - onFocus(event: React.FocusEvent)
 * - onKeyDown(event: React.KeyboardEvent)
 */

import React, { useId } from 'react';
import { clsx } from 'clsx';
import {
  textFieldRecipe,
  fieldWrapper,
  labelStyle,
  requiredIndicator,
  helperTextStyle,
  errorTextStyle,
  charCountStyle,
  charCountWarning,
} from './TextField.css';

type TextFieldVariant = 'default' | 'ghost';
type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TextField({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  error,
  variant = 'default',
  size = 'md',
  disabled = false,
  required = false,
  maxLength,
  type = 'text',
  autoComplete,
  autoFocus,
  name,
  id: externalId,
  onBlur,
  onFocus,
  onKeyDown,
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = externalId ?? `textfield-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const showCharCount = maxLength !== undefined;
  const charCount = value.length;
  const isNearLimit = maxLength !== undefined && charCount >= maxLength * 0.9;

  const describedBy = [
    hasError ? errorId : undefined,
    helperText ? helperId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={fieldWrapper}>
      {label && (
        <label htmlFor={inputId} className={labelStyle}>
          {label}
          {required && <span className={requiredIndicator} aria-hidden="true"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={textFieldRecipe({ variant, size, hasError })}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {hasError && (
            <p id={errorId} className={errorTextStyle} role="alert">
              {error}
            </p>
          )}
          {!hasError && helperText && (
            <p id={helperId} className={helperTextStyle}>
              {helperText}
            </p>
          )}
        </div>
        {showCharCount && (
          <span className={clsx(charCountStyle, isNearLimit && charCountWarning)} aria-live="polite">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * TextArea
 *
 * Philosophical:
 * The TextArea is the space for longer thoughts — a character's backstory, a scene
 * description, a GM's whispered narration. Where the TextField is a scrawled note,
 * the TextArea is a journal page, inviting the player to pour more of themselves
 * into the game. The resizable handle is a subtle affordance: "there's always room
 * for more horror."
 *
 * Technical:
 * A controlled multi-line text input sharing the same field wrapper, label, error/helper
 * messaging, and character count system as TextField. Adds textarea-specific props for
 * rows and resize behavior.
 *
 * Props:
 * - value: Current text value (controlled).
 * - onChange: Value change handler.
 * - label: Optional visible label above the textarea.
 * - placeholder: Placeholder text.
 * - helperText: Guidance text below the textarea.
 * - error: Error message; when set, the field enters an error state.
 * - variant: Visual style — 'default' or 'ghost'. Defaults to 'default'.
 * - size: Size scale — 'sm' | 'md' | 'lg'. Defaults to 'md'.
 * - disabled: Disables interaction.
 * - required: Marks the field as required (visual indicator + aria).
 * - maxLength: Maximum character count (shows counter when set).
 * - rows: Number of visible text rows. Defaults to 4.
 * - resize: Resize behavior — 'none' | 'vertical' | 'horizontal' | 'both'. Defaults to 'vertical'.
 * - name: Form field name.
 * - id: HTML id.
 * - autoFocus: Whether to autofocus on mount.
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
  textAreaRecipe,
  fieldWrapper,
  labelStyle,
  requiredIndicator,
  helperTextStyle,
  errorTextStyle,
  charCountStyle,
  charCountWarning,
} from './TextField.css';

type TextAreaVariant = 'default' | 'ghost';
type TextAreaSize = 'sm' | 'md' | 'lg';
type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  resize?: TextAreaResize;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({
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
  rows = 4,
  resize = 'vertical',
  name,
  id: externalId,
  autoFocus,
  onBlur,
  onFocus,
  onKeyDown,
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = externalId ?? `textarea-${generatedId}`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
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
        <label htmlFor={textareaId} className={labelStyle}>
          {label}
          {required && <span className={requiredIndicator} aria-hidden="true"> *</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        autoFocus={autoFocus}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={textAreaRecipe({ variant, size, resize, hasError })}
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

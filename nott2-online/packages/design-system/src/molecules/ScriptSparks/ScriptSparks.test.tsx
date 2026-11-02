import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScriptSparks } from './ScriptSparks';

const SAMPLE_WORDS_18 = [
  'Meat',
  'Wound',
  'Electronics',
  'Clanking',
  'Leverage',
  'Paranoia',
  'Alibi',
  'Splinter',
  'Barricade',
  'Dripping',
  'Copper',
  'Flicker',
  'Rot',
  'Echo',
  'Shadow',
  'Humid',
  'Scraping',
  'Silence',
] as const;

const SAMPLE_QUESTIONS = [
  'What does it look like?',
  'What does it smell like?',
  'How close is the Killer?',
  'Is it pitch black?',
  'How dark is it?',
] as const;

describe('ScriptSparks', () => {
  it('renders the trigger button when closed', () => {
    render(<ScriptSparks words={SAMPLE_WORDS_18} />);
    expect(screen.getByRole('button', { name: /Need a Spark\?/i })).toBeTruthy();
    expect(screen.queryByTestId('spark-words')).toBeNull();
  });

  it('reveals 9 evocative words when opened', () => {
    render(<ScriptSparks words={SAMPLE_WORDS_18} />);
    fireEvent.click(screen.getByRole('button', { name: /Need a Spark\?/i }));

    const wordsContainer = screen.getByTestId('spark-words');
    expect(wordsContainer.children).toHaveLength(9);
  });

  it('renders optional Focus the Camera questions when provided', () => {
    render(
      <ScriptSparks
        words={SAMPLE_WORDS_18}
        questions={SAMPLE_QUESTIONS}
        defaultOpen
      />,
    );
    expect(screen.getByTestId('spark-words').children).toHaveLength(9);
    const questionsSection = screen.getByTestId('camera-questions');
    expect(questionsSection).toBeTruthy();
    expect(screen.getByText(/What does it smell like\?/i)).toBeTruthy();
  });

  it('deals 9 fresh non-overlapping words when Shuffle Words is clicked', () => {
    const onReload = vi.fn();
    render(
      <ScriptSparks
        words={SAMPLE_WORDS_18}
        onReload={onReload}
        defaultOpen
      />,
    );

    const initialWords = Array.from(
      screen.getByTestId('spark-words').children,
    ).map(el => el.textContent);
    expect(initialWords).toHaveLength(9);

    const shuffleBtn = screen.getByRole('button', {
      name: /Shuffle nine new spark words/i,
    });
    fireEvent.click(shuffleBtn);

    expect(onReload).toHaveBeenCalledTimes(1);

    const nextWords = Array.from(
      screen.getByTestId('spark-words').children,
    ).map(el => el.textContent);
    expect(nextWords).toHaveLength(9);

    // With 18 unique words in the pool and 9 drawn, excluding the previous 9 guarantees 0 overlap!
    for (const word of nextWords) {
      expect(initialWords).not.toContain(word);
    }
  });

  it('closes the tray when Close is clicked', () => {
    render(<ScriptSparks words={SAMPLE_WORDS_18} defaultOpen />);
    fireEvent.click(screen.getByRole('button', { name: /Close script ideas/i }));
    expect(screen.queryByTestId('spark-words')).toBeNull();
    expect(screen.getByRole('button', { name: /Need a Spark\?/i })).toBeTruthy();
  });

  it('returns null when words and questions are both empty', () => {
    const { container } = render(<ScriptSparks words={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

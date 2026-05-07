import type { Meta, StoryObj } from '@storybook/react';
import { CharacterBar } from './CharacterBar';
import type { CharacterBarCharacter } from './CharacterBar';

const CHARACTERS: CharacterBarCharacter[] = [
  { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false },
  { id: 'Hearts',   name: 'Jamie', strikes: 1, isDead: false },
  { id: 'Clubs',    name: 'Sam',   strikes: 2, isDead: false },
  { id: 'Diamonds', name: 'Casey', strikes: 3, isDead: true },
];

const meta = {
  title: 'Organisms/CharacterBar',
  component: CharacterBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CharacterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    characters: CHARACTERS,
    activeCharacterId: 'Spades',
    genrePoints: { Hearts: 2 },
    tableGenrePoints: 4,
  },
};

export const NoneActive: Story = {
  args: {
    characters: CHARACTERS,
    activeCharacterId: null,
    genrePoints: {},
    tableGenrePoints: 2,
  },
};

export const AllAlive: Story = {
  args: {
    characters: [
      { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false },
      { id: 'Hearts',   name: 'Jamie', strikes: 0, isDead: false },
      { id: 'Clubs',    name: 'Sam',   strikes: 0, isDead: false },
      { id: 'Diamonds', name: 'Casey', strikes: 0, isDead: false },
    ],
    activeCharacterId: 'Clubs',
    genrePoints: { Spades: 1, Clubs: 2 },
    tableGenrePoints: 6,
  },
};

export const TurnOrderMidRound: Story = {
  args: {
    characters: [
      { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false, hasAceToken: true, hasActed: true },
      { id: 'Hearts',   name: 'Jamie', strikes: 1, isDead: false, hasAceToken: true, hasActed: false },
      { id: 'Clubs',    name: 'Sam',   strikes: 0, isDead: false, hasAceToken: true, hasActed: false },
      { id: 'Diamonds', name: 'Casey', strikes: 3, isDead: true,  hasAceToken: true, hasActed: false },
    ],
    activeCharacterId: 'Hearts',
    genrePoints: { Hearts: 1 },
    tableGenrePoints: 8,
  },
};

export const PrologueNoTokens: Story = {
  args: {
    characters: [
      { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false },
      { id: 'Hearts',   name: 'Jamie', strikes: 0, isDead: false },
      { id: 'Clubs',    name: 'Sam',   strikes: 0, isDead: false },
      { id: 'Diamonds', name: 'Casey', strikes: 0, isDead: false },
    ],
    activeCharacterId: 'Spades',
    genrePoints: {},
    tableGenrePoints: 13,
  },
};

export const RoundComplete: Story = {
  args: {
    characters: [
      { id: 'Spades',   name: 'Alex',  strikes: 1, isDead: false, hasAceToken: true, hasActed: true },
      { id: 'Hearts',   name: 'Jamie', strikes: 0, isDead: false, hasAceToken: true, hasActed: true },
      { id: 'Clubs',    name: 'Sam',   strikes: 2, isDead: false, hasAceToken: true, hasActed: true },
      { id: 'Diamonds', name: 'Casey', strikes: 0, isDead: false, hasAceToken: true, hasActed: true },
    ],
    activeCharacterId: null,
    genrePoints: { Spades: 2, Hearts: 1 },
    tableGenrePoints: 5,
  },
};

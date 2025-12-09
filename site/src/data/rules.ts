/**
 * rules
 *
 * Philosophical:
 * The Codex. A static repository of the game's laws. It holds the definitions
 * of "Effort", "Strikes", and "Roles" that govern the players' interactions.
 *
 * Technical:
 * Exports static data structures defining the core rules text and mechanics explanations.
 */
import defaultRulesData from './default/rules.json';

export interface Effort {
  level: number;
  title: string;
  description: string;
  mechanic: string;
}

export interface BasicRulesContent {
  d13: {
    title: string;
    description: string;
    note: string;
  };
  gameLoopTitle: string;
  gameLoop: {
    step: string;
    description: string;
  }[];
  strikes: {
    title: string;
    triggers: string[];
    consequence: string;
  };
  genrePoints: {
    title: string;
    description: string;
  };
  deckRules: {
    title: string;
    setupLabel: string;
    threat: {
      title: string;
      setup: string;
      mechanic: string;
    };
    reserves: {
      title: string;
      piles: string[];
    };
    trophy: {
      title: string;
      setup: string;
      mechanic: string;
    };
  };
  deckUpdates: {
    title: string;
    successLabel: string;
    failureLabel: string;
    aces: {
      title: string;
      description: string;
    };
    numberCards: {
      title: string;
      success: string;
      failure: string;
    };
    faceCards: {
      title: string;
      success: string;
      failure: string;
    };
  };
  endgame: {
    title: string;
    triggerLabel: string;
    setupLabel: string;
    acts: {
      title: string;
      description: string;
    }[];
    trigger: string;
    setup: string;
    redJoker: {
      title: string;
      effect: string;
      success: string;
      failure: string;
    };
    blackJoker: {
      title: string;
      effect: string;
      success: string;
      failure: string;
    };
  };
  rulesModules: {
    title: string;
    modules: {
      name: string;
      description: string;
    }[];
  };
}

export interface CharacterRulesContent {
  creationTitle: string;
  aptitudesTitle: string;
  archetypesTitle: string;
  creationSteps: string[];
  aptitudes: {
    description: string;
    list: {
      suit: string;
      name: string;
      description: string;
    }[];
  };
  archetypes: {
    suit: string;
    aptitude: string;
    examples: string[];
  }[];
}

export interface RulesContent {
  effortScale: Effort[];
  basicRules: BasicRulesContent;
  characterRules: CharacterRulesContent;
}

const typedRules = defaultRulesData as RulesContent;

export const effortScale: Effort[] = typedRules.effortScale;
export const basicRules: BasicRulesContent = typedRules.basicRules;
export const characterRules: CharacterRulesContent = typedRules.characterRules;

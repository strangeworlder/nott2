import { marked } from 'marked';

// Load all JSON data files
const dataFiles = import.meta.glob('../data/**/*.json', { eager: true });

function deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
        return source;
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        return source; // Replace arrays
    }

    if (Array.isArray(target) || Array.isArray(source)) {
        return source; // Type mismatch, replace
    }

    const result = { ...target };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                result[key] = deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }
    return result;
}

function loadData<T>(filename: string, playsetId?: string | null): T {
    const defaultPath = `../data/default/${filename}`;
    const defaultModule = dataFiles[defaultPath] as { default: T } | undefined;

    let data = defaultModule ? defaultModule.default : {} as T;

    if (playsetId && playsetId !== 'default') {
        const playsetPath = `../data/${playsetId}/${filename}`;
        const playsetModule = dataFiles[playsetPath] as { default: T } | undefined;

        if (playsetModule) {
            data = deepMerge(data, playsetModule.default);
        }
    }

    return data;
}

export interface PlaysetData {
    id: string;
    name: string;
    description: string;
    details: {
        label: string;
        items: string[];
    }[];
}

export interface GameSetupContent {
    title: string;
    intro: string;
    playsetSelectionTitle: string;
    playsets: PlaysetData[];
    buttonText: string;
}

export interface ActSetupSection {
    title: string;
    intro?: string;
    steps: string[];
    footer?: string;
}

export interface ActSetupContent {
    title: string;
    quote: string;
    sections: ActSetupSection[];
    buttonText: string;
}

export interface WelcomeScreenContent {
    title: string;
    intro: string[];
    infoGrid: {
        label: string;
        value: string;
        icon: string;
    }[];
    buttonText: string;
}

export function getGameSetupContent(playsetId?: string | null): GameSetupContent {
    const data = loadData<any>('gameSetup.json', playsetId);
    return {
        title: data.title,
        intro: marked.parseInline(data.intro) as string,
        playsetSelectionTitle: data.playsetSelectionTitle,
        playsets: data.playsets,
        buttonText: data.buttonText
    };
}

export function getActSetupContent(act: number, playsetId?: string | null): ActSetupContent | null {
    const data = loadData<any>('actSetup.json', playsetId);
    const actData = data[act.toString()];

    if (!actData) return null;

    return {
        title: actData.title,
        quote: marked.parseInline(actData.quote) as string,
        sections: actData.sections ? actData.sections.map((section: any) => ({
            title: section.title,
            intro: section.intro ? marked.parseInline(section.intro) as string : undefined,
            steps: section.steps.map((step: string) => marked.parseInline(step) as string),
            footer: section.footer ? marked.parseInline(section.footer) as string : undefined
        })) : [],
        buttonText: actData.buttonText
    };
}

export function getWelcomeScreenContent(playsetId?: string | null): WelcomeScreenContent {
    const data = loadData<any>('welcomeScreen.json', playsetId);

    const intro = data.intro.map((text: string) => marked.parseInline(text) as string);

    const infoGrid = data.infoGrid.map((item: any) => {
        let value = item.value;
        if (Array.isArray(value)) {
            value = marked.parseInline(value.join('<br>')) as string;
        }
        return {
            label: item.label,
            value: value as string,
            icon: item.icon
        };
    });

    return {
        title: data.title,
        intro: intro,
        infoGrid: infoGrid,
        buttonText: data.buttonText
    };
}

export interface SceneSetupContent {
    explanations: {
        aces: string;
        finale: string;
        default: string;
    };
    guidance: {
        draw: string;
        select: string;
        selected: string;
        faceCardActive: string;
        faceCardWarning: string;
    };
    ui: {
        selectedLabel: string;
        drawButton: string;
        promptTitle: string;
        startButton: string;
    };
}

export function getSceneSetupContent(playsetId?: string | null): SceneSetupContent {
    const data = loadData<any>('sceneSetup.json', playsetId);

    return {
        explanations: {
            aces: marked.parseInline(data.explanations.aces) as string,
            finale: marked.parseInline(data.explanations.finale) as string,
            default: marked.parseInline(data.explanations.default) as string
        },
        guidance: {
            draw: marked.parseInline(data.guidance.draw) as string,
            select: marked.parseInline(data.guidance.select) as string,
            selected: marked.parseInline(data.guidance.selected) as string,
            faceCardActive: marked.parseInline(data.guidance.faceCardActive) as string,
            faceCardWarning: marked.parseInline(data.guidance.faceCardWarning) as string
        },
        ui: data.ui
    };
}

export interface ConversationAndStakesContent {
    intro: string;
    actDescriptions: {
        "1": string;
        "2": string;
        "3": string;
    };
    steps: {
        setScene: {
            title: string;
            activePlayer1: string;
            otherPlayers: string;
            activePlayer2: string;
        };
        focusCamera: {
            title: string;
            intro: string;
        };
        defineGoals: {
            title: string;
            intro: string;
            quote: string;
            caption: string;
        };
        commitToEffort: {
            title: string;
            quote: string;
            caption: string;
        };
    };
    ui: {
        checkboxLabel: string;
        buttonText: string;
    };
}

export function getConversationAndStakesContent(playsetId?: string | null): ConversationAndStakesContent {
    const data = loadData<any>('conversationAndStakes.json', playsetId);

    return {
        intro: marked.parseInline(data.intro) as string,
        actDescriptions: data.actDescriptions,
        steps: {
            setScene: {
                title: data.steps.setScene.title,
                activePlayer1: marked.parseInline(data.steps.setScene.activePlayer1) as string,
                otherPlayers: marked.parseInline(data.steps.setScene.otherPlayers) as string,
                activePlayer2: marked.parseInline(data.steps.setScene.activePlayer2) as string
            },
            focusCamera: {
                title: data.steps.focusCamera.title,
                intro: marked.parseInline(data.steps.focusCamera.intro) as string
            },
            defineGoals: {
                title: data.steps.defineGoals.title,
                intro: marked.parseInline(data.steps.defineGoals.intro) as string,
                quote: marked.parseInline(data.steps.defineGoals.quote) as string,
                caption: marked.parseInline(data.steps.defineGoals.caption) as string
            },
            commitToEffort: {
                title: data.steps.commitToEffort.title,
                quote: marked.parseInline(data.steps.commitToEffort.quote) as string,
                caption: marked.parseInline(data.steps.commitToEffort.caption) as string
            }
        },
        ui: data.ui
    };
}

export interface CssContent {
    colors: Record<string, string>;
    fonts: Record<string, string>;
}

export function getCssContent(playsetId?: string | null): CssContent {
    return loadData<CssContent>('css.json', playsetId);
}

export interface SensoryPromptsContent {
    [key: string]: string[];
}

export function getSensoryPrompts(playsetId?: string | null): SensoryPromptsContent {
    return loadData<SensoryPromptsContent>('sensoryPrompts.json', playsetId);
}

export interface ResolutionPhaseContent {
    intro: string;
    targetDifficulty: {
        title: string;
        base: string;
        mod: string;
        total: string;
        explanation: string;
        numberCardTitle: string;
        numberCardExplanation: string;
    };
    dice: {
        main: string;
        effort: string;
    };
    reminders: {
        genrePoint: {
            title: string;
            labelOn: string;
            labelOff: string;
            countLabel: string;
            noneAvailable: string;
            description: string;
        };
        aptitude: {
            title: string;
            description: string;
        };
    };
    results: {
        totalResult: string;
        success: string;
        failure: string;
    };
    buttonText: string;
}

export function getResolutionPhaseContent(playsetId?: string | null): ResolutionPhaseContent {
    const data = loadData<any>('resolutionPhase.json', playsetId);

    return {
        intro: marked.parseInline(data.intro) as string,
        targetDifficulty: data.targetDifficulty,
        dice: data.dice,
        reminders: data.reminders,
        results: data.results,
        buttonText: data.buttonText
    };
}

export interface PlaysetConfig {
    overrides?: Record<string, boolean>;
}

export function getPlaysetConfig(playsetId?: string | null): PlaysetConfig {
    return loadData<PlaysetConfig>('config.json', playsetId);
}

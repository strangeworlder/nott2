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

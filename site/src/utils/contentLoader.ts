import { marked } from 'marked';
import gameSetupData from '../data/default/gameSetup.json';
import welcomeScreenData from '../data/default/welcomeScreen.json';
import actSetupData from '../data/default/actSetup.json';

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

export function getGameSetupContent(): GameSetupContent {
    return {
        title: gameSetupData.title,
        intro: marked.parseInline(gameSetupData.intro) as string,
        playsetSelectionTitle: gameSetupData.playsetSelectionTitle,
        playsets: gameSetupData.playsets,
        buttonText: gameSetupData.buttonText
    };
}

export function getActSetupContent(act: number): ActSetupContent | null {
    const data = (actSetupData as any)[act.toString()];
    if (!data) return null;

    return {
        title: data.title,
        quote: marked.parseInline(data.quote) as string,
        sections: data.sections.map((section: any) => ({
            title: section.title,
            intro: section.intro ? marked.parseInline(section.intro) as string : undefined,
            steps: section.steps.map((step: string) => marked.parseInline(step) as string),
            footer: section.footer ? marked.parseInline(section.footer) as string : undefined
        })),
        buttonText: data.buttonText
    };
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

export function getWelcomeScreenContent(): WelcomeScreenContent {
    const intro = welcomeScreenData.intro.map(text => marked.parseInline(text) as string);

    const infoGrid = welcomeScreenData.infoGrid.map(item => {
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
        title: welcomeScreenData.title,
        intro: intro,
        infoGrid: infoGrid,
        buttonText: welcomeScreenData.buttonText
    };
}

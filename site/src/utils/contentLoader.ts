import { marked } from 'marked';
import welcomeScreenData from '../data/default/welcomeScreen.json';

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

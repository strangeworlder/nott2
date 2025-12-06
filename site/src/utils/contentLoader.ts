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
    const playsets = getAvailablePlaysets();

    return {
        title: data.title,
        intro: marked.parseInline(data.intro) as string,
        playsetSelectionTitle: data.playsetSelectionTitle,
        playsets: playsets,
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

export interface ResolveScenePhaseContent {
    ingress: string;
    outcome: {
        success: {
            title: string;
            body: string;
            caption: string;
        };
        failure: {
            title: string;
            body: string;
            caption: string;
        };
    };
    effort: {
        title: string;
        defaultTitle: string;
        none: string;
    };
    instruction: {
        title: string;
        body: string;
    };
    buttonLabel: string;
}

export function getResolveScenePhaseContent(playsetId?: string | null): ResolveScenePhaseContent {
    const data = loadData<any>('resolveScenePhase.json', playsetId);

    return {
        ingress: marked.parseInline(data.ingress) as string,
        outcome: {
            success: {
                title: data.outcome.success.title,
                body: marked.parseInline(data.outcome.success.body) as string,
                caption: marked.parseInline(data.outcome.success.caption) as string
            },
            failure: {
                title: data.outcome.failure.title,
                body: marked.parseInline(data.outcome.failure.body) as string,
                caption: marked.parseInline(data.outcome.failure.caption) as string
            }
        },
        effort: data.effort,
        instruction: {
            title: data.instruction.title,
            body: marked.parseInline(data.instruction.body) as string
        },
        buttonLabel: data.buttonLabel
    };
}

export interface PlaysetConfig {
    name?: string;
    description?: string;
    details?: {
        label: string;
        items: string[];
    }[];
    overrides?: Record<string, boolean>;
    rulesModules?: Record<string, boolean>;
}

export interface RulesModuleDefinition {
    label: string;
    description: string;
}

export interface RulesModulesContent {
    [key: string]: RulesModuleDefinition;
}

export interface FalloutPhaseContent {
    intro: string;
    genrePoint: {
        title: string;
        body: string;
        labelOn: string;
        labelOff: string;
        caption: string;
    };
    decks: {
        title: string;
        success: {
            title: string;
            caption: string;
        };
        failure: {
            title: string;
            caption: string;
        };
    };
    jokers: {
        red: {
            victory: {
                title: string;
                body: string;
                caption: string;
            };
            defeat: {
                title: string;
                body: string;
                shuffle: string;
            };
        };
        black: {
            remove: {
                title: string;
                body: string;
            };
            success: {
                title: string;
                body: string;
            };
            failure: {
                title: string;
                body: string;
            };
        };
    };
    standard: {
        success: {
            trophy: {
                title: string;
                body: string;
                caption: string;
            };
            reserve: {
                title: string;
                body: string;
            };
            weakness: {
                title: string;
                found: {
                    title: string;
                    caption: string;
                    action: string;
                };
                known: {
                    title: string;
                    caption: string;
                    action: string;
                };
            };
            retaliate: {
                title: string;
                add: string;
                empty: string;
            };
            remains: {
                title: string;
                body: string;
            };
        };
        failure: {
            threat: {
                title: string;
                body: string;
            };
            reserve: {
                title: string;
                body: string;
            };
            strikes: {
                title: string;
                body: string;
            };
            grow: {
                title: string;
                add: string;
                empty: string;
            };
            remains: {
                title: string;
                body: string;
            };
        };
    };
    buttons: {
        finish: string;
        next: string;
    };
}

export function getFalloutPhaseContent(playsetId?: string | null): FalloutPhaseContent {
    const data = loadData<any>('falloutPhase.json', playsetId);

    return {
        intro: marked.parseInline(data.intro) as string,
        genrePoint: data.genrePoint,
        decks: data.decks,
        jokers: {
            red: {
                victory: {
                    title: data.jokers.red.victory.title,
                    body: marked.parseInline(data.jokers.red.victory.body) as string,
                    caption: marked.parseInline(data.jokers.red.victory.caption) as string
                },
                defeat: {
                    title: data.jokers.red.defeat.title,
                    body: marked.parseInline(data.jokers.red.defeat.body) as string,
                    shuffle: marked.parseInline(data.jokers.red.defeat.shuffle) as string
                }
            },
            black: {
                remove: {
                    title: data.jokers.black.remove.title,
                    body: marked.parseInline(data.jokers.black.remove.body) as string
                },
                success: {
                    title: data.jokers.black.success.title,
                    body: marked.parseInline(data.jokers.black.success.body) as string
                },
                failure: {
                    title: data.jokers.black.failure.title,
                    body: marked.parseInline(data.jokers.black.failure.body) as string
                }
            }
        },
        standard: {
            success: {
                trophy: {
                    title: data.standard.success.trophy.title,
                    body: marked.parseInline(data.standard.success.trophy.body) as string,
                    caption: marked.parseInline(data.standard.success.trophy.caption) as string
                },
                reserve: {
                    title: data.standard.success.reserve.title,
                    body: marked.parseInline(data.standard.success.reserve.body) as string
                },
                weakness: {
                    title: data.standard.success.weakness.title,
                    found: {
                        title: marked.parseInline(data.standard.success.weakness.found.title) as string,
                        caption: marked.parseInline(data.standard.success.weakness.found.caption) as string,
                        action: marked.parseInline(data.standard.success.weakness.found.action) as string
                    },
                    known: {
                        title: marked.parseInline(data.standard.success.weakness.known.title) as string,
                        caption: marked.parseInline(data.standard.success.weakness.known.caption) as string,
                        action: marked.parseInline(data.standard.success.weakness.known.action) as string
                    }
                },
                retaliate: {
                    title: data.standard.success.retaliate.title,
                    add: marked.parseInline(data.standard.success.retaliate.add) as string,
                    empty: marked.parseInline(data.standard.success.retaliate.empty) as string
                },
                remains: {
                    title: data.standard.success.remains.title,
                    body: marked.parseInline(data.standard.success.remains.body) as string
                }
            },
            failure: {
                threat: {
                    title: data.standard.failure.threat.title,
                    body: marked.parseInline(data.standard.failure.threat.body) as string
                },
                reserve: {
                    title: data.standard.failure.reserve.title,
                    body: marked.parseInline(data.standard.failure.reserve.body) as string
                },
                strikes: {
                    title: data.standard.failure.strikes.title,
                    body: marked.parseInline(data.standard.failure.strikes.body) as string
                },
                grow: {
                    title: data.standard.failure.grow.title,
                    add: marked.parseInline(data.standard.failure.grow.add) as string,
                    empty: marked.parseInline(data.standard.failure.grow.empty) as string
                },
                remains: {
                    title: data.standard.failure.remains.title,
                    body: marked.parseInline(data.standard.failure.remains.body) as string
                }
            }
        },
        buttons: data.buttons
    };
}

export interface ManualCardEntryContent {
    title: string;
    joker: {
        title: string;
        red: string;
        black: string;
        none: string;
    };
    buttons: {
        cancel: string;
        add: string;
    };
}

export function getManualCardEntryContent(playsetId?: string | null): ManualCardEntryContent {
    return loadData<ManualCardEntryContent>('manualCardEntry.json', playsetId);
}

export function getPlaysetConfig(playsetId?: string | null): PlaysetConfig {
    return loadData<PlaysetConfig>('config.json', playsetId);
}

export function getRulesModuleDefinitions(playsetId?: string | null): RulesModulesContent {
    return loadData<RulesModulesContent>('rulesModules.json', playsetId);
}

export function getAvailablePlaysets(): PlaysetData[] {
    const playsets: PlaysetData[] = [];

    for (const path in dataFiles) {
        if (path.endsWith('config.json')) {
            const parts = path.split('/');
            const id = parts[parts.length - 2];

            const module = dataFiles[path] as { default: PlaysetConfig };
            const config = module.default;

            if (config.name && config.description && config.details) {
                playsets.push({
                    id: id,
                    name: config.name,
                    description: config.description,
                    details: config.details
                });
            }
        }
    }

    // Ensure default is first
    return playsets.sort((a, b) => {
        if (a.id === 'default') return -1;
        if (b.id === 'default') return 1;
        return a.name.localeCompare(b.name);
    });
}

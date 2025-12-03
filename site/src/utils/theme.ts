import { getCssContent } from './contentLoader'

function getRgbFromColor(color: string): string | null {
    const div = document.createElement('div')
    div.style.color = color
    document.body.appendChild(div)
    const computed = window.getComputedStyle(div).color
    document.body.removeChild(div)

    // computed is usually "rgb(r, g, b)" or "rgba(r, g, b, a)"
    const match = computed.match(/(\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`
    }
    return null
}

export function updateTheme(playsetId?: string | null) {
    const cssData = getCssContent(playsetId)
    const root = document.documentElement

    // Set colors
    if (cssData.colors) {
        Object.entries(cssData.colors).forEach(([key, value]) => {
            const rgb = getRgbFromColor(value)
            if (rgb) {
                root.style.setProperty(`--color-${key}`, rgb)
            } else {
                console.warn(`Could not convert color "${value}" to RGB for key "${key}"`)
                // Fallback: try to set it anyway, though it might break opacity
                root.style.setProperty(`--color-${key}`, value)
            }
        })
    }

    // Set fonts
    if (cssData.fonts) {
        Object.entries(cssData.fonts).forEach(([key, value]) => {
            root.style.setProperty(`--font-${key}`, value)
        })
    }
}

export const initializeTheme = () => updateTheme(null)

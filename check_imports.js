const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, 'site/src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.vue')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const htmlTags = new Set([
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
    'slot', 'component', 'router-view', 'router-link', 'transition', 'transition-group', 'keep-alive', 'teleport', 'suspense',
    'circle', 'polyline', 'path', 'rect', 'line', 'g', 'defs', 'clipPath', 'mask', 'use', 'symbol', 'marker', 'linearGradient', 'radialGradient', 'stop', 'text', 'tspan'
]);

const files = getAllFiles(rootDir);
let hasErrors = false;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');

    // Extract script content
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const scriptContent = scriptMatch ? scriptMatch[1] : '';

    // Extract imports
    const imports = new Set();
    const importRegex = /import\s+(?:(\w+)|\{([^}]+)\})\s+from/g;
    let match;
    while ((match = importRegex.exec(scriptContent)) !== null) {
        if (match[1]) {
            imports.add(match[1]);
        } else if (match[2]) {
            match[2].split(',').forEach(i => imports.add(i.trim()));
        }
    }

    // Extract template content
    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
    if (!templateMatch) return;
    const templateContent = templateMatch[1];

    // Find used components
    const usedComponents = new Set();
    const tagRegex = /<([a-zA-Z0-9-]+)/g;
    while ((match = tagRegex.exec(templateContent)) !== null) {
        const tagName = match[1];
        if (!htmlTags.has(tagName.toLowerCase())) {
            // Convert kebab-case to PascalCase for comparison
            const pascalName = tagName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
            usedComponents.add(pascalName);
        }
    }

    // Check for missing imports
    const missing = [];
    usedComponents.forEach(comp => {
        // Check if imported directly or if it matches the file name (recursive)
        // Also check if it's just the tag name (some people use <MyComponent> and import MyComponent)
        // We normalized to PascalCase, so we check that.
        if (!imports.has(comp)) {
            // Double check for kebab-case usage in imports (unlikely but possible)
            // Also check if it is a standard HTML tag that we missed?
            // Actually, let's just report it.
            missing.push(comp);
        }
    });

    if (missing.length > 0) {
        console.log(`File: ${path.relative(rootDir, file)}`);
        console.log(`  Missing imports: ${missing.join(', ')}`);
        hasErrors = true;
    }
});

if (!hasErrors) {
    console.log('No missing imports found.');
}

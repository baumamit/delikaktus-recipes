const fs = require('fs');
const path = require('path');
// Import plugin slug and block slugs from block-config.js
const { pluginSlug, blockSlugs } = require('./block-config.js');

blockSlugs.forEach((blockSlug) => {
    const blockJson = {
        "$schema": "https://schemas.wp.org/trunk/block.json",
        "apiVersion": 3,
        "name": `${pluginSlug}/${blockSlug}`,
        "version": "0.1.0",
        "title": "Recipe Ingredients List",
        "category": "widgets",
        "description": "Dynamic ingredients list for recipe posts, created by the DELIKAKTUS.com team.",
        "textdomain": pluginSlug,
        "attributes": {
            "unitSystem": { "type": "string", "default": "metric" },
            "ingredients": {
                "type": "array",
                "default": [],
                "items": {
                    "type": "object",
                    "properties": {
                        "unitType": { "type": "string", "default": "mass" },
                        "quantity": { "type": "number", "default": 1 },
                        "quantityFraction": { "type": "number", "default": 0 },
                        "unitChoice": { "type": "string", "default": "g" },
                        "name": { "type": "string", "default": "" }
                    }
                }
            },
            "portionsMode": { "type": "boolean", "default": true },
            "portionsAmount": { "type": "number", "default": 1 }
        },
        "supports": {
            "html": false
        },
        "example": {},
        "editorScript": `file:./assets/js/${pluginSlug}-${blockSlug}-edit.js`,
        "editorStyle": `file:./assets/css/${pluginSlug}-${blockSlug}-edit.css`,
        "style": `file:./${pluginSlug}-${blockSlug}-index.css`,
        "render": `file:./php/${pluginSlug}-${blockSlug}-render.php`,
        "viewScript": `file:./assets/js/${pluginSlug}-${blockSlug}-view.js`,
        "viewStyle": `file:./assets/css/${pluginSlug}-${blockSlug}-view.css`
    };

    // Ensure the target directory exists
    const targetDir = path.resolve(__dirname, `build/blocks/${blockSlug}`);
    fs.mkdirSync(targetDir, { recursive: true });

    // Write the JSON file to the build directory
    fs.writeFileSync(
        path.join(targetDir, 'block.json'),
        JSON.stringify(blockJson, null, 4)
    );

    console.log(`block.json generated for block: ${blockSlug}`);
});
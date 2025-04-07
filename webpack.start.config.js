const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { pluginSlug, blockSlugs } = require('./block-config.js'); // Import shared constants

// Generate entry points dynamically for all blocks
const entry = blockSlugs.reduce((entries, blockSlug) => {
    entries[`${pluginSlug}-${blockSlug}-index`] = `./src/blocks/${blockSlug}/index.js`; // Entry points for TypeScript files
    entries[`${pluginSlug}-${blockSlug}-edit`] = `./src/blocks/${blockSlug}/assets/js/edit.js`;
    entries[`${pluginSlug}-${blockSlug}-view`] = `./src/blocks/${blockSlug}/assets/js/view.js`;
    return entries;
}, {});

// Generate CopyWebpackPlugin patterns dynamically for all blocks
const copyPatterns = blockSlugs.flatMap((blockSlug) => [
    { from: path.resolve(__dirname, `src/blocks/${blockSlug}/php/render.php`), to: `blocks/${blockSlug}/php/${pluginSlug}-${blockSlug}-render.php` }
]);

module.exports = {
    mode: 'development',
    entry,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: (pathData) => {
            // Extract the block slug from the entry name
            const blockSlug = pathData.chunk.name
                .replace(`${pluginSlug}-`, '') // Remove the pluginSlug prefix
                .replace(/-(index|edit|view)$/, ''); // Remove the type suffix

            // Place index.js in the block root, and others in assets/js/
            if (pathData.chunk.name.endsWith('-index')) {
                return `blocks/${blockSlug}/[name].js`;
            }
            return `blocks/${blockSlug}/assets/js/[name].js`;
        },
    },
    devtool: 'source-map', // Enable source maps for easier debugging
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/, // Support for JS, JSX, TS, and TSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env', // Transpile modern JavaScript
                            '@babel/preset-react', // Transpile JSX syntax
                            '@babel/preset-typescript' // Transpile TypeScript (if applicable)
                        ]
                    }
                }
            },
            {
                test: /\.scss$/, // Support for SCSS files
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolve both JS and TS extensions
    },
    plugins: [
        // Extract CSS into a separate file inside blocks/{blockSlug}/assets/css
        new MiniCssExtractPlugin({
            filename: (pathData) => {
                // Extract the block slug from the entry name
                const blockSlug = pathData.chunk.name
                    .replace(`${pluginSlug}-`, '') // Remove the pluginSlug prefix
                    .replace(/-(index|edit|view)$/, ''); // Remove the type suffix

                // Place index.css in the block root, and others in assets/css/
                if (pathData.chunk.name.endsWith('-index')) {
                    return `blocks/${blockSlug}/[name].css`;
                }
                return `blocks/${blockSlug}/assets/css/[name].css`;
            },
        }),
        // Copy render.php and block.json to the build directory
        new CopyWebpackPlugin({
            patterns: [
                ...copyPatterns,
                //{ from: path.resolve(__dirname, 'languages'), to: 'languages' } // Copy the languages folder
            ]
        }),
    ],
};
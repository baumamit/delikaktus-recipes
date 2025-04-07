const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { pluginSlug, blockSlugs } = require('./block-config.js'); // Import shared constants
const TerserPlugin = require('terser-webpack-plugin');

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
    mode: 'production',
    entry,
    output: {
        path: path.resolve(__dirname, 'build'), // Output directory
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
    optimization: {
        minimize: true, // Minimize always in production mode (build)
        minimizer: [
            new TerserPlugin({
                extractComments: false, // Disable LICENSE.txt generation
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Support for TypeScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'] // Support for React and TypeScript
                    }
                }
            },
            {
                test: /\.js$/, // Support for JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
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
        // Clean the build directory before each build, but exclude block.json files during development
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                '**/*', // Clean everything
                '!blocks/**/block.json', // Exclude block.json files
            ],
        }),
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
    ]
};
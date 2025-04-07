// Export plugin slug and block slugs for the build process to use in generate-block-json.js and webpack.config.js
const pluginSlug = 'delikaktus-recipes';
const blockSlugs = ['ingredients-list']; // Add more block slugs here as needed
module.exports = { pluginSlug, blockSlugs };

/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { LuCookingPot } from 'react-icons/lu'; // Import the icon

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './index.scss';  // Block-specific SCSS/CSS

/**
 * Internal dependencies
 */
import Edit from './assets/js/edit.js';  // Editor JS for the block
import './assets/js/view.js';     // Frontend JS for the block
import metadata from './block.json'; // Block metadata

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
console.log("import metadata from './block.json'; // Block metadata",metadata.name) ;

registerBlockType(metadata.name, {
    /**
     * @see ./assets/js/edit.js
     */
    icon: LuCookingPot,
    edit: Edit,
});
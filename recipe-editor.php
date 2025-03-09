<?php
/**
 * Plugin Name:       Recipe Editor
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       recipe-editor
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_recipe_editor_block_init() {
	register_block_type( __DIR__ . '/build/recipe-editor' );
}
add_action( 'init', 'create_block_recipe_editor_block_init' );

/**
 * Enqueues the necessary scripts and localizes the current language for use in JavaScript.
 */
function recipe_editor_enqueue_scripts() {
	// Enqueue your plugin's JS file (adjust the path to where your JS is located)
	wp_enqueue_script( 'recipe-editor-js', plugin_dir_url( __FILE__ ) . 'js/edit.js', array(), '1.0', true );

	// Get the current language using Polylang (or whatever language plugin you're using)
	$current_language = pll_current_language(); // This returns the current language code like 'en', 'fr', etc.

	// Localize the script by passing the current language to JavaScript
	wp_localize_script( 'recipe-editor-js', 'recipeEditorData', array(
		'currentLanguage' => $current_language, // Make it available in the JS file
	));
}
add_action( 'wp_enqueue_scripts', 'recipe_editor_enqueue_scripts' );

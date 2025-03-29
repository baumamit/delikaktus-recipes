<?php
/**
 * Plugin Name:       DELIKAKTUS Recipes
 * Description:       Tools for creating a great recipes blog, including interactive and dynamic blocks. Created and designed by actual chefs of the DELIKAKTUS.com team.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Amit Baum
 * Author URI:          https://delikaktus.com
 * License:             GPL-2.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         delikaktus-recipes
 *
 * @package CreateBlock
 */

 if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly and not from the WordPress absolute path.
}

if ( ! class_exists( 'Delikaktus_Recipes' ) ) {
    class Delikaktus_Recipes {
        // You can add class properties and methods here if needed
    }

    new Delikaktus_Recipes;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_delikaktus_recipes_block_init() {
    register_block_type( __DIR__ . '/build/ingredients-list' );
}
add_action( 'init', 'create_block_delikaktus_recipes_block_init' );

/**
 * Enqueues the necessary scripts and localizes the current language for use in JavaScript.
 */
function delikaktus_recipes_enqueue_scripts() {
    // Enqueue your plugin's JS file (adjust the path to where your JS is located)
    wp_enqueue_script( 'delikaktus-recipes-js', plugin_dir_url( __FILE__ ) . 'js/edit.js', array(), '1.0', true );

    // Get the current language using Polylang (or whatever language plugin you're using)
    $current_language = pll_current_language(); // This returns the current language code like 'en', 'fr', etc.

    // Localize the script by passing the current language to JavaScript
    wp_localize_script( 'delikaktus-recipes-js', 'recipeEditorData', array(
        'currentLanguage' => $current_language, // Make it available in the JS file
    ));
}
add_action( 'wp_enqueue_scripts', 'delikaktus_recipes_enqueue_scripts' );

/**
 * Loads the plugin text domain for translation.
 */
function delikaktus_recipes_load_textdomain() {
    load_plugin_textdomain( 'delikaktus-recipes', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'delikaktus_recipes_load_textdomain' );
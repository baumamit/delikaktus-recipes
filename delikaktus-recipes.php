<?php
/**
 * Plugin Name:       DELIKAKTUS Recipes
 * Description:       Tools for creating a great recipes blog, including interactive and dynamic blocks. Created and designed by actual chefs of the DELIKAKTUS.com team.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Amit Baum
 * Author URI:        https://delikaktus.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       delikaktus-recipes
 * Domain Path:       /languages
 * 
 * @link              https://delikaktus.com
 * @package           CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly and not from the WordPress absolute path.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_delikaktus_recipes_block_init() {
    register_block_type( __DIR__ . '/build/blocks/ingredients-list' );
}
add_action( 'init', 'create_block_delikaktus_recipes_block_init' );

/**
 * Define the fractions list with symbols and corresponding values.
 * This can be accessed from both the backend and frontend.
 */
function delikaktus_get_fraction_list() {
    return array(
        '1/8'   => 0.125,
        '1/4'   => 0.25,
        '3/8'   => 0.375,
        '1/2'   => 0.5,
        '5/8'   => 0.625,
        '3/4'   => 0.75,
        '7/8'   => 0.875,
        '1'     => 1,
    );
}

/**
 * Enqueues backend (editor) assets and passes localized data for use in JavaScript.
 */
function delikaktus_recipes_enqueue_editor_assets() {
    // Register and enqueue the block editor JavaScript
    $edit_js = plugin_dir_path( __FILE__ ) . 'build/blocks/ingredients-list/assets/js/edit.js';
    if ( file_exists( $edit_js ) ) {
        wp_register_script( 
            'delikaktus-recipes-editor-js', 
            plugin_dir_url( __FILE__ ) . 'build/blocks/ingredients-list/assets/js/edit.js',
            array('wp-blocks', 'wp-i18n', 'wp-editor'), 
            filemtime( $edit_js ), // Version based on file modification time
            true 
        );
        wp_enqueue_script( 'delikaktus-recipes-editor-js' );
    }

    // Enqueue the block editor CSS
    $edit_css = plugin_dir_path( __FILE__ ) . 'build/blocks/ingredients-list/assets/css/edit.css';
    if ( file_exists( $edit_css ) ) {
        wp_enqueue_style(
            'delikaktus-recipes-editor-css',
            plugin_dir_url( __FILE__ ) . 'build/blocks/ingredients-list/assets/css/edit.css',
            array(),
            filemtime( $edit_css ) // Version based on file modification time
        );
    }

    // Get the current language using Polylang (or fallback to WordPress default)
    $current_language = function_exists('pll_current_language') ? pll_current_language() : get_locale();

    // Localize script with the current language and fractions list
    wp_localize_script( 'delikaktus-recipes-editor-js', 'recipeEditorData', array(
        'currentLanguage' => $current_language,
        'unitSystem' => isset($attributes['unitSystem']) ? $attributes['unitSystem'] : 'metric', // Add your desired attribute here
        'fractions' => delikaktus_get_fraction_list(), // Pass the fractions list
    ) );
}
add_action( 'enqueue_block_editor_assets', 'delikaktus_recipes_enqueue_editor_assets' );

/**
 * Enqueues frontend (website visitor) assets and passes localized data.
 */
function delikaktus_recipes_enqueue_frontend_assets() {
    // Register and enqueue the frontend JavaScript
    $view_js = plugin_dir_path( __FILE__ ) . 'build/blocks/ingredients-list/assets/js/view.js';
    if ( file_exists( $view_js ) ) {
        wp_register_script( 
            'delikaktus-recipes-view-js', 
            plugin_dir_url( __FILE__ ) . 'build/blocks/ingredients-list/assets/js/view.js',
            array(), 
            filemtime( $view_js ), 
            true 
        );
        wp_enqueue_script( 'delikaktus-recipes-view-js' );
    }
    // Localize the data for frontend use (including fractions list)
    wp_localize_script( 'delikaktus-recipes-view-js', 'recipeFrontendData', array(
        'currentLanguage' => function_exists('pll_current_language') ? pll_current_language() : get_locale(),
        'fractions' => delikaktus_get_fraction_list(), // Pass the fractions list
    ) );

    // Enqueue the frontend CSS
    $view_css = plugin_dir_path( __FILE__ ) . 'build/blocks/ingredients-list/assets/css/view.css';
    if ( file_exists( $view_css ) ) {
        wp_enqueue_style(
            'delikaktus-recipes-frontend-css',
            plugin_dir_url( __FILE__ ) . 'build/blocks/ingredients-list/assets/css/view.css',
            array(),
            filemtime( $view_css ) // Version based on file modification time
        );
    }
}
add_action( 'wp_enqueue_scripts', 'delikaktus_recipes_enqueue_frontend_assets' );

/**
 * Loads the plugin text domain for translation.
 */
function delikaktus_recipes_load_textdomain() {
    load_plugin_textdomain( 'delikaktus-recipes', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
//add_action( 'plugins_loaded', 'delikaktus_recipes_load_textdomain' );
add_action( 'init', 'delikaktus_recipes_load_textdomain' );
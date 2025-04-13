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
 * Registers the settings page for the plugin.
 * Adds the DELIKAKTUS Recipes Settings page to the WordPress admin menu.
 * @since 0.1.0
 */
function adminSettingsPage() {
    add_options_page(
        'DELIKAKTUS Recipes Settings',
        'DELIKAKTUS Recipes',
        'manage_options',
        'delikaktus-recipes-settings',
        'delikaktus_recipes_settings_create_page'
    );
}
add_action('admin_menu', 'adminSettingsPage');

function delikaktus_recipes_settings_create_page() {
    echo '<h1>DELIKAKTUS Recipes Settings</h1>';
    echo '<p>This is the settings page for DELIKAKTUS Recipes.</p>';
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
 * Define the fractions list with symbols and corresponding values.
 * This can be accessed from both the backend and frontend.
 */
function delikaktus_get_fraction_list() {
    return array(
        '1/8'   => 0.125,
        '1/4'   => 0.25,
        '1/3'   => 0.3333,
        '3/8'   => 0.375,
        '1/2'   => 0.5,
        '5/8'   => 0.625,
        '2/3'   => 0.6667,
        '3/4'   => 0.75,
        '7/8'   => 0.875,
        '1'     => 1,
    );
}

/**
 * Enqueues the necessary scripts and localizes the current language for use in JavaScript.
 */
function delikaktus_recipes_enqueue_editor_scripts() {
    $script_path = plugin_dir_path( __FILE__ ) . 'js/edit.js';

    if ( file_exists( $script_path ) ) {
        wp_enqueue_script( 
            'delikaktus-recipes-editor-js', 
            plugin_dir_url( __FILE__ ) . 'js/edit.js', 
            array('wp-blocks', 'wp-i18n', 'wp-editor'), 
            '1.0', 
            true 
        );

        // Get the current language using Polylang (or fallback to WordPress default)
        $current_language = function_exists('pll_current_language') ? pll_current_language() : get_locale();

        // Localize script with the current language
        wp_localize_script( 'delikaktus-recipes-editor-js', 'recipeEditorData', array(
            'currentLanguage' => $current_language,
            'unitSystem' => isset($attributes['unitSystem']) ? $attributes['unitSystem'] : 'metric', // Add your desired attribute here
        ));
    }
}
add_action( 'enqueue_block_editor_assets', 'delikaktus_recipes_enqueue_editor_scripts' );

/**
 * Enqueues frontend scripts and passes localized data.
 */

/**
 * Loads the plugin text domain for translation.
 */
function delikaktus_recipes_load_textdomain() {
    load_plugin_textdomain( 'delikaktus-recipes', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'delikaktus_recipes_load_textdomain' );

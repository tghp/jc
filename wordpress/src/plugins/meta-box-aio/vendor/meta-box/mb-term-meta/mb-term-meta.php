<?php
/**
 * Plugin Name: MB Term Meta
 * Plugin URI:  https://metabox.io/plugins/mb-term-meta/
 * Description: Add custom fields (meta data) for terms.
 * Version:     1.3.0
 * Author:      MetaBox.io
 * Author URI:  https://metabox.io
 * License:     GPL2+
 * Text Domain: mb-term-meta
 * Domain Path: /languages/
 *
 * @package    Meta Box
 * @subpackage MB Term Meta
 */

// Prevent loading this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	return;
}

if ( ! function_exists( 'mb_term_meta_load' ) ) {
	if ( file_exists( __DIR__ . '/vendor' ) ) {
		require __DIR__ . '/vendor/autoload.php';
	}

	/**
	 * Hook to 'init' with priority 5 to make sure all actions are registered before Meta Box 4.9.0 runs
	 */
	add_action( 'init', 'mb_term_meta_load', 5 );

	/**
	 * Load plugin files after Meta Box is loaded
	 */
	function mb_term_meta_load() {
		if ( ! defined( 'RWMB_VER' ) ) {
			return;
		}

		list( , $url ) = \RWMB_Loader::get_path( __DIR__ );
		define( 'MBTM_DIR', __DIR__ . '/' );
		define( 'MBTM_URL', $url );

		// Register before Meta Box's BlockBindings\Loader::register on init (priority 10).
		if ( class_exists( \MetaBox\Integrations\BlockBindings\Source::class ) ) {
			rwmb_get_registry( 'block_bindings' )->add( new MBTM\Integrations\BlockBindings\Term() );
		}

		new MBTM\Loader;

		load_plugin_textdomain( 'mb-term-meta', false, plugin_basename( __DIR__ ) . '/languages/' );
	}
}

<?php
/**
 * Plugin Name: TGHP Jc
 * Description: Main plugin for Jc theme setup
 * Version:     1.0.0
 * Author:      TGHP
 */

// Define constants
define('TGHP_JC_PLUGIN_VERSION', '1.0.0');
define('TGHP_JC_PLUGIN_NAME', 'jc-site');
define('TGHP_JC_PLUGIN_METABOX_PREFIX', '_tghpjc_');
define('TGHP_JC_PLUGIN_PATH', dirname(__FILE__));
define('TGHP_JC_PLUGIN_URL', untrailingslashit(plugins_url('/', __FILE__)));

// Prevent loading this file directly
if (!defined('ABSPATH')) {
    die();
}

// Abort plugin loading if WordPress is upgrading
if (defined('WP_INSTALLING') && WP_INSTALLING) {
    return;
}


// Init plugin
require TGHP_JC_PLUGIN_PATH . '/inc/Jc.php';

/**
 * Return Jc instance
 *
 * @return \TGHP\Jc\Jc
 */
function TGHPJc()
{
    return \TGHP\Jc\Jc::instance();
}

TGHPJc();

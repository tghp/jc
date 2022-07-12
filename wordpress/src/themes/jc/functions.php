<?php
// Define constants
define('TGHP_JC_THEME_NAME', 'jc-theme');
define('TGHP_JC_THEME_ABSPATH', dirname(__FILE__) . '/');

// Include the main Jc class.
require_once TGHP_JC_THEME_ABSPATH . 'inc/Jc.php';

/**
 * Return JcTheme instance
 *
 * @return \TGHP\JcTheme\Jc
 */
function TGHPJcTheme()
{
    return \TGHP\JcTheme\Jc::instance();
}

TGHPJcTheme();

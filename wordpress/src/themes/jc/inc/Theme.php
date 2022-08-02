<?php

namespace TGHP\JcTheme;

class Theme extends AbstractJc
{
    /**
     * Theme constructor.
     *
     * @param $jc
     */
    public function __construct($jc)
    {
        parent::__construct($jc);
        add_action('after_setup_theme', [$this, 'setup']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueStyles']);
        add_filter('script_loader_tag', [$this, 'deferJsScripts'], 10, 1);
        add_action('init', [$this, 'addImageSizes']);
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
        remove_action('admin_print_scripts', 'print_emoji_detection_script');
        remove_action('admin_print_styles', 'print_emoji_styles');
    }

    /**
     * Sets up theme defaults and registers support for various WordPress features.
     *
     * Note that this function is hooked into the after_setup_theme hook, which
     * runs before the init hook. The init hook is too late for some features, such
     * as indicating support for post thumbnails.
     */
    public function setup()
    {
        /**
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support('title-tag');

        /**
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support('post-thumbnails');

        /**
         * This theme uses wp_nav_menu() in one location.
         */
        register_nav_menus([
            'header-nav' => esc_html__('Main navigation', \TGHP\JcTheme\Jc::getTextDomain()),
            'footer-nav' => esc_html__('Footer navigation', \TGHP\JcTheme\Jc::getTextDomain()),
        ]);
    }

    public function enqueueStyles()
    {
        wp_enqueue_style(
            'main',
            get_stylesheet_directory_uri() . '/assets/dist/css/main.css',
            [],
            filemtime(get_stylesheet_directory() . '/assets/dist/css/main.css')
        );
    }

    /**
     * Parse scripts enqueue and defer those with flags
     *
     * @param $url
     */
    public function deferJsScripts($script)
    {
        if (is_admin()) {
            return $script;
        }

        if (strpos($script, '.js') === false) {
            return $script;
        }

        if (strpos($script, '#defer') !== false) {
            return str_replace(' src', ' defer src', $script);
        }

        if (strpos($script, '#async') !== false) {
            return str_replace(' src', ' async src', $script);
        }

        return $script;
    }

    /**
     * Add WordPress image sizes
     */
    public function addImageSizes()
    {
        add_image_size('xxs', 400, 9999, true);
        add_image_size('xs', 460, 9999, true);
        add_image_size('s', 660, 9999, true);
        add_image_size('m', 720, 9999, true);
        add_image_size('l', 980, 9999, true);
        add_image_size('xl', 1024, 9999, true);
        add_image_size('xxl', 1400, 9999, true);
        add_image_size('xxxl', 1700, 9999, true);
        add_image_size('xxxxl', 2000, 9999, true);
        add_image_size('xxs-uncropped', 402, 9999, false);
        add_image_size('xs-uncropped', 462, 9999, false);
        add_image_size('s-uncropped', 662, 9999, false);
        add_image_size('m-uncropped', 722, 9999, false);
        add_image_size('l-uncropped', 982, 9999, false);
        add_image_size('xl-uncropped', 1032, 9999, false);
        add_image_size('xxl-uncropped', 1402, 9999, false);
        add_image_size('xxxl-uncropped', 1702, 9999, false);
        add_image_size('xxxxl-uncropped', 2002, 9999, false);
        add_image_size('xs-square', 300, 300, true);
    }
}

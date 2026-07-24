<?php

namespace TGHP\Jc;

use PHPHtmlParser\Dom;
use PHPHtmlParser\Options;
use TGHP\Jc\Blocks\BlockDefinerInterface;

class Blocks extends AbstractDefinesMetabox
{

    /**
     * Blocks constructor.
     *
     * @param Jc $jc
     */
    public function __construct(Jc $jc)
    {
        parent::__construct($jc);
        add_filter('block_categories_all', [$this, 'addGutenbergBlockCategories'], 10, 2);
        add_action('enqueue_block_editor_assets', [$this, 'addGutenbergAssets']);
        add_filter('block_editor_settings_all', [$this, 'restoreDefaultEditorStyles']);
    }

    protected function _getDefiners()
    {
        return [];
    }

    /**
     * Add additional gutenberg block categories
     *
     * @param $categories
     * @param $post
     * @return array
     */
    public function addGutenbergBlockCategories($categories, $post): array
    {
        return array_merge(
            [
                [
                    'slug' => 'jc-blocks',
                    'title' => __('Jc Blocks', Jc::getTextDomain()),
                ],
            ],
            $categories
        );
    }

    /**
     * Add scripts to modify gutenberg behaviour
     *
     * @return void
     */
    public function addGutenbergAssets()
    {
        wp_enqueue_script(
            'augmentum-theme-editor',
            Jc::getPluginUrl() . '/assets/src/js/editor.js',
            ['wp-blocks', 'wp-dom'],
            filemtime( Jc::getPluginPath() . '/assets/src/js/editor.js' ),
            true
        );
    }

    /**
     * Restore WordPress's default editor styles for this classic (no theme.json) theme.
     *
     * WordPress 7.0 changed get_block_editor_settings() to always tag the generated
     * global stylesheet as __unstableType 'theme', even for themes without a theme.json
     * (6.9.4 tagged it 'base-layout' in that case). The block editor treats the presence
     * of a 'theme'-typed style as "the theme provides editor styles" and therefore
     * suppresses its own defaultEditorStyles (the system font stack). In the now-iframed
     * canvas that leaves content in the browser default serif. Re-tagging the entry the
     * way 6.9.4 did lets WordPress apply its default editor styles again.
     *
     * @param array $settings
     * @return array
     */
    public function restoreDefaultEditorStyles($settings): array
    {
        if (wp_theme_has_theme_json() || empty($settings['styles'])) {
            return $settings;
        }

        foreach ($settings['styles'] as &$style) {
            if (isset($style['__unstableType']) && $style['__unstableType'] === 'theme') {
                $style['__unstableType'] = 'base-layout';
            }
        }

        return $settings;
    }

}

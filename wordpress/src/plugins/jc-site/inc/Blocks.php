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

}

<?php

namespace TGHP\Jc;

use PHPHtmlParser\Dom;
use PHPHtmlParser\Options;
use TGHP\Jc\Blocks\BlockDefinerInterface;
use TGHP\Jc\Blocks\CaseStudySingle;

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

}

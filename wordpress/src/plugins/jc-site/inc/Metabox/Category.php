<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Category extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'title' => 'General',
                'post_types' => 'post',
                'taxonomies' => 'category',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('category_description'),
                        'name' => 'Category page content',
                        'type' => 'wysiwyg',
                    ],
                ]
            ],
        ];
    }

}
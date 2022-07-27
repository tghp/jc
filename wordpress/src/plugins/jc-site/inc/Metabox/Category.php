<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Category extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'id' => Metabox::generateKey('category_general_meta'),
                'title' => 'Category Page',
                'post_types' => 'post',
                'taxonomies' => 'category',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('category_content'),
                        'name' => 'Content',
                        'type' => 'wysiwyg',
                    ],
                ]
            ],
        ];
    }

}
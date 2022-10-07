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
                        'options' => $this->getCategoriesWysiwygOptionsConfig(),
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('category_home_meta'),
                'title' => 'Home Page',
                'post_types' => 'post',
                'taxonomies' => 'category',
                'fields' => [
                    [
                        'type' => 'heading',
                        'desc' => 'Selected posts will display beneath this category on the home page',
                    ],
                    [
                        'id' => Metabox::generateKey('category_home_posts'),
                        'name' => 'Select posts',
                        'type' => 'post',
                        'post_type' => 'post',
                        'clone' => true,
                        'sort_clone' => true,
                        'admin_columns' => 'after name',
                    ],
                ]
            ],
        ];
    }

}
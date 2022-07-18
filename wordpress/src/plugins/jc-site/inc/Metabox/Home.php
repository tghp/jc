<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Home extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'title' => 'Intro Text',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'ID' => 2,
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('intro_column_1'),
                        'name' => 'Column 1',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 5,
                        'graphql_name' => Metabox::generateKey('intro_column_1'),
                        'graphql_mutate' => true
                    ],
                    [
                        'id' => Metabox::generateKey('intro_column_2'),
                        'name' => 'Column 2',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 5,
                        'graphql_name' => Metabox::generateKey('intro_column_2'),
                        'graphql_mutate' => true
                    ],
                    [
                        'id' => Metabox::generateKey('intro_photo'),
                        'name' => 'Photo',
                        'type' => 'single_image',
                        'columns' => 2,
                        'graphql_name' => Metabox::generateKey('intro_photo'),
                        'graphql_mutate' => true
                    ],
                ]
            ],
            [
                'title' => 'Essay Categories',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'ID' => 2,
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('home_essay_categories'),
                        'type'       => 'taxonomy_advanced',
                        'field_type' => 'select_advanced',
                        'clone' => true,
                        'sort_clone' => true,
                        'add_button' => '+ Add Category',
                        'graphql_name' => Metabox::generateKey('home_essay_categories'),
                        'graphql_mutate' => true
                    ],
                ]
            ],
            [
                'title' => 'About Text',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'ID' => 2,
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('about_text_title'),
                        'name' => 'Title',
                        'type' => 'text',
                        'graphql_name' => Metabox::generateKey('about_text_title'),
                        'graphql_mutate' => true
                    ],
                    [
                        'id' => Metabox::generateKey('about_text_column_1'),
                        'name' => 'Column 1',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 6,
                        'graphql_name' => Metabox::generateKey('about_text_column_1'),
                        'graphql_mutate' => true
                    ],
                    [
                        'id' => Metabox::generateKey('about_text_column_2'),
                        'name' => 'Column 2',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 6,
                        'graphql_name' => Metabox::generateKey('about_text_column_2'),
                        'graphql_mutate' => true
                    ],
                ]
            ],
        ];
    }

}
<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Home extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'id' => Metabox::generateKey('home_intro_text'),
                'title' => 'Intro Text',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'template' => ['templates/template-home.php'],
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('intro_column_1'),
                        'name' => 'Column 1',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 5,
                    ],
                    [
                        'id' => Metabox::generateKey('intro_column_2'),
                        'name' => 'Column 2',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 5,
                        'desc' => 'The subscribe_modal_button shortcode <strong>requires</strong> text & button_text attributes'
                    ],
                    [
                        'id' => Metabox::generateKey('intro_photo'),
                        'name' => 'Photo',
                        'type' => 'single_image',
                        'columns' => 2,
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('home_featured_essays'),
                'title' => 'Featured posts',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'template' => ['templates/template-home.php'],
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('home_featured_essays'),
                        'type' => 'post',
                        'clone' => true,
                        'sort_clone' => true,
                        'add_button' => '+ Add Post',
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('home_essay_categories'),
                'title' => 'Essay Categories',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'template' => ['templates/template-home.php'],
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('home_essay_categories'),
                        'type'       => 'taxonomy_advanced',
                        'field_type' => 'select_advanced',
                        'clone' => true,
                        'sort_clone' => true,
                        'add_button' => '+ Add Category',
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('home_about_text'),
                'title' => 'About Text',
                'post_types' => 'page',
                'revision' => true,
                'include' => [
                    'template' => ['templates/template-home.php'],
                ],
                'fields' => [
                    [
                        'id' => Metabox::generateKey('about_text_title'),
                        'name' => 'Title',
                        'type' => 'text',
                    ],
                    [
                        'id' => Metabox::generateKey('about_text_column_1'),
                        'name' => 'Column 1',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 6,
                    ],
                    [
                        'id' => Metabox::generateKey('about_text_column_2'),
                        'name' => 'Column 2',
                        'type' => 'wysiwyg',
                        'options' => $this->getWysiwygOptionsConfig(),
                        'columns' => 6,
                    ],
                ]
            ],
        ];
    }

}
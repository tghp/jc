<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Page extends AbstractMetabox implements MetaboxDefinerInterface
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
                        'columns' => 6,
                    ],
                    [
                        'id' => Metabox::generateKey('intro_column_2'),
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
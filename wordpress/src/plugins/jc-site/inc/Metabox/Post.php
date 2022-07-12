<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Post extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'title' => 'Media',
                'post_types' => 'post',
                'context' => 'side',
                'priority' => 'high',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('audio_url'),
                        'name' => 'Audio URL',
                        'type' => 'url',
                    ],
                    [
                        'id' => Metabox::generateKey('video_url'),
                        'name' => 'Video URL',
                        'type' => 'url',
                    ],
                ]
            ],
        ];
    }

}
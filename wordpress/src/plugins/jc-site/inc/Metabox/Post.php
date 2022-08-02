<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Post extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'id' => Metabox::generateKey('posts_general_meta'),
                'title' => 'Featured post',
                'post_types' => 'post',
                'context' => 'side',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('featured_essay'),
                        'type' => 'checkbox',
                        'desc' => 'Display in the Featured section on the home page. Up to 6 featured posts will be shown, ordered by publish date.'
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('posts_media'),
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
            [
                'id' => Metabox::generateKey('posts_references'),
                'title' => 'References',
                'post_types' => 'post',
                'priority' => 'high',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('references'),
                        'name' => 'References',
                        'type' => 'group',
                        'clone' => true,
                        'sort_clone' => true,
                        'fields' => [
                            [
                                'id' => 'text',
                                'name' => 'Text',
                                'type' => 'textarea',
                                'attributes' => [
                                    'rows' => 2,
                                ],
                            ],
                            [
                                'id' => 'url',
                                'name' => 'URL',
                                'type' => 'url',
                            ],
                        ],
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('post_comments'),
                'title' => 'Post Comments',
                'post_types' => 'post',
                'context' => 'side',
                'fields' => [
                    [
                        'type' => 'heading',
                        'name' => 'Forums',
                        'desc' => 'Add the URLs to your forums here',
                    ],
                    [
                        'id' => Metabox::generateKey('substack_url'),
                        'name' => 'Substack URL',
                        'type' => 'url',
                    ],
                    [
                        'id' => Metabox::generateKey('lesswrong_url'),
                        'name' => 'LessWrong URL',
                        'type' => 'url',
                    ],
                    [
                        'id' => Metabox::generateKey('eaforum_url'),
                        'name' => 'EA Forum URL',
                        'type' => 'url',
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('post_further_reading_override'),
                'title' => 'Further reading',
                'post_types' => 'post',
                'context' => 'side',
                'fields' => [
                    [
                        'type' => 'heading',
                        'name' => 'Override',
                        'desc' => 'Posts within the same category will be displayed by default. Select posts here to override the default.',
                    ],
                    [
                        'id' => Metabox::generateKey('further_reading_posts'),
                        'name' => 'Select posts',
                        'type' => 'post',
                        'post_type' => 'post',
                        'clone' => true,
                        'max_clone' => 3,
                    ],
                ]
            ],
        ];
    }

}
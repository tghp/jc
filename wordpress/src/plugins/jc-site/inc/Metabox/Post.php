<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Post extends AbstractMetabox implements MetaboxDefinerInterface
{

    public function define(): array
    {
        return [
            [
                'id' => Metabox::generateKey('post_external'),
                'title' => 'External Content',
                'post_types' => 'post',
                'context' => 'side',
                'fields' => [
                    [
                        'id' => Metabox::generateKey('external_url'),
                        'type' => 'url',
                        'name' => 'External URL',
                        'desc' => 'Anywhere the article is presented, it will link here rather than to the actual post. Excerpts, title, date, still come from this post.',
                    ],
                ]
            ],
            [
                'id' => Metabox::generateKey('post_series_parts'),
                'title' => 'Series Part',
                'post_types' => 'post',
                'context' => 'side',
                'priority' => 'high',
                'fields' => [
                    [
                        'type' => 'heading',
                        'desc' => 'If this post is part of a Series of essays, the Series Part number is required.',
                    ],
                    [
                        'id' => Metabox::generateKey('post_series_part_number'),
                        'name' => 'Part number',
                        'type' => 'select',
                        'placeholder' => 'Select part number',
                        'options' => [
                            '1' => '1',
                            '2' => '2',
                            '3' => '3',
                            '4' => '4',
                            '5' => '5',
                            '6' => '6',
                            '7' => '7',
                            '8' => '8',
                            '9' => '9',
                            '10' => '10',
                        ],
                        'admin_columns' => 'after taxonomy-series',
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
                        'id' => Metabox::generateKey('pdf_url'),
                        'name' => 'PDF URL',
                        'type' => 'url',
                    ],
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
                        'type' => 'heading',
                        'desc' => 'Insert a reference into the main text by adding [ref x] where you want the footnote to appear. X refers to the number of the footnote determined by the order below. You can drag footnotes to rearrange them. e.g the first reference below would be inserted into the copy as [ref 1].',
                    ],
                    [
                        'id' => Metabox::generateKey('references'),
                        'type' => 'group',
                        'clone' => true,
                        'sort_clone' => true,
                        'fields' => [
                            [
                                'id' => 'text',
                                'name' => 'Text',
                                'type' => 'wysiwyg',
                                'options' => $this->getReferencesWysiwygOptionsConfig(),
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
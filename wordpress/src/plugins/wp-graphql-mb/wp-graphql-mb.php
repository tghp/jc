<?php
/**
 * Plugin Name: WP GraphQL Meta Box Custom Fields (TGHP Version)
 * Description: Exposes all registered Meta Box Custom Fields to the WPGraphQL EndPoint.
 * Author: TGHP / Niklas Dahlqvist
 * Version: 0.9
 * License: GPL2+
 */

namespace WPGraphQL\Extensions;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('\WPGraphQL\Extensions\MB')) {
    class MB
    {
        /**
         * List of media fields to filter.
         *
         * @var array
         */
        protected $media_fields = [
            'media',
            'file',
            'file_upload',
            'file_advanced',
            'single_image',
            'image',
            'image_upload',
            'image_advanced',
            'plupload_image',
            'thickbox_image',
        ];

        public function __construct()
        {
            $this->add_meta_boxes_to_graphQL();
            $this->add_extra_types();
        }

        public function add_meta_boxes_to_graphQL()
        {
            $types = array_merge(
                $this->get_types(),
                $this->get_types('taxonomy')
            );

            foreach ($types as $type => $object) {
                if (isset($object->graphql_single_name)) {
                    add_action('graphql_register_types', function ($fields) use ($type) {
                        return $this->add_meta_fields($fields, $type);
                    });
                }
            }
        }

        public function add_extra_types()
        {
            register_graphql_object_type('Media', [
                'description' => 'Media object',
                'fields' => [
                    'id' => [
                        'type' => 'ID',
                        'description' => 'The ID of the media object.',
                    ],
                    'url' => [
                        'type' => 'String',
                        'description' => 'The URL of the media object.',
                    ],
                    'srcset' => [
                        'type' => 'String',
                        'description' => 'The srcset of the media object.',
                    ],
                    'title' => [
                        'type' => 'String',
                        'description' => 'The title of the media object.',
                    ],
                    'width' => [
                        'type' => 'String',
                        'description' => 'The width of the media object original image.',
                    ],
                    'height' => [
                        'type' => 'String',
                        'description' => 'The height of the media object original image.',
                    ],
                    'description' => [
                        'type' => 'String',
                        'description' => 'The description of the media object.',
                    ],
                    'caption' => [
                        'type' => 'String',
                        'description' => 'The caption of the media object.',
                    ],
                    'alt' => [
                        'type' => 'String',
                        'description' => 'The alt of the media object.',
                    ],
                    'name' => [
                        'type' => 'String',
                        'description' => 'The name of the media object.',
                    ],
                ],
            ]);
        }

        public function add_meta_fields($fields, $object_type)
        {
            $boxes = array_merge(
                $this->get_post_type_meta_boxes($object_type),
                $this->get_term_meta_boxes($object_type)
            );

            foreach ($boxes as $box) {
                foreach ($box->post_types as $type) {
                    $post_type_object = get_post_type_object($type);
                    foreach ($box->fields as $field) {
                        $field_name = self::_graphql_label($field['id']);

                        if (!in_array($field['type'], $this->media_fields)) {
                            if ($field['clone'] == false && $field['multiple'] == false) {
                                register_graphql_field(ucfirst($post_type_object->graphql_single_name), $field_name, [
                                    'type' => "string",
                                    'description' => $field['desc'],
                                    'resolve' => function ($object) use ($object_type, $field) {
                                        $meta = self::_get_meta_value($field, $object, $object_type);
                                        $meta = self::_convert_wp_internal($meta);

                                        return $meta;
                                    },
                                ]);
                            }

                            if (($field['clone'] == true || $field['multiple'] == true)) {
                                register_graphql_field(ucfirst($post_type_object->graphql_single_name), $field_name, [
                                    'type' => ['list_of' => 'String'],
                                    'description' => $field['desc'],
                                    'resolve' => function ($object) use ($object_type, $field) {
                                        $meta = self::_get_meta_value($field, $object, $object_type);

                                        foreach ($meta as &$metaValue) {
                                            $metaValue = self::_convert_wp_internal($metaValue);
                                        }

                                        return $meta;
                                    },

                                ]);
                            }
                        }

                        if (in_array($field['type'], $this->media_fields)) {
                            // TODO: How do we deal with something like image_advanced with multiple images, or file?

                            if ($field['multiple'] == false) {
                                register_graphql_field(ucfirst($post_type_object->graphql_single_name), $field_name, [
                                    'type' => 'Media',
                                    'description' => $field['desc'],
                                    'resolve' => function ($object) use ($object_type, $field) {
                                        $meta = self::_get_meta_value($field, $object, $object_type);
                                        $meta = self::_convert_wp_internal($meta);
                                        return $meta;
                                    },

                                ]);
                            }

                            if (($field['clone'] == true || $field['multiple'] == true)) {
                                // TODO: Support this use-case, does it even happen?
                            }
                        }
                    }
                }
            }

            return $fields;
        }

        /**
         * Get the meta value for a field
         *
         * @param $field
         * @param $object
         * @param $object_type
         * @return mixed|null
         */
        public static function _get_meta_value($field, $object, $object_type)
        {
            $meta = null;

            if ('post' === $object_type || in_array($object_type, get_post_types(), true)) {
                $meta = rwmb_meta($field['id'], null, $object->ID);
            }
            if ('term' === $object_type || in_array($object_type, get_taxonomies(), true)) {
                $meta = rwmb_meta($field['id'], ['object_type' => 'term'], $object->term_id);
            }
            if ('user' === $object_type) {
                $meta = rwmb_meta($field['id'], ['object_type' => 'user'], $object->ID);
            }

            return $meta;
        }

        /**
         * Get metaboxes .
         *
         * @param array $object Post object.
         *
         * @return array
         */
        public function get_post_type_meta_boxes($type)
        {
            $meta_boxes = \rwmb_get_registry('meta_box')->get_by(['object_type' => 'post']);
            foreach ($meta_boxes as $key => $meta_box) {
                if (!in_array($type, $meta_box->post_types, true)) {
                    unset($meta_boxes[$key]);
                }
            }
            return $meta_boxes;
        }

        /**
         * Get term meta boxes.
         *
         * @param array $object Term object.
         *
         * @return array
         */
        public function get_term_meta_boxes($type)
        {
            $output = [];
            if (!class_exists('MB_Term_Meta_Box')) {
                return $output;
            }

            $meta_boxes = \rwmb_get_registry('meta_box')->get_by([
                'object_type' => 'term',
            ]);

            return $meta_boxes;
        }

        /**
         * Get supported supported post types and / or taxonomies.
         *
         * @param string $type 'post' or 'taxonomy'.
         *
         * @return array
         */
        protected function get_types($type = 'post')
        {
            $types = get_post_types([], 'objects');
            if ('taxonomy' === $type) {
                $types = get_taxonomies([], 'objects');
            }

            return $types;
        }

        /**
         * Utility function for formatting a string to be compatible with GraphQL labels (camelCase with lowercase first letter)
         *
         * @param $input
         *
         * @return mixed|string
         */
        public static function _graphql_label($input)
        {
            $graphql_label = str_ireplace('_', ' ', $input);
            $graphql_label = ucwords($graphql_label);
            $graphql_label = str_ireplace(' ', '', $graphql_label);
            $graphql_label = lcfirst($graphql_label);

            return $graphql_label;
        }

        /**
         * @param $instance
         * @return string|array
         */
        public static function _convert_wp_internal($instance)
        {
            if (!is_object($instance) && !is_array($instance)) {
                return '';
            }

            if (is_object($instance)) {
                // The data is a class, so reflect on it and return the appropriate data
                switch (get_class($instance)) {
                    case 'WP_Term':
                        return $instance->term_id;
                    default:
                        return '';
                }
            } else if (is_array($instance)) {
                // The data is a class, so try and fingerprint it and return the appropriate data
                if (isset($instance['image_meta'])) {
                    // Is an array representing an image
                    return [
                        'id' => $instance['ID'],
                        'url' => $instance['full_url'],
                        'srcset' => $instance['srcset'],
                        'title' => $instance['title'],
                        'width' => $instance['width'],
                        'height' => $instance['height'],
                        'description' => $instance['description'],
                        'caption' => $instance['caption'],
                        'alt' => $instance['alt'],
                        'name' => $instance['name'],
                    ];
                } else {
                    return '';
                }
            }
        }
    }
}

add_action('init_graphql_request', function () {
    new MB;
});
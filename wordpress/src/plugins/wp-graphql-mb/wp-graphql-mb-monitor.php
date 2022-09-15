<?php

class WpGraphqlMbMonitor extends \WPGatsby\ActionMonitor\Monitors\Monitor
{

    public function init() {
        add_action('rwmb_after_save_field', [$this, 'metaboxFieldSaved'], 10, 5);
    }

    public function metaboxFieldSaved($null, $field, $new, $old, $object_id)
    {
        if ($new !== $old) {
            if (is_string($object_id) && isset($field['id'])) {
                $this->trigger_non_node_root_field_update([
                    'title' => __( 'Update Setting: ', 'WPGatsby' ) . ' ' . $field['id'],
                ]);
            } else {
                $screen = get_current_screen();

                if ($screen->taxonomy) {
                    $taxonomy = get_taxonomy($screen->taxonomy);

                    if (property_exists($taxonomy, 'graphql_single_name') && property_exists($taxonomy, 'graphql_plural_name')) {
                        $term = get_term($object_id, $screen->taxonomy);

                        $this->log_action([
                            'action_type' => 'UPDATE',
                            'title' => $term->name,
                            'graphql_single_name' => $taxonomy->graphql_single_name,
                            'graphql_plural_name' => $taxonomy->graphql_plural_name,
                            'status' => 'publish',
                            'relay_id' => base64_encode($taxonomy->graphql_single_name . ':' . $object_id),
                            'node_id' => $object_id,
                        ]);
                    }
                } else if ($screen->post_type) {
                    $post = get_post($object_id);
                    $postType = get_post_type_object($screen->post_type);

                    if (property_exists($postType, 'graphql_single_name') && property_exists($postType, 'graphql_plural_name')) {
                        $this->log_action([
                            'action_type' => 'UPDATE',
                            'title' => $post->post_title,
                            'graphql_single_name' => $postType->graphql_single_name,
                            'graphql_plural_name' => $postType->graphql_plural_name,
                            'status' => 'publish',
                            'relay_id' => base64_encode($postType->graphql_single_name . ':' . $object_id),
                            'node_id' => $object_id,
                        ]);
                    }
                }
            }
        }
    }

}
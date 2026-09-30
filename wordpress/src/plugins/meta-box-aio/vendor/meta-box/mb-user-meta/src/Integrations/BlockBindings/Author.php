<?php
namespace MBUM\Integrations\BlockBindings;

use MetaBox\Integrations\BlockBindings\Source;
use WP_Block;
use WP_User;

/**
 * Block bindings source for author fields: meta-box/author-field.
 *
 * Uses user meta fields. Resolves to the post author (post context)
 * or the author on author archives.
 */
class Author extends Source {
	protected function name(): string {
		return 'meta-box/author-field';
	}

	protected function label(): string {
		return __( 'Meta Box Author Field', 'mb-user-meta' );
	}

	protected function contexts(): array {
		return [ 'postId', 'postType' ];
	}

	protected function object_type(): string {
		return 'user';
	}

	protected function context_key(): string {
		return '';
	}

	protected function get_object_id( array $source_args, WP_Block $block_instance ) {
		$post_id = (int) ( $block_instance->context['postId'] ?? 0 );
		if ( $post_id ) {
			$post_type = $block_instance->context['postType'] ?? get_post_type( $post_id );
			if ( $post_type && ! post_type_supports( $post_type, 'author' ) ) {
				return null;
			}
			$author_id = (int) get_post_field( 'post_author', $post_id );
			return $author_id ?: null;
		}

		$author_id = (int) get_query_var( 'author' );
		if ( $author_id ) {
			return $author_id;
		}

		$queried = get_queried_object();
		return ( $queried instanceof WP_User ) ? (int) $queried->ID : null;
	}

	protected function get_type( array $source_args, WP_Block $block_instance ): string {
		return 'user';
	}

	protected function has_permission( $object_id, WP_Block $block_instance ): bool {
		// Author values are intended for front-end display (same as rwmb_meta with object_type=user).
		return (bool) get_userdata( (int) $object_id );
	}

	/**
	 * Fields for the bindings UI as a flat list.
	 * Skip fields with `hide_from_block_bindings` and fields from internal Meta Box extensions.
	 *
	 * @return list<array{label: string, type: string, args: array{id: string, key?: string}}>
	 */
	protected function get_fields(): array {
		$result      = [];
		$excluded    = $this->get_excluded_field_ids();
		$user_fields = rwmb_get_registry( 'field' )->get_by_object_type( 'user' )['user'] ?? [];

		foreach ( $user_fields as $field ) {
			if ( empty( $field['id'] ) || $field['hide_from_block_bindings'] || in_array( $field['id'], $excluded, true ) ) {
				continue;
			}
			$result = array_merge( $result, $this->binding_options( $field ) );
		}

		return wp_list_sort( $result, 'label' );
	}

	/**
	 * Field IDs from Meta Box extensions (not for front-end bindings).
	 *
	 * @return string[]
	 */
	private function get_excluded_field_ids(): array {
		$ids        = [ 'mbfp_posts' ]; // MB Favorite Posts (meta box has no stable ID).
		$meta_boxes = rwmb_get_registry( 'meta_box' )->get_by( [ 'object_type' => 'user' ] );

		foreach ( $this->get_excluded_meta_box_ids() as $meta_box_id ) {
			if ( empty( $meta_boxes[ $meta_box_id ] ) ) {
				continue;
			}
			foreach ( $meta_boxes[ $meta_box_id ]->fields as $field ) {
				if ( ! empty( $field['id'] ) ) {
					$ids[] = $field['id'];
				}
			}
		}

		return $ids;
	}

	/**
	 * Meta box IDs from Meta Box extensions (not for front-end bindings).
	 *
	 * @return string[]
	 */
	private function get_excluded_meta_box_ids(): array {
		return [
			'rwmb-user-register',       // MB User Profile
			'rwmb-user-login',          // MB User Profile
			'rwmb-user-lost-password',  // MB User Profile
			'rwmb-user-reset-password', // MB User Profile
			'rwmb-user-info',           // MB User Profile
		];
	}
}

<?php
namespace MBTM\Integrations\BlockBindings;

use MetaBox\Integrations\BlockBindings\Source;
use WP_Block;
use WP_Term;

/**
 * Block bindings source for term fields: meta-box/term-field.
 *
 * Editor rules (see assets/block-bindings.js):
 * - Post editor / single templates: fields for taxonomies attached to that post type.
 * - Taxonomy archive templates: fields for that taxonomy.
 *
 * Value resolution:
 * - Term context / taxonomy archive: current term.
 * - Post context: first term of the field's taxonomy assigned to the post
 *   (empty if the post has no term in that taxonomy).
 */
class Term extends Source {
	public function __construct() {
		// After Meta Box registers sources in the shared editor script (priority 10).
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor' ], 20 );
	}

	protected function name(): string {
		return 'meta-box/term-field';
	}

	protected function label(): string {
		return __( 'Meta Box Term Field', 'mb-term-meta' );
	}

	protected function contexts(): array {
		return [ 'termId', 'taxonomy', 'postId', 'postType' ];
	}

	protected function object_type(): string {
		return 'term';
	}

	protected function context_key(): string {
		return 'taxonomy';
	}

	/**
	 * Extra editor data for filtering fields by post type / labeling.
	 *
	 * @return array{name: string, label: string, usesContext: string[], contextKey: string, fields: array, taxonomiesByPostType: array<string, string[]>, taxonomyLabels: array<string, string>}
	 */
	public function get_editor_data(): array {
		$fields = $this->get_fields();
		$data   = parent::get_editor_data();
		$data['taxonomiesByPostType'] = $this->get_taxonomies_by_post_type( array_keys( $fields ) );
		$data['taxonomyLabels']       = $this->get_taxonomy_labels( array_keys( $fields ) );
		return $data;
	}

	public function enqueue_editor(): void {
		$fields = $this->get_fields();
		if ( ! $fields ) {
			return;
		}

		$file = MBTM_DIR . 'assets/block-bindings.js';
		wp_enqueue_script(
			'mb-term-meta-block-bindings',
			MBTM_URL . 'assets/block-bindings.js',
			[ 'rwmb-block-bindings', 'wp-blocks', 'wp-data', 'wp-editor' ],
			filemtime( $file ),
			true
		);
	}

	protected function get_object_id( array $source_args, WP_Block $block_instance ) {
		$term_id = (int) ( $block_instance->context['termId'] ?? 0 );
		if ( $term_id ) {
			return $term_id;
		}

		$queried = get_queried_object();
		if ( $queried instanceof WP_Term ) {
			return (int) $queried->term_id;
		}

		// Post context: use a term of this taxonomy assigned to the post.
		$post_id = (int) ( $block_instance->context['postId'] ?? get_the_ID() );
		if ( ! $post_id ) {
			return null;
		}

		$taxonomy = $this->get_type( $source_args, $block_instance );
		if ( ! $taxonomy || ! is_object_in_taxonomy( get_post_type( $post_id ), $taxonomy ) ) {
			return null;
		}

		$terms = get_the_terms( $post_id, $taxonomy );
		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			return null;
		}

		return (int) $terms[0]->term_id;
	}

	protected function get_type( array $source_args, WP_Block $block_instance ): string {
		$taxonomy = (string) ( $block_instance->context['taxonomy'] ?? '' );
		if ( $taxonomy ) {
			return $taxonomy;
		}

		if ( ! empty( $source_args['taxonomy'] ) ) {
			return (string) $source_args['taxonomy'];
		}

		$queried = get_queried_object();
		return ( $queried instanceof WP_Term ) ? $queried->taxonomy : '';
	}

	protected function has_permission( $object_id, WP_Block $block_instance ): bool {
		$term = get_term( (int) $object_id );
		if ( ! $term || is_wp_error( $term ) ) {
			return false;
		}

		$taxonomy = get_taxonomy( $term->taxonomy );
		if ( ! $taxonomy ) {
			return false;
		}

		if ( $taxonomy->public ) {
			return true;
		}

		return current_user_can( 'edit_term', $object_id );
	}

	/**
	 * Fields for the bindings UI, keyed by taxonomy.
	 * Skip fields with `hide_from_block_bindings`.
	 * Each option includes `taxonomy` in args for post-context value resolution.
	 *
	 * @return array<string, array>
	 */
	protected function get_fields(): array {
		$result      = [];
		$term_fields = rwmb_get_registry( 'field' )->get_by_object_type( 'term' );

		foreach ( $term_fields as $taxonomy => $fields ) {
			foreach ( $fields as $field ) {
				if ( empty( $field['id'] ) || $field['hide_from_block_bindings'] ) {
					continue;
				}

				foreach ( $this->binding_options( $field ) as $option ) {
					$option['args']['taxonomy'] = $taxonomy;
					$result[ $taxonomy ][]      = $option;
				}
			}
			if ( ! empty( $result[ $taxonomy ] ) ) {
				$result[ $taxonomy ] = wp_list_sort( $result[ $taxonomy ], 'label' );
			}
		}

		return $result;
	}

	/**
	 * Taxonomies that have term fields, grouped by post type they are attached to.
	 *
	 * @param string[] $taxonomies Taxonomy names that have fields.
	 * @return array<string, string[]>
	 */
	private function get_taxonomies_by_post_type( array $taxonomies ): array {
		$map = [];

		foreach ( $taxonomies as $taxonomy ) {
			$object = get_taxonomy( $taxonomy );
			if ( ! $object ) {
				continue;
			}
			foreach ( $object->object_type as $post_type ) {
				$map[ $post_type ][] = $taxonomy;
			}
		}

		return $map;
	}

	/**
	 * Taxonomy labels keyed by taxonomy name.
	 *
	 * @param string[] $taxonomies Taxonomy names that have fields.
	 * @return array<string, string>
	 */
	private function get_taxonomy_labels( array $taxonomies ): array {
		$labels = [];
		foreach ( $taxonomies as $taxonomy ) {
			$object = get_taxonomy( $taxonomy );
			$labels[ $taxonomy ] = $object ? ( $object->labels->singular_name ?: $taxonomy ) : $taxonomy;
		}
		return $labels;
	}
}

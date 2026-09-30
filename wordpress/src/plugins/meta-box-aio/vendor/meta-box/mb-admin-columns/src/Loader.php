<?php
namespace MBAC;

class Loader {
	/**
	 * Add admin columns for posts.
	 */
	public function posts(): void {
		$meta_boxes = rwmb_get_registry( 'meta_box' )->get_by( [ 'object_type' => 'post' ] );

		foreach ( $meta_boxes as $meta_box ) {
			$fields = array_filter( $meta_box->fields, [ $this, 'has_admin_columns' ] );
			if ( empty( $fields ) ) {
				continue;
			}
			$types = (array) $meta_box->post_types;
			$class = Post::class;

			// Support for WooCommerce HPOS.
			$order_types = array_intersect( $types, [ 'shop_order', 'shop_subscription' ] );
			if ( $order_types ) {
				$types = $order_types;
				$class = Order::class;
			}

			$table = isset( $meta_box->meta_box['table'] ) ? $meta_box->meta_box['table'] : '';

			foreach ( $types as $post_type ) {
				new $class( $post_type, $fields, $table );
			}
		}
	}

	/**
	 * Add admin columns for terms.
	 */
	public function taxonomies(): void {
		$meta_boxes = rwmb_get_registry( 'meta_box' )->get_by( [ 'object_type' => 'term' ] );
		foreach ( $meta_boxes as $meta_box ) {
			$fields = array_filter( $meta_box->fields, [ $this, 'has_admin_columns' ] );
			if ( empty( $fields ) ) {
				continue;
			}

			foreach ( $meta_box->taxonomies as $taxonomy ) {
				new Taxonomy( $taxonomy, $fields );
			}
		}
	}

	/**
	 * Add admin columns for users.
	 */
	public function users(): void {
		$meta_boxes = rwmb_get_registry( 'meta_box' )->get_by( [ 'object_type' => 'user' ] );
		foreach ( $meta_boxes as $meta_box ) {
			$fields = array_filter( $meta_box->fields, [ $this, 'has_admin_columns' ] );
			if ( empty( $fields ) ) {
				continue;
			}

			new User( 'user', $fields );
		}
	}

	/**
	 * Add admin columns for models.
	 */
	public function models(): void {
		$meta_boxes = rwmb_get_registry( 'meta_box' )->get_by( [ 'object_type' => 'model' ] );
		foreach ( $meta_boxes as $meta_box ) {
			$fields = array_filter( $meta_box->fields, [ $this, 'has_admin_columns' ] );
			if ( empty( $fields ) ) {
				continue;
			}

			$table = isset( $meta_box->meta_box['table'] ) ? $meta_box->meta_box['table'] : '';

			foreach ( $meta_box->models as $model ) {
				new Model( $model, $fields, $table );
			}
		}
	}

	/**
	 * Check if field has admin columns.
	 *
	 * @param array $field Field configuration.
	 *
	 * @return bool
	 */
	private function has_admin_columns( $field ) {
		return ! empty( $field['admin_columns'] );
	}
}

<?php
namespace MBAC;

class Order extends Base {

	private const HOOKS = [
		'shop_order'        => [
			'legacy_columns'       => 'manage_shop_order_posts_columns',
			'legacy_custom_column' => 'manage_shop_order_posts_custom_column',
			'legacy_sortable'      => 'manage_edit-shop_order_sortable_columns',
		],
		'shop_subscription' => [
			'legacy_columns'       => 'manage_edit-shop_subscription_columns',
			'legacy_custom_column' => 'manage_shop_subscription_posts_custom_column',
			'legacy_sortable'      => 'manage_edit-shop_subscription_sortable_columns',
			'hpos_columns'         => 'woocommerce_shop_subscription_list_table_columns',
			'hpos_custom_column'   => 'woocommerce_shop_subscription_list_table_custom_column',
			'hpos_sortable'        => 'woocommerce_shop_subscription_list_table_sortable_columns',
		],
	];

	protected function init() {
		if ( ! function_exists( 'wc_get_page_screen_id' ) ) {
			return;
		}

		$priority  = 20;
		$hooks     = self::HOOKS[ $this->object_type ];

		// Legacy / CPT screen
		add_filter( $hooks['legacy_columns'], [ $this, 'columns' ], $priority );
		add_action( $hooks['legacy_custom_column'], [ $this, 'show' ], $priority, 2 );
		add_filter( $hooks['legacy_sortable'], [ $this, 'sortable_columns' ], $priority );

		// HPOS screen
		if ( 'shop_order' === $this->object_type ) {
			$screen_id = wc_get_page_screen_id( 'shop_order' );

			add_filter( "manage_{$screen_id}_columns", [ $this, 'columns' ], $priority );
			add_action( "manage_{$screen_id}_custom_column", [ $this, 'show' ], $priority, 2 );
			add_filter( "manage_{$screen_id}_sortable_columns", [ $this, 'sortable_columns' ], $priority );
		} else {
			add_filter( $hooks['hpos_columns'], [ $this, 'columns' ], $priority );
			add_action( $hooks['hpos_custom_column'], [ $this, 'show' ], $priority, 2 );
			add_filter( $hooks['hpos_sortable'], [ $this, 'sortable_columns' ], $priority );
		}

		add_action( 'load-edit.php', [ $this, 'execute' ] );
	}

	public function execute() {
		if ( $this->is_screen() ) {
			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
		}
	}

	/**
	 * Show column content.
	 */
	public function show( $column, $order_or_id ) {
		$field = $this->find_field( $column );
		if ( false === $field ) {
			return;
		}

		$order_id = $order_or_id instanceof \WC_Order ? $order_or_id->get_id() : (int) $order_or_id;
		if ( ! $order_id ) {
			return;
		}

		$value = rwmb_meta( $field['id'], '', $order_id );
		if ( in_array( $value, [ '', [] ], true ) ) {
			return;
		}

		$config = [
			'before' => '',
			'after'  => '',
			'link'   => false,
		];
		if ( is_array( $field['admin_columns'] ) ) {
			$config = wp_parse_args( $field['admin_columns'], $config );
		}

		$value = rwmb_the_value( $field['id'], [ 'link' => false ], $order_id, false );

		if ( $config['link'] === 'edit' ) {
			$order = wc_get_order( $order_id );
			$link  = $order ? $order->get_edit_order_url() : '';
			if ( $link ) {
				$value = '<a href="' . esc_url( $link ) . '">' . $value . '</a>';
			}
		}

		// Don't need to escape $config, it is HTML wrapper set by client, escape will break HTML to text
		// Don't need to escape $value either, each field type has it's own format value to return HTML string ( like Image will return <img> ), escaping here would break those too.
		printf(
			'<div class="mb-admin-columns mb-admin-columns-%s" id="mb-admin-columns-%s">%s</div>',
			esc_attr( $field['type'] ),
			esc_attr( $field['id'] ),
			$config['before'] . $value . $config['after']
		);
	}

	/**
	 * Check if current screen matches this instance's order type only.
	 */
	private function is_screen(): bool {
		$screen = get_current_screen();
		if ( ! $screen ) {
			return false;
		}

		return $screen->post_type === $this->object_type || $screen->id === wc_get_page_screen_id( $this->object_type );
	}
}

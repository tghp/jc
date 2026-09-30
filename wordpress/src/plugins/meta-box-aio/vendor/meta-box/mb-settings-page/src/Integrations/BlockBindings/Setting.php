<?php
namespace MBSP\Integrations\BlockBindings;

use MetaBox\Integrations\BlockBindings\Source;
use WP_Block;

/**
 * Block bindings source for settings fields: meta-box/setting-field.
 *
 * Option name is stored in binding args (no block context for settings).
 */
class Setting extends Source {
	protected function name(): string {
		return 'meta-box/setting-field';
	}

	protected function label(): string {
		return __( 'Meta Box Setting Field', 'mb-settings-page' );
	}

	protected function contexts(): array {
		return [];
	}

	protected function object_type(): string {
		return 'setting';
	}

	protected function context_key(): string {
		return '';
	}

	protected function get_object_id( array $source_args, WP_Block $block_instance ) {
		return (string) ( $source_args['option_name'] ?? '' );
	}

	protected function get_type( array $source_args, WP_Block $block_instance ): string {
		return (string) ( $source_args['option_name'] ?? '' );
	}

	protected function has_permission( $object_id, WP_Block $block_instance ): bool {
		// Settings values are intended for front-end display (same as rwmb_meta with object_type=setting).
		return true;
	}

	/**
	 * Fields for the bindings UI as a flat list.
	 * Skip fields with `hide_from_block_bindings` and internal Meta Box settings pages.
	 * Each option includes `option_name` in args for value resolution.
	 *
	 * @return list<array{label: string, type: string, args: array{id: string, option_name: string, key?: string}}>
	 */
	protected function get_fields(): array {
		$result         = [];
		$setting_fields = rwmb_get_registry( 'field' )->get_by_object_type( 'setting' );
		$excluded       = $this->get_excluded_option_names();

		foreach ( $excluded as $option_name ) {
			unset( $setting_fields[ $option_name ] );
		}

		$multiple_pages = count( $setting_fields ) > 1;
		$page_titles    = $multiple_pages ? $this->get_page_titles() : [];

		foreach ( $setting_fields as $option_name => $fields ) {
			$page_title = $page_titles[ $option_name ] ?? $option_name;

			foreach ( $fields as $field ) {
				if ( empty( $field['id'] ) || $field['hide_from_block_bindings'] ) {
					continue;
				}

				foreach ( $this->binding_options( $field ) as $option ) {
					$option['args']['option_name'] = $option_name;
					if ( $multiple_pages ) {
						$option['label'] = sprintf(
							// translators: 1: settings page title, 2: field label.
							__( '%1$s: %2$s', 'mb-settings-page' ),
							$page_title,
							$option['label']
						);
					}
					$result[] = $option;
				}
			}
		}

		return wp_list_sort( $result, 'label' );
	}

	/**
	 * Option names for internal Meta Box settings pages (not for front-end bindings).
	 *
	 * @return string[]
	 */
	private function get_excluded_option_names(): array {
		return [
			'user-profile',      // MB User Profile
			'mb_favorite_posts', // MB Favorite Posts
		];
	}

	/**
	 * Settings page titles keyed by option name.
	 *
	 * @return array<string, string>
	 */
	private function get_page_titles(): array {
		$titles = [];
		$pages  = apply_filters( 'mb_settings_pages', [] );

		foreach ( $pages as $page ) {
			if ( ! is_array( $page ) ) {
				continue;
			}
			$option_name = $page['option_name'] ?? $page['id'] ?? '';
			if ( ! $option_name ) {
				continue;
			}
			$title = ( $page['page_title'] ?? '' ) ?: ( $page['menu_title'] ?? '' ) ?: $option_name;
			$titles[ $option_name ] = wp_strip_all_tags( $title );
		}

		return $titles;
	}
}

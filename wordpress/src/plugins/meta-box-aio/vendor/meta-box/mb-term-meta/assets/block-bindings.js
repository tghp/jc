( function ( wp, data ) {
	'use strict';

	const SOURCE_NAME = 'meta-box/term-field';

	if ( ! wp?.blocks?.registerBlockBindingsSource || ! data?.sources?.length ) {
		return;
	}

	const source = data.sources.find( item => item.name === SOURCE_NAME );
	const fields = source?.fields;
	if ( ! fields || ! Object.keys( fields ).length ) {
		return;
	}

	const taxonomies = Object.keys( fields );

	/**
	 * Taxonomy from a WP template slug (see block-template-utils.php).
	 *
	 * @param {string} slug
	 * @return {string|null}
	 */
	function taxonomyFromSlug( slug ) {
		if ( slug === 'category' || slug.startsWith( 'category-' ) ) {
			return 'category';
		}
		if ( slug === 'tag' || slug.startsWith( 'tag-' ) ) {
			return 'post_tag';
		}
		if ( ! slug.startsWith( 'taxonomy-' ) ) {
			return null;
		}
		const rest = slug.slice( 9 ); // after "taxonomy-"
		return taxonomies.find( tax => rest === tax || rest.startsWith( tax + '-' ) ) || null;
	}

	const fieldsFor = taxonomies => {
		taxonomies = taxonomies || [];
		const prefix = taxonomies.length > 1;
		return taxonomies.flatMap( tax => {
			const list = fields[ tax ] || [];
			if ( ! prefix ) {
				return list;
			}
			const name = source.taxonomyLabels?.[ tax ] || tax;
			return list.map( field => ( {
				...field,
				label: `${ name }: ${ field.label }`,
			} ) );
		} );
	};

	if ( wp.blocks.getBlockBindingsSource?.( SOURCE_NAME ) ) {
		wp.blocks.unregisterBlockBindingsSource( SOURCE_NAME );
	}

	wp.blocks.registerBlockBindingsSource( {
		name: source.name,
		label: source.label,
		usesContext: source.usesContext,
		getFieldsList( { context, select } ) {
			if ( context?.taxonomy && fields[ context.taxonomy ] ) {
				return fields[ context.taxonomy ];
			}

			const editor = select( 'core/editor' );
			const postType = editor?.getCurrentPostType?.() || context?.postType || '';

			// Post editor: taxonomies attached to the current post type.
			if ( postType && postType !== 'wp_template' && postType !== 'wp_template_part' ) {
				return fieldsFor( source.taxonomiesByPostType?.[ postType ] );
			}

			const slug = editor?.getEditedPostAttribute?.( 'slug' ) || editor?.getCurrentPost?.()?.slug || '';

			// Taxonomy archive templates.
			if ( /^(taxonomy|category|tag)(-|$)/.test( slug ) ) {
				return slug === 'taxonomy'
					? fieldsFor( taxonomies )
					: fields[ taxonomyFromSlug( slug ) ] || [];
			}

			// Single templates: taxonomies attached to that post type.
			const type = [ 'single', 'singular', 'home', 'index' ].includes( slug )
				? 'post'
				: slug.match( /^single-([a-z0-9_-]+)/i )?.[ 1 ];

			return type ? fieldsFor( source.taxonomiesByPostType?.[ type ] ) : [];
		},
		getValues: () => ( {} ),
		canUserEditValue: () => false,
	} );
} )( window.wp, window.rwmbBlockBindings );

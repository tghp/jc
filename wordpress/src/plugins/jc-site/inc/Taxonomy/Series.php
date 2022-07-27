<?php

namespace TGHP\Jc\Taxonomy;

use TGHP\Jc\Jc;

class Series extends AbstractTaxonomy
{

    /**
     * Defined taxonomy as constant here so if can it can be accessed
     * outside of this class without creating a new instantiation
     */
    const TAXONOMY_CODE = 'series';

    /**
     * {@inheritDoc}
     */
    protected $taxonomyCode = self::TAXONOMY_CODE;

    /**
     * Defined associated post type as constant here so if can it can be accessed
     * outside of this class without creating a new instantiation
     */
    const POST_TYPE_CODE = 'post';

    /**
     * {@inheritDoc}
     */
    protected $postTypeCode = self::POST_TYPE_CODE;

    /**
     * {@inheritDoc}
     */
    public function define(): array
    {
        $labels = array(
            'name'              => _x( 'Series', Jc::getTextDomain()),
            'singular_name'     => _x( 'Series Category', Jc::getTextDomain()),
            'search_items'      => __( 'Search Series', Jc::getTextDomain()),
            'all_items'         => __( 'All Series', Jc::getTextDomain()),
            'parent_item'       => __( 'Parent Series Category', Jc::getTextDomain()),
            'parent_item_colon' => __( 'Parent Series Category:', Jc::getTextDomain()),
            'edit_item'         => __( 'Edit Series Category', Jc::getTextDomain()),
            'update_item'       => __( 'Update Series Category', Jc::getTextDomain()),
            'add_new_item'      => __( 'Add New Series Category', Jc::getTextDomain()),
            'new_item_name'     => __( 'New Series Category Name', Jc::getTextDomain()),
            'menu_name'         => __( 'Series', Jc::getTextDomain()),
        );

        $args = array(
            'hierarchical'      => true, // Set this to 'false' for non-hierarchical taxonomy (like tags)
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'show_in_rest'      => true,
            'rewrite'           => array( 'slug' => 'series' ),
            'show_in_graphql'   => true,
            'graphql_single_name' => 'tghpTaxonomySeries',
            'graphql_plural_name' => 'tghpTaxonomySeries',
        );

        return $args;
    }
}

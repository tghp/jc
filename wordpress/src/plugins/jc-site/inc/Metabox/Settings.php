<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\Metabox;

class Settings extends AbstractMetabox implements MetaboxPreparerInterface, MetaboxDefinerInterface
{
    /**
     * {@inheritDoc}
     */
    public function prepare(): void
    {
        add_filter('mb_settings_pages', [$this, 'register']);
    }

    /**
     * Register settings page
     *
     * @param $settingsPages
     * @return mixed
     */
    public function register($settingsPages)
    {
        $settingsPages[] = [
            'id' => 'site-options',
            'menu_title' => 'Site Options',
            'option_name' => 'site_options',
            'submenu_title' => 'Options',
            'tab_style' => 'left',
            'submit_button' => 'Save Options',
            'columns' => 1,
            'tabs' => [
                'favourites' => 'Favourite posts',
            ],
        ];

        return $settingsPages;
    }

    /**
     * {@inheritDoc}
     */
    public function define(): array
    {
        $metaboxes[] = [
            'id' => Metabox::generateKey('options_favourites'),
            'title' => 'Favourite posts',
            'settings_pages' => 'site-options',
            'tab' => 'favourites',
            'revision' => true,
            'fields' => [
                [
                    'type' => 'heading',
                    'desc' => 'These posts will be displayed on the Favourites page.<br>The top three will appear on the home page.',
                ],
                [
                    'id' => 'options_favourites_posts',
                    'type' => 'post',
                    'post_type' => 'post',
                    'clone' => true,
                    'sort_clone' => true,
                    'add_button' => '+ Add Post',
                ],
            ]
        ];

        return $metaboxes;
    }
}

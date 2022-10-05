<?php

namespace TGHP\Jc;

class Url extends AbstractJc
{

    public function __construct(Jc $jc)
    {
        parent::__construct($jc);
        add_action('template_redirect', [$this, 'redirectGatsbyUrls']);
        add_filter('post_link', [$this, 'matchGatsbyUrls'], 10, 3);
    }

    public function getGatsbyBaseUrl()
    {
        if (defined('GATSBY_BASE_URL')) {
            $url = GATSBY_BASE_URL;
        } else {
            $url = home_url();
        }

        return rtrim($url, '/');
    }

    /**
     * Redirect front end requests to Gatsby
     *
     * @return void
     */
    public function redirectGatsbyUrls()
    {
        global $wp;
        $url = $this->getGatsbyBaseUrl() . $wp->request;
        wp_redirect($url, 301);
        exit;
    }


    /**
     * Rewrite display post links to Gatsby
     *
     * @param string $permalink
     * @param \WP_Post $post
     * @param bool $leavename
     * @return mixed
     */
    public function matchGatsbyUrls($permalink, $post, $leavename)
    {
        $path = str_replace(home_url(), '', $permalink);

        // Replace path based on post here if needed

        return $this->getGatsbyBaseUrl() . $path;
    }

}
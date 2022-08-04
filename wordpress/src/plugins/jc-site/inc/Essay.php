<?php

namespace TGHP\Jc;

class Essay extends AbstractJc
{

    public function __construct(Jc $ftx)
    {
        parent::__construct($ftx);

        add_filter('the_content', [$this, 'addHeaderSections']);
        add_filter('the_content', [$this, 'addReferenceSups']);
        add_filter('rwmb_get_value', [$this, 'applyShortcodeToWysiwygMetabox'], 10, 4 );
        add_shortcode('subscribe_modal_button', [$this, 'subscribeModalTriggerShortcode']);
        add_action('save_post', [$this, 'generatePdf']);
    }

    /**
     * @param $content
     * @return string
     */
    public function addHeaderSections($content)
    {
        /**
         * Add a <section> per heading
         */
        $closeSection = '</section>';
        $index = 0;
        $lastHeadingLevel = 0;
        $content = preg_replace_callback('/<h([0-9])([^>]*?)>/', function ($matches) use (&$index, &$lastHeadingLevel, $closeSection) {
            $openSection = '<section data-section-index="' . $index . '">';

            $index++;

            if ($index > 0) {
                $newHeadingLevel = intval($matches[1]);
                $return = '';

                if ($newHeadingLevel == $lastHeadingLevel) {
                    $return .= "{$closeSection}{$openSection}<h{$matches[1]}{$matches[2]}>";
                } else if ($newHeadingLevel > $lastHeadingLevel) {
                    for($i = 0; $i < ($newHeadingLevel - $lastHeadingLevel); $i++) {
                        $return .= $openSection;
                    }
                    $return .= "<h{$matches[1]}{$matches[2]}>";
                } else if ($newHeadingLevel < $lastHeadingLevel) {
                    for($i = 0; $i <= ($lastHeadingLevel - $newHeadingLevel); $i++) {
                        $return .= $closeSection;
                    }
                    $return .= "{$openSection}<h{$matches[1]}{$matches[2]}>";
                }

                $lastHeadingLevel = $newHeadingLevel;

                return $return;
            } else {
                return "{$openSection}<h{$matches[1]}{$matches[2]}>";
            }
        }, $content);

        $content .= $closeSection;

        /**
         * Add section anchors
         */
        $content = preg_replace_callback('#(<h[0-9][^>]*?>)(.*?)(</h[0-9]>)#', function ($matches) {
            return sprintf(
                '<a name="%4$s"></a>%1$s%2$s%3$s',
                $matches[1],
                $matches[2],
                $matches[3],
                $this->slugifySectionName($matches[2]),
            );
        }, $content);

        return $content;
    }

    /**
     * @param $content
     * @return string
     */
    public function addReferenceSups($content): string
    {
        $content = preg_replace(
            '/\[ref (\d*)\]/',
            '<sup class="article-reference" data-reference-number="$1">$1</sup>',
            $content
        );

        return $content;
    }

    public function slugifySectionName($sectionName)
    {
        $divider = '-';

        // replace non letter or digits by divider
        $sectionName = preg_replace('~[^\pL\d]+~u', $divider, $sectionName);

        // transliterate
        $sectionName = iconv('utf-8', 'us-ascii//TRANSLIT', $sectionName);

        // remove unwanted characters
        $sectionName = preg_replace('~[^-\w]+~', '', $sectionName);

        // trim
        $sectionName = trim($sectionName, $divider);

        // remove duplicate divider
        $sectionName = preg_replace('~-+~', $divider, $sectionName);

        // lowercase
        $sectionName = strtolower($sectionName);

        return $sectionName;
    }

    /**
     * Subscribe modal trigger shortcode
     */
    public function subscribeModalTriggerShortcode($attributes) {
        $input = shortcode_atts([
            'text' => 'Add text',
            'button_text' => 'Add button text',
        ], $attributes);

        return "<span class='shortcode-text-button'>
            {$input['text']} <a href='#' class='shortcode-text-button__button'>{$input['button_text']}</a>
        </span>";
    }

    /**
     * Enable shortcodes on metabox wysiwyg field
     */
    public function applyShortcodeToWysiwygMetabox($value, $field) {
        if ('wysiwyg' === $field['type']) {
            $value = do_shortcode($value);
        }
        return $value;
    }

    /*
     * @return void
     */
    public function generatePdf($postId)
    {
        if (get_post_type($postId) === 'post') {
            $post = get_post($postId);

            if ($post->post_status === 'publish') {
                $path = get_stylesheet_directory() . '/../../';
                shell_exec("cd {$path}; npm run generate-pdf -- {$postId}");

                if (isset($_ENV['GATSBY_CLOUD_BUILD_WEBHOOK_URL'])) {
                    wp_remote_post($_ENV['GATSBY_CLOUD_BUILD_WEBHOOK_URL']);
                }
            }
        }
    }

}
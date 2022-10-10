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
        add_filter('init_graphql_request', [$this, 'addTableOfContentsToGraph']);
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

        // strip any tags that may be in the title
        $sectionName = strip_tags($sectionName);

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

    public function addTableOfContentsToGraph()
    {
        register_graphql_object_type('TableOfContentsItem', [
            'description' => 'Table of Contents object',
            'fields' => [
                'url' => [
                    'type' => 'String',
                    'description' => 'The URL of the object.',
                ],
                'title' => [
                    'type' => 'String',
                    'description' => 'The title of the object.',
                ],
                'depth' => [
                    'type' => 'Int',
                    'description' => 'The depth of the item within the contents.',
                ],
            ],
        ]);

        register_graphql_field('Post', 'tableOfContents', [
            'type' => ['list_of' => 'TableOfContentsItem'],
            'description' => 'Table of Contents for the Post',
            'resolve' => function (\WPGraphQL\Model\Post $object) {
                $content = get_the_content($object->ID);

                if (preg_match_all('/<h(\d).*?>(.*?)<\/h2>/', $content, $matches, PREG_SET_ORDER)) {
                    $items = [];

                    foreach ($matches as $titleMatch) {
                        $items[] = [
                            'url' => '#' . $this->slugifySectionName($titleMatch[2]),
                            'title' => strip_tags($titleMatch[2]),
                            'depth' => $titleMatch[1],
                        ];
                    }

                    return $items;
                } else {
                    return [];
                }
            },
        ]);
    }

}
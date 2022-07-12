<?php

namespace TGHP\Jc;

use TGHP\Jc\PostType\PostTypeDefinerInterface;
use TGHP\Jc\PostType\CaseStudy;
use TGHP\Jc\PostType\Team;

class PostType extends AbstractDefines
{

    /**
     * @var array
     */
    protected $postTypes;

    public function __construct(Jc $jc)
    {
        parent::__construct($jc);

        add_action('init', [$this, 'addPostTypes']);
    }

    protected function _getDefiners()
    {
        return [];
    }

    protected function _processDefiner(DefinerInterface $definer)
    {
        return $definer;
    }

    /**
     * Actually add post types that come from our definers
     *
     * @param $postTypes
     * @return array
     */
    public function addPostTypes($postTypes)
    {
        foreach ($this->definerResults as $definer) {
            if ($definer instanceof PostTypeDefinerInterface) {
                register_post_type($definer->getPostTypeCode(), $definer->define());
            }
        }
    }

}

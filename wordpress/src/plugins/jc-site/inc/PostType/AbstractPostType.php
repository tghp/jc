<?php

namespace TGHP\Jc\PostType;

use TGHP\Jc\AbstractJc;
use TGHP\Jc\Jc;

abstract class AbstractPostType extends AbstractJc implements PostTypeDefinerInterface
{
    /**
     * Post type code
     *
     * @var null|string
     */
    protected $postTypeCode = null;

    /**
     * Disable gutenberg for this post type
     *
     * @var bool
     */
    protected $disableGutenberg = false;

    /**
     * AbstractPostType constructor.
     *
     * @param Jc $jc
     * @throws \Exception
     */
    public function __construct(Jc $jc)
    {
        parent::__construct($jc);

        // Ensure a post type code is set in child classes
        if (empty($this->postTypeCode)) {
            throw new \Exception(__('Must define post type code.', Jc::getTextDomain()));
        }
    }

    /**
     * Get post type code
     *
     * @return string
     */
    public function getPostTypeCode(): string
    {
        return $this->postTypeCode;
    }

}

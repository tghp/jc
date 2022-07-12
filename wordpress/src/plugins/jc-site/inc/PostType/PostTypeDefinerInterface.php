<?php

namespace TGHP\Jc\PostType;

use TGHP\Jc\DefinerInterface;

interface PostTypeDefinerInterface extends DefinerInterface
{

    /**
     * Return the post type code
     *
     * @return string
     */
    public function getPostTypeCode(): string;

}

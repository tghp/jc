<?php

namespace TGHP\JcTheme;

abstract class AbstractJc
{
    /**
     * @var Jc
     */
    protected $jc;

    /**
     * AbstractJc constructor.
     *
     * @param Jc $jc
     */
    public function __construct(
        Jc $jc
    ) {
        $this->jc = $jc;
    }
}

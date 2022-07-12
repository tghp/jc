<?php

namespace TGHP\Jc;

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

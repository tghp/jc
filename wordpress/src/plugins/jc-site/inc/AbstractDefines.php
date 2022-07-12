<?php

namespace TGHP\Jc;

abstract class AbstractDefines extends AbstractJc
{

    /**
     * @var array
     */
    protected $definerResults = [];

    public function __construct(Jc $jc)
    {
        parent::__construct($jc);

        // Run the definers now, gathering the defined metaboxes
        $this->processDefiners();
    }

    /**
     * Allow class to internally create definers
     *
     * @return array
     */
    protected function _getDefiners()
    {
        return [];
    }

    /**
     * Get all defined metaboxes
     *
     * @return array
     */
    public function getDefiners(): array
    {
        $definers = $this->_getDefiners();

        // Allow hooks
        $definers = apply_filters('tghp_metabox_add_definers', $definers, $this->jc);

        return $definers;
    }

    /**
     * Allow implementation to handle definer
     *
     * @param DefinerInterface $definer
     * @return mixed
     */
    protected function _processDefiner(DefinerInterface $definer)
    {
        return $definer->define();
    }

    /**
     * Iterate though definers and add results (if any) to an array
     *
     * @return array
     */
    public function processDefiners(): array
    {
        foreach ($this->getDefiners() as $definer) {
            if ($definer instanceof DefinerInterface) {
                $this->definerResults[] = $this->_processDefiner($definer);
            }
        }

        return $this->definerResults;
    }

}
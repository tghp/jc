<?php

namespace TGHP\Jc\Taxonomy;

use TGHP\Jc\AbstractJc;
use TGHP\Jc\Jc;

abstract class AbstractTaxonomy extends AbstractJc implements TaxonomyDefinerInterface
{
    /**
     * Taxonomy code
     *
     * @var null|string
     */
    protected $taxonomyCode = null;

    /**
     * Disable gutenberg for this taxonomy
     *
     * @var bool
     */
    protected $disableGutenberg = false;

    /**
     * Post type for the taxonomy
     *
     * @var null|string
     */
    protected $postTypeCode = null;

    /**
     * AbstractTaxonomy constructor.
     *
     * @param Jc $jc
     * @throws \Exception
     */
    public function __construct(Jc $jc)
    {
        parent::__construct($jc);

        // Ensure a taxonomy code is set in child classes
        if (empty($this->getTaxonomyCode())) {
            throw new \Exception(__('Must define taxonomy code.', Jc::getTextDomain()));
        }
    }

    /**
     * Get taxonomy code
     *
     * @return string
     */
    public function getTaxonomyCode(): string
    {
        return $this->taxonomyCode;
    }

    /**
     * Get associated post type code
     *
     * @return string
     */
    public function getAssociatedPostTypeCode(): string
    {
        return $this->postTypeCode;
    }

}

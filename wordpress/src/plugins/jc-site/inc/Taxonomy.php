<?php

namespace TGHP\Jc;

use TGHP\Jc\Taxonomy\TaxonomyDefinerInterface;
use TGHP\Jc\Taxonomy\Series;

class Taxonomy extends AbstractDefines
{

    /**
     * @var array
     */
    protected $taxonomy;

    public function __construct(Jc $jc)
    {
        parent::__construct($jc);

        add_action('init', [$this, 'addTaxonomies']);
    }

    protected function _getDefiners()
    {
        return [
            new Series($this->jc),
        ];
    }

    protected function _processDefiner(DefinerInterface $definer)
    {
        return $definer;
    }

    /**
     * Actually add taxonomies that come from our definers
     *
     * @param $taxonomy
     * @return array
     */
    public function addTaxonomies($taxonomy)
    {
        foreach ($this->definerResults as $definer) {
            if ($definer instanceof TaxonomyDefinerInterface) {
                register_taxonomy(
                    $definer->getTaxonomyCode(),
                    array( $definer->getAssociatedPostTypeCode() ),
                    $definer->define()
                );
            }
        }
    }

}

<?php

namespace TGHP\Jc\Blocks;

use TGHP\Jc\AbstractJc;
use TGHP\Jc\Jc;
use TGHP\Jc\Metabox\MetaboxDefinerInterface;

abstract class AbstractBlock extends AbstractJc implements BlockDefinerInterface, MetaboxDefinerInterface
{

    public function getCode(): string
    {
        $code = (new \ReflectionClass($this))->getShortName();
        $code = trim(
            strtolower(
                preg_replace('/([A-Z])/', '-$1', $code)
            ),
            '-'
        );
        return $code;
    }

    public function getId(): string
    {
        return "tghp-{$this->getCode()}-block";
    }

    public function render(): void
    {
        $template = sprintf(
            '%s/blocks/%s/template.php',
            TGHP_JC_PLUGIN_PATH,
            $this->getCode()
        );

        if (file_exists($template)) {
            $block = $this;
            require $template;
        }
    }

}
<?php

namespace TGHP\Jc\Metabox;

use TGHP\Jc\AbstractJc;

abstract class AbstractMetabox extends AbstractJc
{

    public function getWysiwygOptionsConfig(): array
    {
        return [
            'textarea_rows' => 10,
            'media_buttons' => false,
            'tinymce' => [
                'toolbar1' => 'bold, bullist, link, unlink',
                'toolbar2' => '',
                'toolbar3' => '',
            ],
        ];
    }
}

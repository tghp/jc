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
                'block_formats' => 'Paragraph=p; Heading=h5',
                'toolbar1' => 'formatselect, bold, bullist, link, unlink, blockquote',
                'toolbar2' => '',
                'toolbar3' => '',
            ],
        ];
    }
}

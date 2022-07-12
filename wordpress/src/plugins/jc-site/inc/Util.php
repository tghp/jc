<?php

namespace TGHP\Jc;

use PHPHtmlParser\Dom;
use PHPHtmlParser\Dom\Node\AbstractNode;

class Util extends AbstractJc
{

    public function getAttachmentSizesSrcset($attachment_id, $sizes)
    {
        $attachmentMeta = wp_get_attachment_metadata($attachment_id);
        $image = wp_get_attachment_image_src($attachment_id, 'full');

        if(!is_array($attachmentMeta) || !is_array($image)) {
            return false;
        }

        $imageSrc = $image[0];

        // Retrieve the uploads sub-directory from the full size image.
        $dirname = _wp_get_attachment_relative_path($attachmentMeta['file']);

        if ($dirname) {
            $dirname = trailingslashit($dirname);
        }

        $upload_dir    = wp_get_upload_dir();
        $image_baseurl = trailingslashit($upload_dir['baseurl']) . $dirname;

        /*
         * Images that have been edited in WordPress after being uploaded will
         * contain a unique hash. Look for that hash and use it later to filter
         * out images that are leftovers from previous versions.
         */
        $image_edited = preg_match( '/-e[0-9]{13}/', wp_basename($imageSrc), $image_edit_hash );

        // Array to hold URL candidates.
        $sources = array();

        foreach ($sizes as $_size) {
            if (isset($attachmentMeta['sizes'][$_size]) && is_array($attachmentMeta['sizes'][$_size])) {
                $sizeImage = $attachmentMeta['sizes'][$_size];

                // Filter out images that are from previous edits.
                if ($image_edited && !strpos($sizeImage['file'], $image_edit_hash[0])) {
                    continue;
                }

                // Add the URL, descriptor, and value to the sources array to be returned.
                $sources[$sizeImage['width']] = [
                    'url' => $image_baseurl . $sizeImage['file'],
                    'descriptor' => 'w',
                    'value' => $sizeImage['width'],
                ];
            }
        }


        // Only return a 'srcset' value if there is more than one source.
        if (!is_array($sources) || count($sources) < 2) {
            return false;
        }

        $srcset = '';

        foreach ($sources as $_source) {
            $srcset .= str_replace(' ', '%20', $_source['url']) . ' ' . $_source['value'] . $_source['descriptor'] . ', ';
        }

        return rtrim($srcset, ', ');
    }

}
<?php

namespace TGHP\Jc;

class Asset extends AbstractInheritingThemeFile
{

    /**
     * Store any found results in a basic cache
     *
     * @var array
     */
    protected $cache = [];

    public function getSearchSubPath($locationType)
    {
        return 'assets';
    }

    public function outputAsset($path, $base64 = false)
    {
        $path = apply_filters('tghp_posttype_asset_output_path', $path);

        if (isset($this->cache[$path])) {
            return $this->cache[$path];
        }

        if ($path = $this->locate($path)) {
            $assetContents = file_get_contents($path);

            $filetype = mime_content_type($path);

            if ($filetype === 'image/svg') {
                $filetype = 'image/svg+xml';
            }

            if ($base64) {
                $assetContents = sprintf(
                    'data:%s;base64,%s',
                    $filetype,
                    base64_encode($assetContents)
                );
            }

            $this->cache[$path] = $assetContents;

            return $assetContents;
        }

        return '';
    }

}
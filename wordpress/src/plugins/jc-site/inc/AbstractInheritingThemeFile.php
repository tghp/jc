<?php

namespace TGHP\Jc;

abstract class AbstractInheritingThemeFile extends AbstractJc
{

    const LOCATION_TYPE_THEME = 'theme';
    const LOCATION_TYPE_PLUGIN = 'plugin';

    protected $globalSubPath = '';

    /**
     * Search for files within this directory if defined
     *
     * @var string
     */
    public function getSearchSubPath($locationType)
    {
        return '';
    }

    /**
     * Retrieve the name of the highest priority template file that exists.
     *
     * Searches in the child theme before parent theme so that themes which
     * inherit from a parent theme can just overload one file. If the template is
     * not found in either of those, it looks in the theme-compat folder last.
     *
     * Taken from bbPress and EDD plugins
     *
     * @param string|array $files File(s) to search for, in order
     * @param bool $load If true the file will be loaded if it is found
     * @param bool $requireOnce Whether to require_once or require. Default true. Has no effect if $load is false
     * @param array $args Additional arguments passed to the template
     * @return string Filename if one is located
     */
    public function locate($files, $load = false, $requireOnce = true, $args = [])
    {
        $located = false;

        // Try to find a file
        foreach ((array)$files as $fileName) {
            if (empty($fileName)) {
                continue;
            }

            $template_name = ltrim($fileName, '/');

            // try locating this file by looping through the paths
            foreach ($this->getSearchPaths() as $filePath) {
                if (file_exists($filePath . $fileName)) {
                    $located = $filePath . $template_name;
                    break;
                }
            }

            if ($located) {
                break;
            }
        }

        if ((true == $load) && !empty($located)) {
            load_template($located, $requireOnce, $args);
        }

        return $located;
    }

    /**
     * Returns a list of paths to check for template locations
     *
     * Taken from bbPress and EDD plugins
     *
     * @return mixed|void
     */
    public function getSearchPaths()
    {
        $filePaths = [
            1 => trailingslashit(get_stylesheet_directory()) . $this->getSearchSubPath(self::LOCATION_TYPE_THEME),
            10 => trailingslashit(get_template_directory()) . $this->getSearchSubPath(self::LOCATION_TYPE_THEME),
            100 => Jc::getPluginPath() . DIRECTORY_SEPARATOR . $this->getSearchSubPath(self::LOCATION_TYPE_PLUGIN)
        ];

        // Sort paths based on priority
        ksort($filePaths, SORT_NUMERIC);

        return array_map(function ($path) {
            return trailingslashit($path) . ($this->globalSubPath ? trailingslashit($this->globalSubPath) : '');
        }, $filePaths);
    }
}
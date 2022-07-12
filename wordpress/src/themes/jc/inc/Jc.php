<?php

namespace TGHP\JcTheme;

class Jc
{
    /**
     * The single instance of the class.
     *
     * @var Jc
     */
    protected static $_instance = null;

    /**
     * Main JcTheme Instance.
     *
     * Ensures only one instance of NM is loaded or can be loaded.
     *
     * @return Jc
     */
    public static function instance(): Jc
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor.
     */
    public function __construct()
    {
        spl_autoload_register([$this, 'autoload']);
        new Theme($this);
    }

    /**
     * Autoload additional classes
     *
     * @param $className
     * @return void
     */
    public function autoload($className): void
    {
        $namespace = __NAMESPACE__;
        $namespaceCount = count(explode('\\', $namespace));

        $classNamespace = array_slice(explode('\\', $className), 0, $namespaceCount);
        $classNamespace = implode('\\', $classNamespace);

        if ($classNamespace !== $namespace) {
            return;
        }

        $className = str_replace($namespace . '\\', '', $className);
        $classParts = explode('\\', $className);
        $file = __DIR__ . '/' . implode('/', $classParts) . '.php';

        if (file_exists($file)) {
            include_once($file);
        }
    }

    /**
     * Get plugin name
     *
     * @return string
     */
    public static function getThemeName(): string
    {
        return constant('TGHP_JC_THEME_NAME');
    }

   /**
    * Get text domain
    *
    * @return string
    */
    public static function getTextDomain(): string
    {
        return self::getThemeName();
    }

}

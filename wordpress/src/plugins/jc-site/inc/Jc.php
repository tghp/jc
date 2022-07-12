<?php

namespace TGHP\Jc;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class Jc {

    /**
     * @var Metabox
     */
    public $metabox;

    /**
     * @var Blocks
     */
    public $blocks;

    /**
     * @var PostType
     */
    public $postType;

    /**
     * @var Taxonomy
     */
    public $taxonomy;
    
    /**
     * @var Asset
     */
    public $asset;

    /**
     * @var Util
     */
    public $util;

    /**
     * @var Essay
     */
    public $essay;

    /**
     * @var Logger
     */
    protected $logger;

    /**
     * Is logging allowed
     *
     * @var bool
     */
    protected $logging = false;

    /**
     * The single instance of the class.
     *
     * @var Jc
     */
    protected static $_instance = null;

    /**
     * Main Jc Instance.
     *
     * Ensures only one instance of Jc is loaded or can be loaded.
     *
     * @return Jc
     */
    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();

            do_action('jc-site_init');
        }

        return self::$_instance;
    }

   /**
    * Site constructor.
    */
   public function __construct()
   {
       $this->setupLogging();

       spl_autoload_register([$this, 'autoload']);
       $this->metabox = new Metabox($this);
       $this->blocks = new Blocks($this);
       $this->postType = new PostType($this);
       $this->taxonomy = new Taxonomy($this);
       $this->asset = new Asset($this);
       $this->util = new Util($this);
       $this->essay = new Essay($this);
   }

   /**
    * Set up logging
    *
    * @return void
    */
   private function setupLogging(): void
   {
       $loggerFilePath = WP_CONTENT_DIR . '/log/tghp-jc-site/';
       $filename = 'debug.log';

       if (!is_dir($loggerFilePath) && is_writable(WP_CONTENT_DIR)) {
           mkdir($loggerFilePath, 0777, true);
       }

       if (is_dir($loggerFilePath) && is_writable($loggerFilePath)) {
           $this->logging = true;
           $logger = new Logger(self::getPluginName());
           $logger->pushHandler(new StreamHandler($loggerFilePath . $filename));
           $this->logger = $logger;
       }
   }

   /**
    * Add message to log
    *
    * @param int $level
    * @param string $message
    * @param array $context
    * @return void
    */
   public function addLog(int $level, string $message, array $context = []): void
   {
       if ($this->logging) {
           $this->logger->addRecord($level, $message, $context);
       }
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
       } else {
           $this->addLog(Logger::ERROR, 'Unable to include file: ' . $file);
       }
   }

   /**
    * Get plugin name
    *
    * @return string
    */
   public static function getPluginName(): string
   {
       return constant('TGHP_JC_PLUGIN_NAME');
   }

   /**
    * Get text domain
    *
    * @return string
    */
   public static function getTextDomain(): string
   {
       return self::getPluginName();
   }

   /**
    * Get plugin path
    *
    * @return string
    */
   public static function getPluginPath(): string
   {
       return constant('TGHP_JC_PLUGIN_PATH');
   }

   /**
    * Get plugin url
    *
    * @return string
    */
   public static function getPluginUrl(): string
   {
       return constant('TGHP_JC_PLUGIN_URL');
   }

}
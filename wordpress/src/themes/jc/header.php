<!DOCTYPE html>
<html <?php language_attributes() ?>>
<head>
<meta charset="<?php bloginfo('charset') ?>" />
<meta name="viewport" content="width=device-width" />
<?php wp_head(); ?>
</head>
<body <?php body_class() ?>>
  <header class="site-header">
    <a href="<?php echo esc_url(home_url('/')) ?>" title="<?php echo esc_html(get_bloginfo('name')) ?>" rel="home">
      <?php echo esc_html(get_bloginfo('name')) ?>
    </a>
  </header>

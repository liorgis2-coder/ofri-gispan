<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php get_template_part( 'parts/sprite' ); ?>

<div class="site" dir="rtl" lang="he" data-route="<?php echo esc_attr( ofri_route() ); ?>">
<?php get_template_part( 'parts/veil' ); ?>
<?php get_template_part( 'parts/chrome-top' ); ?>

<main id="main">

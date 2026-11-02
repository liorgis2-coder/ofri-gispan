<?php get_header(); ?>
<div data-page="404">
  <header class="phero">
    <div class="wrap narrow">
      <p class="eyebrow">404</p>
      <h1>הדף הזה לא נמצא</h1>
      <p class="lead">אולי הקישור השתנה. אפשר לחזור <a href="<?php echo esc_url( home_url( '/' ) ); ?>">לדף הבית</a> או <a href="<?php echo esc_url( ofri_link( 'blog' ) ); ?>">לבלוג</a>.</p>
    </div>
  </header>
</div>
<?php
get_footer();

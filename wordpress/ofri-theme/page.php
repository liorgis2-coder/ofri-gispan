<?php
/**
 * The site's fixed pages render their designed body from templates/; any other page shows its content
 * in the same frame as the legal pages.
 */

get_header();

$route = ofri_route();
if ( $route && locate_template( "templates/page-{$route}.php" ) ) {
	get_template_part( "templates/page-{$route}" );
} else {
	while ( have_posts() ) :
		the_post();
		?>
<div data-page="page">
  <header class="phero">
    <div class="wrap narrow">
      <h1><?php the_title(); ?></h1>
    </div>
  </header>
  <section class="sec">
    <div class="wrap narrow">
      <article class="post-body"><?php the_content(); ?></article>
    </div>
  </section>
</div>
		<?php
	endwhile;
}

get_footer();

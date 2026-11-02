<?php
/**
 * The blog: the posts page, category archives and anything else that lists posts.
 */

get_header();

$current = is_category() ? get_queried_object_id() : 0;
$cats    = get_categories( array( 'hide_empty' => true ) );
?>
<div data-page="blog">
  <header class="phero">
    <div class="phero-art" aria-hidden="true"><span class="ph pa-1 arch ringed" data-plate="field" data-speed="-0.03" style="--pos:60% 70%;--zoom:1.25"><img alt=""></span><span class="ph pa-2 blob" data-plate="linen" data-speed="0.06" style="--zoom:1.3"><img alt=""></span></div>
    <div class="wrap narrow">
      <p class="eyebrow">בלוג</p>
      <h1><?php echo $current ? esc_html( single_cat_title( '', false ) ) : 'מילים לדרך'; ?></h1>
      <p class="lead">מאמרים על רגש, נשמה ותודעה.</p>
    </div>
  </header>
  <section class="sec">
    <div class="wrap">
      <?php if ( count( $cats ) > 1 ) : ?>
      <nav class="filters" aria-label="סינון לפי נושא">
        <a href="<?php echo esc_url( ofri_link( 'blog' ) ); ?>"<?php echo $current ? '' : ' aria-current="page"'; ?>>הכול</a>
        <?php foreach ( $cats as $cat ) : ?>
        <a href="<?php echo esc_url( get_category_link( $cat ) ); ?>"<?php echo $current === $cat->term_id ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $cat->name ); ?></a>
        <?php endforeach; ?>
      </nav>
      <?php endif; ?>
      <div class="posts">
        <?php
        while ( have_posts() ) :
			the_post();
			$cat = ofri_post_category();
			?>
        <a class="post-card post-real rv" href="<?php the_permalink(); ?>"><?php if ( $cat ) : ?><span class="cat"><?php echo esc_html( $cat ); ?></span><?php endif; ?><h2><?php the_title(); ?></h2><p class="excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></p><span class="link-more">לקריאה <svg aria-hidden="true"><use href="#i-arrow"/></svg></span></a>
        <?php endwhile; ?>
      </div>
      <?php
      the_posts_pagination(
	      array(
		      'prev_text' => 'חדשים יותר',
		      'next_text' => 'קודמים',
	      )
      );
      ?>
    </div>
  </section>
</div>
<?php
get_footer();

<?php
get_header();

while ( have_posts() ) :
	the_post();
	$cat        = ofri_post_category();
	$body_class = trim( 'post-body ' . get_post_meta( get_the_ID(), '_ofri_body_class', true ) );
	?>
<div data-page="post">
  <header class="phero">
    <div class="phero-art" aria-hidden="true"><span class="ph pa-1 arch ringed" data-plate="field" data-speed="-0.03" style="--pos:60% 70%;--zoom:1.25"><img alt=""></span><span class="ph pa-2 blob" data-plate="linen" data-speed="0.06" style="--zoom:1.3"><img alt=""></span></div>
    <div class="wrap narrow">
      <a class="back" href="<?php echo esc_url( ofri_link( 'blog' ) ); ?>">→ לכל המאמרים</a>
      <?php if ( $cat ) : ?><p class="eyebrow"><?php echo esc_html( $cat ); ?></p><?php endif; ?>
      <h1><?php the_title(); ?></h1>
      <p class="sub">עפרי גיספאן · <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></p>
    </div>
  </header>
  <section class="sec">
    <div class="wrap narrow">
      <article class="<?php echo esc_attr( $body_class ); ?>">
        <?php if ( has_post_thumbnail() ) : ?><figure class="pb-cover"><?php the_post_thumbnail( 'large' ); ?></figure><?php endif; ?>
        <?php the_content(); ?>
      </article>
      <aside class="post-cta" aria-label="פנייה לעפרי">
        <p>אם משהו כאן נגע בך – זה המקום להתחיל.</p>
        <div class="cta-row">
          <a class="btn btn-plum" data-wa href="https://wa.me/972507681816"><svg aria-hidden="true"><use href="#i-chat"/></svg>אני רוצה לדבר עם עפרי</a>
          <a class="tel" href="tel:+972507681816"><svg aria-hidden="true"><use href="#i-phone"/></svg><span class="ltr">050-7681816</span></a>
        </div>
      </aside>
    </div>
  </section>
</div>
	<?php
endwhile;

get_footer();

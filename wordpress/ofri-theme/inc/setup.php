<?php
/**
 * First activation: create the fixed pages, make "home" the front page and "blog" the posts page,
 * use /%postname%/ permalinks, and add Ofri's existing articles. Safe to run again; nothing is duplicated.
 */

defined( 'ABSPATH' ) || exit;

const OFRI_SETUP_VERSION = '1';

add_action( 'after_switch_theme', 'ofri_setup_site' );

// Hosts that activate themes without switch_theme() (Hostinger's API does) never fire
// after_switch_theme, so the first request after activation runs the setup instead.
add_action(
	'init',
	function () {
		if ( get_option( 'ofri_setup_version' ) !== OFRI_SETUP_VERSION ) {
			ofri_setup_site();
		}
	},
	100
);

function ofri_setup_site() {
	// Recorded first, so a second request arriving mid-setup doesn't start it again.
	update_option( 'ofri_setup_version', OFRI_SETUP_VERSION );

	$ids = array();
	foreach ( ofri_pages() as $slug => $page ) {
		$found = get_page_by_path( $slug );
		$ids[ $slug ] = $found ? $found->ID : wp_insert_post(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_name'   => $slug,
				'post_title'  => $page[0],
			)
		);
	}

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $ids['home'] );
	update_option( 'page_for_posts', $ids['blog'] );

	ofri_seed_posts();
	ofri_remove_samples();

	global $wp_rewrite;
	$wp_rewrite->set_permalink_structure( '/%postname%/' );
	flush_rewrite_rules();
}

function ofri_seed_posts() {
	$posts = json_decode( file_get_contents( get_theme_file_path( 'seed/posts.json' ) ), true );
	// Oldest first, so the blog lists them in the original order.
	$when = strtotime( '-' . count( $posts ) . ' days' );
	foreach ( array_reverse( $posts ) as $post ) {
		$when += DAY_IN_SECONDS;
		if ( get_page_by_path( $post['slug'], OBJECT, 'post' ) ) {
			continue;
		}
		$category = term_exists( $post['category'], 'category' );
		if ( ! $category ) {
			$category = wp_insert_term( $post['category'], 'category' );
		}
		wp_insert_post(
			array(
				'post_type'     => 'post',
				'post_status'   => 'publish',
				'post_name'     => $post['slug'],
				'post_title'    => $post['title'],
				'post_excerpt'  => $post['excerpt'],
				'post_content'  => $post['content'],
				'post_date'     => wp_date( 'Y-m-d H:i:s', $when ),
				'post_category' => array( (int) $category['term_id'] ),
				// Extra class for the article body, e.g. "pb-verse" for the poem-like post.
				'meta_input'    => $post['class'] ? array( '_ofri_body_class' => $post['class'] ) : array(),
			)
		);
	}
}

/** WordPress's own "Hello world!" post and "Sample Page", only while still untouched. */
function ofri_remove_samples() {
	foreach ( array( array( 'hello-world', 'post' ), array( 'sample-page', 'page' ) ) as $sample ) {
		$post = get_page_by_path( $sample[0], OBJECT, $sample[1] );
		if ( $post && $post->post_modified === $post->post_date ) {
			wp_trash_post( $post->ID );
		}
	}
}

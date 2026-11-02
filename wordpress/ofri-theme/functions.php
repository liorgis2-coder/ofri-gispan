<?php
/**
 * Ofri Gispan theme: the one-page site at the repo root, served as real WordPress pages and posts.
 */

defined( 'ABSPATH' ) || exit;

require get_theme_file_path( 'inc/pages.php' );
require get_theme_file_path( 'inc/setup.php' );

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
		add_theme_support( 'responsive-embeds' );
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		$ver = wp_get_theme()->get( 'Version' );
		wp_enqueue_style( 'ofri-fonts', 'https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600&family=Frank+Ruhl+Libre:wght@300;400;500&display=swap', array(), null );
		wp_enqueue_style( 'ofri', get_theme_file_uri( 'assets/site.css' ), array(), $ver );
		wp_enqueue_script( 'ofri-plates', get_theme_file_uri( 'assets/plates.js' ), array(), $ver, true );
		wp_enqueue_script( 'ofri', get_theme_file_uri( 'assets/site.js' ), array( 'ofri-plates' ), $ver, true );
		wp_localize_script( 'ofri', 'OFRI', array( 'photo' => get_theme_file_uri( 'assets/ofri.jpg' ) ) );
		// The block library styles fight the site's own typography; posts only need the basics.
		if ( ! is_singular( 'post' ) ) {
			wp_dequeue_style( 'wp-block-library' );
			wp_dequeue_style( 'global-styles' );
		}
	},
	20
);

// Every visitor's browser already draws emoji; WordPress's polyfill only adds weight.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

add_filter(
	'wp_resource_hints',
	function ( $urls, $type ) {
		if ( 'preconnect' === $type ) {
			$urls[] = 'https://fonts.googleapis.com';
			$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' );
		}
		return $urls;
	},
	10,
	2
);

/** An SEO plugin (Yoast, Rank Math) takes over titles and descriptions when present. */
function ofri_seo_plugin_active() {
	return defined( 'WPSEO_VERSION' ) || class_exists( 'RankMath' );
}

add_filter(
	'pre_get_document_title',
	function ( $title ) {
		if ( ofri_seo_plugin_active() ) {
			return $title;
		}
		$route = ofri_route();
		if ( 'post' === $route ) {
			return single_post_title( '', false ) . ' | עפרי גיספאן';
		}
		$pages = ofri_pages();
		return isset( $pages[ $route ] ) ? $pages[ $route ][1] : $title;
	}
);

function ofri_description() {
	$route = ofri_route();
	if ( 'post' === $route ) {
		return wp_strip_all_tags( get_the_excerpt( get_queried_object_id() ) );
	}
	$pages = ofri_pages();
	return isset( $pages[ $route ] ) ? $pages[ $route ][2] : ofri_pages()['home'][2];
}

add_action(
	'wp_head',
	function () {
		echo '<meta name="theme-color" content="#F5EEE3">' . "\n";
		echo '<link rel="icon" href="' . esc_url( get_theme_file_uri( 'assets/icon.svg' ) ) . '">' . "\n";
		if ( ofri_seo_plugin_active() ) {
			return;
		}
		$description = ofri_description();
		$title       = wp_get_document_title();
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $description ) );
		echo '<meta property="og:type" content="' . ( is_singular( 'post' ) ? 'article' : 'website' ) . '">' . "\n";
		echo '<meta property="og:locale" content="he_IL">' . "\n";
		printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( $title ) );
		printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $description ) );
		printf( '<meta property="og:url" content="%s">' . "\n", esc_url( is_singular() ? get_permalink() : home_url( add_query_arg( array() ) ) ) );
	},
	1
);

add_action(
	'wp_footer',
	function () {
		echo '<script type="application/ld+json">' . wp_json_encode( json_decode( file_get_contents( get_theme_file_path( 'parts/schema.json' ) ) ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	}
);

/** Blog card category: the post's first category, used for the filter buttons too. */
function ofri_post_category( $post = null ) {
	$cats = get_the_category( $post );
	return $cats ? $cats[0]->name : '';
}

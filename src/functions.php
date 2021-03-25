<?php
/**
 * Enqueue scripts and styles.
 */
function themeName_scripts() {
	wp_enqueue_style( 'themeName-style', get_stylesheet_uri() );

  wp_enqueue_script( 'themeName-script', get_template_directory_uri() . '/js/script.js', array(), '1.0.0', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'themeName_scripts' );
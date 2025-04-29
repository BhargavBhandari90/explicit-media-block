<?php
/**
 * Plugin Name:       Explicit Media Block
 * Description:       Add likeable, shareable image and video to your site with this WordPress block.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            BuntyWP
 * Author URI:        https://biliplugins.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       explicit-media-block
 *
 * @package ExplicitMedia
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function buntywp_explicit_media_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'buntywp_explicit_media_block_init' );

/**
 * Store Media Likes.
 */
function btwp_exp_media_handle_likes() {

	// Security check.
	check_ajax_referer( 'btwp_exp_media_nonce', 'nonce' );

	if ( ! is_user_logged_in() ) {
		wp_send_json_error(
			array(
				'message' => esc_html__( 'You must be logged in.', 'explicit-media-block' ),
			),
			403
		);
		return;
	}

	if ( empty( $_POST['context'] ) ) {
		wp_send_json_error(
			array(
				'message' => esc_html__( 'Something went wrong. Try again later.', 'explicit-media-block' ),
			)
		);
	}

	$contex = json_decode( stripslashes( sanitize_text_field( wp_unslash( $_POST['context'] ) ) ) );
	$contex = (array) $contex;

	$post_id  = $contex['postId'];
	$block_id = $contex['blockId'];
	$meta_key = 'exmedia-' . md5( $block_id );

	update_post_meta( $post_id, $meta_key, $contex );

	update_user_meta( get_current_user_id(), $meta_key, $contex['liked'] );

	wp_send_json_success(
		array(
			'message' => esc_html__( 'Vote recorded successfully', 'explicit-media-block' ),
		)
	);
}

add_action( 'wp_ajax_save_media_likes', 'btwp_exp_media_handle_likes' );

/**
 * Convert hexadecimal color to RGB.
 *
 * @param string $hex Hexadecimal color code.
 * @return string RGB color code.
 */
function btwp_exp_media_hex2rgb( $hex ) {

	// If it is RGB already.
	if ( preg_match( '/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i', $hex, $matches ) ) {
		return array(
			(int) $matches[1],
			(int) $matches[2],
			(int) $matches[3],
		);
	}

	$hex = str_replace( '#', '', $hex );

	if ( 3 === strlen( $hex ) ) {
		$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
		$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
		$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
	} else {
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
	}

	return array( $r, $g, $b );
}

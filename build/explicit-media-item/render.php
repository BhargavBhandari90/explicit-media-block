<?php
/**
 * Render block.
 *
 * @package ExplicitMedia
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

global $post;

wp_interactivity_state(
	'buntywp/explicit-media',
	array(
		'ajaxUrl' => admin_url( 'admin-ajax.php' ),
		'nonce'   => wp_create_nonce( 'btwp_exp_media_nonce' ),
	)
);

$context      = $attributes;
$meta_key     = 'exmedia-' . md5( $attributes['blockId'] );
$meta_context = get_post_meta( $post->ID, $meta_key, true );
$meta_context = json_decode( wp_json_encode( $meta_context ), true );

if ( ! empty( $meta_context ) ) {
	$context = $meta_context;
}

$context['liked']  = get_user_meta( get_current_user_id(), $meta_key, true );
$context['postId'] = $post->ID;
$attributes_style  = $attributes['style']['dimensions'] ?? array();
$inline_style      = '';

if ( ! empty( $attributes_style ) ) {
	foreach ( $attributes_style as $key => $value ) {
		$css_property  = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $key ) );
		$inline_style .= $css_property . ': ' . esc_attr( $value ) . '; ';
	}
}

$block_atts = get_block_wrapper_attributes( array( 'style' => $inline_style ) );

preg_match( '/style="([^"]*)"/', $block_atts, $matches );
$style_string = $matches[1] ?? '';

$style_array = array();
foreach ( explode( ';', $style_string ) as $style ) {
	$style = trim( $style );
	if ( ! $style ) {
		continue;
	}

	list($key, $value)           = explode( ':', $style, 2 );
	$style_array[ trim( $key ) ] = trim( $value );
}


$border_style               = array();
$border_style['object-fit'] = $attributes['scale'];
if ( isset( $style_array['border-radius'] ) ) {
	$border_style['border-radius'] = $style_array['border-radius'];
	unset( $style_array['border-radius'] );
}
if ( isset( $style_array['border-width'] ) ) {
	$border_style['border-width'] = $style_array['border-width'];
	unset( $style_array['border-width'] );
}

$new_style_string = '';
if ( ! empty( $style_array ) ) {
	$new_style_string = 'style="' . implode( '; ', array_map( fn( $k, $v ) => "$k: $v", array_keys( $style_array ), $style_array ) ) . '"';
}

$updatedblock_atts = preg_replace( '/style="([^"]*)"/', $new_style_string, $block_atts );

$border_inline_style = '';

if ( ! empty( $border_style ) ) {
	foreach ( $border_style as $key => $value ) {
		$border_css_property  = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $key ) );
		$border_inline_style .= $border_css_property . ': ' . esc_attr( $value ) . '; ';
	}
}

$duotone        = $attributes['style']['color']['duotone'] ?? '';
$duotone_filter = 'filter-' . md5( wp_json_encode( $duotone ) );

?>
<div
	class="buntywp-exp-media-container"
	data-wp-interactive="buntywp/explicit-media"
	data-wp-watch="callbacks.expSetupLightbox"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
>

	<?php

	if ( ! empty( $attributes['mediaUrl'] ) ) {

		echo '<div class="image-container"><figure ' . wp_kses_data( $updatedblock_atts ) . '>';

		switch ( $attributes['mediaType'] ) {
			case 'image':
				$srcset = wp_get_attachment_image_srcset( $attributes['mediaId'] );
				echo wp_sprintf(
					'<img src="%1$s" class="uploaded-media %4$s" loading="lazy" srcset="%2$s" style="%3$s" sizes="%5$s" data-wp-on-async--click="actions.expShowLightbox" />',
					esc_url( $attributes['mediaUrl'] ),
					esc_attr( $srcset ),
					esc_attr( $border_inline_style ),
					esc_attr( $duotone_filter ),
					esc_attr( wp_calculate_image_sizes( 'full', '', '', $attributes['mediaId'] ) )
				);

				?>
				<button
					class="exp-media-lightbox-trigger"
					type="button"
					aria-haspopup="dialog"
					aria-label="<?php echo esc_html__( 'Enlarge' ); ?>"
					data-wp-on-async--click="actions.expShowLightbox"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						fill="none"
						viewBox="0 0 12 12"
					>
						<path
							fill="#fff"
							d="M2 0a2 2 0 0 0-2 2v2h1.5V2a.5.5 0 0 1 .5-.5h2V0H2Zm2 10.5H2a.5.5 0 0 1-.5-.5V8H0v2a2 2 0 0 0 2 2h2v-1.5ZM8 12v-1.5h2a.5.5 0 0 0 .5-.5V8H12v2a2 2 0 0 1-2 2H8Zm2-12a2 2 0 0 1 2 2v2h-1.5V2a.5.5 0 0 0-.5-.5H8V0h2Z"
						/>
					</svg>
				</button>
				<?php

				break;
			case 'video':
				echo wp_sprintf(
					'<video controls class="uploaded-media"><source src="%1$s" type="video/mp4"></video>',
					esc_url( $attributes['mediaUrl'] )
				);
				break;
			default:
				echo '<p>' . esc_html__( 'Unsupported media type.', 'explicit-media-block' ) . '</p>';
		}

		echo '</figure></div>';
		if ( ! empty( $duotone ) ) {

			add_action(
				'wp_footer',
				function () use ( $duotone, $duotone_filter ) {
					$colors = is_array( $duotone ) ? $duotone : array();
					if ( count( $colors ) === 2 ) {
						$svg_id = $duotone_filter;
						echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 0" width="0" height="0" focusable="false" role="none" style="visibility: hidden; position: absolute; left: -9999px; overflow: hidden;">';
						echo '<defs>';
						echo '<filter id="' . esc_attr( $svg_id ) . '">';
						echo '<feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"></feColorMatrix>';
						echo '<feComponentTransfer color-interpolation-filters="sRGB">';
						echo '<feFuncR type="table" tableValues="' . esc_attr( btwp_exp_media_hex2rgb( $colors[0] )[0] / 255 ) . ' ' . esc_attr( btwp_exp_media_hex2rgb( $colors[1] )[0] / 255 ) . '"></feFuncR>';
						echo '<feFuncG type="table" tableValues="' . esc_attr( btwp_exp_media_hex2rgb( $colors[0] )[1] / 255 ) . ' ' . esc_attr( btwp_exp_media_hex2rgb( $colors[1] )[1] / 255 ) . '"></feFuncG>';
						echo '<feFuncB type="table" tableValues="' . esc_attr( btwp_exp_media_hex2rgb( $colors[0] )[2] / 255 ) . ' ' . esc_attr( btwp_exp_media_hex2rgb( $colors[1] )[2] / 255 ) . '"></feFuncB>';
						echo '</feComponentTransfer>';
						echo '</filter>';
						echo '</defs>';
						echo '</svg>';
					}
				},
				99
			);
		}

		add_action(
			'wp_head',
			function () use ( $duotone_filter ) {
				if ( ! empty( $duotone_filter ) ) {
					echo '<style>
				.' . esc_attr( $duotone_filter ) . ' {
					filter: url(#' . esc_attr( $duotone_filter ) . ');
				}
				</style>';
				}
			},
			99
		);

		?>
		<div class="exp-media-actions">
			<button
				data-wp-class--liked="state.isMediaLiked"
				class="exp-media-like-button"
				data-wp-on-async--click="actions.toggleLike"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="heart-icon">
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
				</svg>
			</button>
			<span class="exp-media-like-count" data-wp-text="state.likeCount"></span>
			<div class="exp-media-lightbox" data-wp-class--hide="!state.expIsPopupOpen">
				<div class="exp-media-item full-width">
					<img data-wp-bind--src="state.expImageSrc" />
					<button
						type="button"
						aria-label="<?php echo __( 'Press ESC to Cloese' ) ?>"
						class="exp-media-remove-popup"
						data-wp-on-async--click="actions.expHideLightbox"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="20"
							height="20"
							aria-hidden="true"
							focusable="false"
						>
							<path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<?php

	} else {
		echo '<p>' . esc_html__( 'No media found.', 'explicit-media-block' ) . '</p>';
	}
	?>

</div>

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
		'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
		'nonce'            => wp_create_nonce( 'btwp_exp_media_nonce' ),
		'userLoggedIn'     => is_user_logged_in(),
		'showLoginMessage' => false,
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

$duotone        = ! empty( $attributes['style']['color']['duotone'] ) && 'unset' !== $attributes['style']['color']['duotone']
	? $attributes['style']['color']['duotone']
	: '';
$duotone_filter = ! empty( $duotone ) ? 'filter-' . md5( wp_json_encode( $duotone ) ) : '';

$context['isShareOpen'] = false;
$context['expShareUrl'] = trailingslashit( get_permalink( $post->ID ) ) . '#' . $meta_key;

?>
<div
	class="buntywp-exp-media-container"
	data-wp-interactive="buntywp/explicit-media"
	data-wp-watch="callbacks.expSetupLightbox"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
>

	<?php

	if ( ! empty( $attributes['mediaUrl'] ) ) {

		echo '<div class="image-container" id="' . esc_attr( $meta_key ) . '"><figure ' . wp_kses_data( $updatedblock_atts ) . '>';

		switch ( $attributes['mediaType'] ) {
			case 'image':
				$srcset = wp_get_attachment_image_srcset( $attributes['mediaId'] );
				echo wp_get_attachment_image(
					$attributes['mediaId'],
					'full',
					true,
					array(
						'src'                     => esc_url( $attributes['mediaUrl'] ),
						'class'                   => 'uploaded-media ' . esc_attr( $duotone_filter ),
						'loading'                 => 'lazy',
						'srcset'                  => esc_attr( $srcset ),
						'style'                   => esc_attr( $border_inline_style ),
						'sizes'                   => esc_attr( wp_calculate_image_sizes( 'full', '', '', $attributes['mediaId'] ) ),
						'data-wp-on-async--click' => 'actions.expShowLightbox',
					),
				);

				?>
				<button
					class="exp-media-lightbox-trigger"
					type="button"
					aria-haspopup="dialog"
					aria-label="<?php echo esc_html__( 'Enlarge', 'explicit-media-block' ); ?>"
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
					'<video controls class="uploaded-media"><source src="%1$s" type="video/mp4"></video><button data-wp-on--click="callbacks.expDisplayPiP" class="pip-button" aria-label="Toggle PiP"><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M2 5.75C2 4.23122 3.23122 3 4.75 3H15.25C16.7688 3 18 4.23122 18 5.75V10H17V5.75C17 4.7835 16.2165 4 15.25 4H4.75C3.7835 4 3 4.7835 3 5.75V12.25C3 13.2165 3.7835 14 4.75 14H9V15H4.75C3.23122 15 2 13.7688 2 12.25V5.75ZM11.5 11C10.6716 11 10 11.6716 10 12.5V16.5C10 17.3284 10.6716 18 11.5 18H17.5C18.3284 18 19 17.3284 19 16.5V12.5C19 11.6716 18.3284 11 17.5 11H11.5ZM4.64645 5.64645C4.84171 5.45118 5.15829 5.45118 5.35355 5.64645L8 8.29289V6.5C8 6.22386 8.22386 6 8.5 6C8.77614 6 9 6.22386 9 6.5V9.5C9 9.77614 8.77614 10 8.5 10H5.5C5.22386 10 5 9.77614 5 9.5C5 9.22386 5.22386 9 5.5 9H7.29289L4.64645 6.35355C4.45118 6.15829 4.45118 5.84171 4.64645 5.64645Z" fill="#212121" /></svg></button>',
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
		}

		?>
		<div class="exp-media-actions">
			<div class="exp-media-action-item">
				<button
					data-wp-class--liked="state.isMediaLiked"
					class="exp-media-like-button exp-media-button"
					data-wp-on-async--click="actions.expToggleLike"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="heart-icon">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					</svg>
				</button>
				<span class="exp-media-like-count" data-wp-text="state.likeCount"></span>
			</div>
			<div class="exp-media-action-item">
				<button
					class="exp-media-share-button exp-media-button"
					data-wp-on--click="actions.expToggleShare"
				>
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path d="M17.5 3a3.5 3.5 0 0 0-3.456 4.06L8.143 9.704a3.5 3.5 0 1 0-.01 4.6l5.91 2.65a3.5 3.5 0 1 0 .863-1.805l-5.94-2.662a3.53 3.53 0 0 0 .002-.961l5.948-2.667A3.5 3.5 0 1 0 17.5 3Z"/>
					</svg>
				</button>
				<div class="exp-share-popup" data-wp-class--hide="!context.isShareOpen">
					<a data-wp-bind--href="state.expTwitterShareURL" class="exp-share-option" data-share="twitter">
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
							<path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
						</svg>
					</a>
					<a data-wp-bind--href="state.expFBShareURL" class="exp-share-option" data-share="facebook">
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
							<path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
						</svg>
					</a>
					<button data-wp-on--click="actions.expCopyLink" class="exp-share-option" data-share="copy">
						<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
							<path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
							<path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<div class="exp-media-lightbox" data-wp-class--hide="!state.expIsPopupOpen">
			<div class="exp-media-item full-width">
				<?php
				echo wp_get_attachment_image(
					0,
					'full',
					true,
					array(
						'data-wp-bind--src' => 'state.expImageSrc',
						'class'             => 'exp-media-image-preview',
					),
				);
				?>
				<button
					type="button"
					aria-label="<?php echo esc_html__( 'Press ESC to Cloese', 'explicit-media-block' ); ?>"
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
		<div class="exp-media-toast" data-wp-class--copied="state.Copied" data-wp-class--hide="!state.Copied">Link copied to clipboard!</div>
		<div class="exp-media-toast" data-wp-class--hide="!state.showLoginMessage">Please Login to Like this.</div>
		<?php

	} else {
		echo '<p>' . esc_html__( 'No media found.', 'explicit-media-block' ) . '</p>';
	}
	?>

</div>

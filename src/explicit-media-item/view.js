/* global navigator */
import { store, getContext } from '@wordpress/interactivity';

const { state } = store( 'buntywp/explicit-media', {
	isOpen: false,
	isMediaShared: false,
	imageSrc: '',
	Copied: false,
	state: {
		get isMediaLiked() {
			const context = getContext();
			return context.liked;
		},

		get likeCount() {
			const context = getContext();
			return expMediaFormatNumber( context.likeCount );
		},

		get expImageSrc() {
			return state.imageSrc;
		},

		get expIsPopupOpen() {
			return state.isOpen;
		},

		get expTwitterShareURL() {
			const context = getContext();
			const sharelink =
				'https://x.com/intent/post?url=' +
				encodeURIComponent( context.expShareUrl );
			return sharelink;
		},

		get expFBShareURL() {
			const context = getContext();
			const sharelink =
				'https://www.facebook.com/sharer/sharer.php?u=' +
				encodeURIComponent( context.expShareUrl );
			return sharelink;
		},
	},
	actions: {
		expToggleLike: () => {
			if ( ! state.userLoggedIn ) {
				state.showLoginMessage = true;
				setTimeout( () => {
					state.showLoginMessage = false;
				}, 2000 );
				return;
			}

			const context = getContext();

			context.liked = context.liked ? false : true;
			context.likeCount = context.liked
				? Number( context.likeCount + 1 )
				: Number( context.likeCount - 1 );

			saveContextToServer( context );
		},

		expShowLightbox: () => {
			const context = getContext();
			state.isOpen = true;
			state.imageSrc = context.mediaUrl;
		},

		expHideLightbox: () => {
			state.isOpen = false;
			state.imageSrc = '';
		},

		expToggleShare: () => {
			const context = getContext();
			context.isShareOpen = ! context.isShareOpen;
		},

		expCopyLink: () => {
			const context = getContext();
			const linkToCopy = context.expShareUrl;
			navigator.clipboard.writeText( linkToCopy );
			state.Copied = true;
			setTimeout( () => {
				state.Copied = false;
			}, 2000 );
		},
	},
	callbacks: {
		expSetupLightbox: () => {
			window.addEventListener( 'keydown', ( event ) => {
				if ( 'Escape' === event.key ) {
					store( 'buntywp/explicit-media' ).actions.expHideLightbox();
				}
			} );

			window.addEventListener( 'click', function ( event ) {
				const isOutsideShareElements =
					! event.target.closest( '.exp-media-share-button' ) &&
					! event.target.closest( '.exp-share-popup' );
				if ( isOutsideShareElements ) {
					closeAllSharePopups();
				}
			} );
		},

		expDisplayPiP: ( event ) => {
			const video = event.currentTarget
				?.closest( '.image-container' )
				?.querySelector( 'video' );

			if ( video && document.pictureInPictureEnabled ) {
				if ( document.pictureInPictureElement ) {
					// eslint-disable-next-line no-console
					document.exitPictureInPicture().catch( console.error );
				} else {
					// eslint-disable-next-line no-console
					video.requestPictureInPicture().catch( console.error );
				}
			}
		},
	},
} );

/**
 * Save the Context to the server via AJAX.
 *
 * @param {Object} context Block Context.
 */
function saveContextToServer( context ) {
	fetch( state.ajaxUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams( {
			action: 'save_media_likes',
			nonce: state.nonce,
			context: JSON.stringify( context ),
		} ),
	} )
		.then( ( response ) => response.json() )
		.then( () => {
			// Data saved.
		} )
		.catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( 'Error saving Like:', error );
		} );
}

/**
 * Format a number for display.
 *
 * @param {num} num Number.
 */
function expMediaFormatNumber( num ) {
	if ( num < 1000 ) {
		return num.toString();
	} else if ( num < 1000000 ) {
		return ( num / 1000 ).toFixed( 1 ) + 'K';
	}
	return ( num / 1000000 ).toFixed( 1 ) + 'M';
}

function closeAllSharePopups() {
	document.querySelectorAll( '.exp-share-popup' ).forEach( ( popup ) => {
		popup.classList.add( 'hide' );
	} );
}

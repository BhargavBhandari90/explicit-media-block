import { store, getContext } from '@wordpress/interactivity';

const { state } = store( 'buntywp/explicit-media', {
	isOpen: false,
	imageSrc: '',
	state: {
		get isMediaLiked() {
			const context = getContext();
			return context.liked;
		},

		get likeCount() {
			const context = getContext();
			return formatNumber( context.likeCount );
		},

		get expImageSrc() {
			console.log( 'state.imageSrc', state.imageSrc );
			return state.imageSrc;
		},
		get expIsPopupOpen() {
			return state.isOpen;
		},
	},
	actions: {
		toggleLike: () => {
			const context = getContext();
			context.liked = context.liked ? false : true;
			context.likeCount = context.liked
				? Number( context.likeCount + 1 )
				: Number( context.likeCount - 1 );

			saveContextToServer( context );
		},

		expShowLightbox: () => {
			const context = getContext();
			console.log( 'context', context.mediaUrl );
			state.isOpen = true;
			state.imageSrc = context.mediaUrl;
		},

		expHideLightbox: () => {
			state.isOpen = false;
			state.imageSrc = '';
		},
	},
	callbacks: {
		expSetupLightbox: () => {
			window.addEventListener( 'keydown', ( event ) => {
				if ( 'Escape' === event.key ) {
					store( 'buntywp/explicit-media' ).actions.expHideLightbox();
				}
			} );
		},
	},
} );

/**
 * Save the Context to the server via AJAX.
 *
 * @param {object} context Block Context.
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
		.then( ( data ) => {
			console.log( 'Like saved:', data );
		} )
		.catch( ( error ) => {
			console.error( 'Error saving Like:', error );
		} );
}

function formatNumber( num ) {
	if ( num < 1000 ) {
		return num.toString();
	} else if ( num < 1000000 ) {
		return ( num / 1000 ).toFixed( 1 ) + 'K';
	} else {
		return ( num / 1000000 ).toFixed( 1 ) + 'M';
	}
}

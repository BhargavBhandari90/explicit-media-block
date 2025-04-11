import { store, getContext } from '@wordpress/interactivity';

const { state } = store( 'buntywp/explicit-media', {
	state: {
		get isMediaLiked() {
			const context = getContext();
			return context.liked;
		},

		get likeCount() {
			const context = getContext();
			return formatNumber( context.likeCount );
		},
	},
	actions: {
		toggleLike: () => {
			const context     = getContext();
			context.liked     = context.liked ? false : true;
			context.likeCount = context.liked ? Number( context.likeCount + 1) : Number( context.likeCount - 1 );

			saveContextToServer( context );
		},
	},
	callbacks: {
		//
	},
} );

/**
 * Save the Context to the server via AJAX.
 *
 * @param {object} context Block Context.
 */
function saveContextToServer( context ) {
	console.log(context);
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

function formatNumber(num) {
	if ( num < 1000 ) {
	  return num.toString();
	} else if ( num < 1000000 ) {
	  return ( num / 1000 ).toFixed(1) + 'K';
	} else {
	  return ( num / 1000000 ).toFixed(1) + 'M';
	}
}

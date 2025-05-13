import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************************!*\
  !*** ./src/explicit-media-item/view.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");

const {
  state
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('buntywp/explicit-media', {
  isOpen: false,
  isMediaShared: false,
  imageSrc: '',
  Copied: false,
  state: {
    get isMediaLiked() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return context.liked;
    },
    get likeCount() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return expMediaFormatNumber(context.likeCount);
    },
    get expImageSrc() {
      return state.imageSrc;
    },
    get expIsPopupOpen() {
      return state.isOpen;
    },
    get expTwitterShareURL() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const sharelink = 'https://x.com/intent/post?url=' + encodeURIComponent(context.expShareUrl);
      return sharelink;
    },
    get expFBShareURL() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const sharelink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(context.expShareUrl);
      return sharelink;
    }
  },
  actions: {
    expToggleLike: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      context.liked = context.liked ? false : true;
      context.likeCount = context.liked ? Number(context.likeCount + 1) : Number(context.likeCount - 1);
      saveContextToServer(context);
    },
    expShowLightbox: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      state.isOpen = true;
      state.imageSrc = context.mediaUrl;
    },
    expHideLightbox: () => {
      state.isOpen = false;
      state.imageSrc = '';
    },
    expToggleShare: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      context.isShareOpen = !context.isShareOpen;
    },
    expCopyLink: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const linkToCopy = context.expShareUrl;
      navigator.clipboard.writeText(linkToCopy);
      state.Copied = true;
      setTimeout(() => {
        state.Copied = false;
      }, 2000);
    }
  },
  callbacks: {
    expSetupLightbox: () => {
      window.addEventListener('keydown', event => {
        if ('Escape' === event.key) {
          (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('buntywp/explicit-media').actions.expHideLightbox();
        }
      });
      window.addEventListener('click', function (event) {
        const isOutsideShareElements = !event.target.closest('.exp-media-share-button') && !event.target.closest('.exp-share-popup');
        if (isOutsideShareElements) {
          closeAllSharePopups();
        }
      });
    },
    expDisplayPiP: event => {
      const video = event.currentTarget?.closest('.image-container')?.querySelector('video');
      if (video && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture().catch(console.error);
        } else {
          video.requestPictureInPicture().catch(console.error);
        }
      }
    }
  }
});

/**
 * Save the Context to the server via AJAX.
 */
function saveContextToServer(context) {
  fetch(state.ajaxUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      action: 'save_media_likes',
      nonce: state.nonce,
      context: JSON.stringify(context)
    })
  }).then(response => response.json()).then(data => {
    console.log('Like saved:', data);
  }).catch(error => {
    console.error('Error saving Like:', error);
  });
}

/**
 * Format a number for display.
 */
function expMediaFormatNumber(num) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return (num / 1000000).toFixed(1) + 'M';
  }
}
function closeAllSharePopups() {
  document.querySelectorAll('.exp-share-popup').forEach(popup => {
    popup.classList.add('hide');
  });
}
})();


//# sourceMappingURL=view.js.map
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	__experimentalToolsPanel as ToolsPanel,
	SelectControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mediaUrl, mediaType, likeCount, blockId, mediaId, scale } =
		attributes;
	const blockProps = useBlockProps();

	const onSelectMedia = ( media ) => {
		if ( media.type === 'image' || media.type === 'video' ) {
			setAttributes( {
				mediaUrl: media.url,
				mediaType: media.type,
				mediaId: media.id,
			} );
		}
	};

	// Set a unique blockId if not already set.
	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( { blockId: clientId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	const { borderWidth, borderRadius, ...filteredStyle } = blockProps.style;

	const updatedBlockProps = {
		...blockProps,
		style: filteredStyle,
	};

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label="Explicit Media Block Settings"
					panelId=""
					resetAll={ () => {} }
				>
					<SelectControl
						label="Scale"
						value={ scale }
						options={ [
							{ label: 'Cover', value: 'cover' },
							{ label: 'Contain', value: 'contain' },
						] }
						onChange={ ( newMode ) =>
							setAttributes( { scale: newMode } )
						}
					/>
				</ToolsPanel>
			</InspectorControls>
			<div className="buntywp-exp-media-container">
				<div className="image-container">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ [ 'image', 'video' ] }
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="primary"
									className={ `upload-button ${
										mediaUrl ? 'hover-visible' : 'centered'
									}` }
								>
									{ mediaUrl
										? 'Replace Media'
										: 'Upload Image or Video' }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<figure { ...updatedBlockProps }>
						{ mediaUrl && mediaType === 'image' && (
							<img
								src={ mediaUrl }
								alt="Selected media"
								className="uploaded-media"
								loading="lazy"
								style={ {
									borderWidth: borderWidth,
									borderRadius: borderRadius,
									objectFit: scale,
								} }
							/>
						) }
						{ mediaUrl && mediaType === 'video' && (
							<video controls className="uploaded-media">
								<source src={ mediaUrl } type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						) }
					</figure>
				</div>
				{ mediaUrl && (
					<div className="exp-media-actions">
						<button className="exp-media-like-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="heart-icon"
							>
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							</svg>
						</button>
						<span className="exp-media-like-count">
							{ likeCount }
						</span>
					</div>
				) }
			</div>
		</>
	);
}

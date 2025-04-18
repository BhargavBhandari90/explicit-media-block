import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mediaUrl, mediaType, likeCount, blockId, scale } = attributes;
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
				<PanelBody
					title={ __( 'Explicit Media Settings', 'explicit-media' ) }
				>
					<SelectControl
						label={ __( 'Scale', 'explicit-media' ) }
						value={ scale }
						options={ [
							{
								label: __( 'Cover', 'explicit-media' ),
								value: 'cover',
							},
							{
								label: __( 'Contain', 'explicit-media' ),
								value: 'contain',
							},
						] }
						onChange={ ( newMode ) =>
							setAttributes( { scale: newMode } )
						}
					/>
				</PanelBody>
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
										? __(
												'Replace Media',
												'explicit-media'
										  )
										: __(
												'Upload Image or Video',
												'explicit-media'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					<figure { ...updatedBlockProps }>
						{ mediaUrl && mediaType === 'image' && (
							<img
								src={ mediaUrl }
								alt={ __( 'Selected Media', 'explicit-media' ) }
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
						<div className="exp-media-action-item">
							<Button className="exp-media-like-button">
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
							</Button>
							<span className="exp-media-like-count">
								{ likeCount }
							</span>
						</div>
						<div className="exp-media-action-item">
							<Button className="exp-media-share-button exp-media-button">
								<svg
									className="w-6 h-6 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.5 3a3.5 3.5 0 0 0-3.456 4.06L8.143 9.704a3.5 3.5 0 1 0-.01 4.6l5.91 2.65a3.5 3.5 0 1 0 .863-1.805l-5.94-2.662a3.53 3.53 0 0 0 .002-.961l5.948-2.667A3.5 3.5 0 1 0 17.5 3Z" />
								</svg>
							</Button>
						</div>
					</div>
				) }
			</div>
		</>
	);
}

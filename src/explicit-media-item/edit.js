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
									borderWidth,
									borderRadius,
									objectFit: scale,
								} }
							/>
						) }
						{ mediaUrl && mediaType === 'video' && (
							<>
								<video controls className="uploaded-media">
									<source src={ mediaUrl } type="video/mp4" />
									Your browser does not support the video tag.
								</video>
								<Button
									className="pip-button"
									aria-label="Toggle PiP"
								>
									<svg
										fill="none"
										height="20"
										viewBox="0 0 20 20"
										width="20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M2 5.75C2 4.23122 3.23122 3 4.75 3H15.25C16.7688 3 18 4.23122 18 5.75V10H17V5.75C17 4.7835 16.2165 4 15.25 4H4.75C3.7835 4 3 4.7835 3 5.75V12.25C3 13.2165 3.7835 14 4.75 14H9V15H4.75C3.23122 15 2 13.7688 2 12.25V5.75ZM11.5 11C10.6716 11 10 11.6716 10 12.5V16.5C10 17.3284 10.6716 18 11.5 18H17.5C18.3284 18 19 17.3284 19 16.5V12.5C19 11.6716 18.3284 11 17.5 11H11.5ZM4.64645 5.64645C4.84171 5.45118 5.15829 5.45118 5.35355 5.64645L8 8.29289V6.5C8 6.22386 8.22386 6 8.5 6C8.77614 6 9 6.22386 9 6.5V9.5C9 9.77614 8.77614 10 8.5 10H5.5C5.22386 10 5 9.77614 5 9.5C5 9.22386 5.22386 9 5.5 9H7.29289L4.64645 6.35355C4.45118 6.15829 4.45118 5.84171 4.64645 5.64645Z"
											fill="#212121"
										/>
									</svg>
								</Button>
							</>
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

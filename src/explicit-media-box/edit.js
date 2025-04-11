import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import './editor.scss';

export default function Edit( { clientId } ) {
	const { insertBlocks } = useDispatch( 'core/block-editor' );

	const addExpMedia = () => {
		const newCards = Array.from( { length: 3 }, () =>
			wp.blocks.createBlock( 'buntywp/explicit-media-item' )
		);

		insertBlocks( newCards, undefined, clientId );
	};

	const EXP_TEMPLATE = [ [ 'buntywp/explicit-media-item' ] ];

	const innerBlocksProps = useInnerBlocksProps( {
		template: EXP_TEMPLATE,
	} );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="plus" // WordPress Plus Icon
						label={ __( 'Add Media', 'experience-block' ) }
						onClick={ addExpMedia }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...useBlockProps() }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}

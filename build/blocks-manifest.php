<?php
// This file is generated. Do not modify it manually.
return array(
	'explicit-media-box' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'buntywp/explicit-media-box',
		'version' => '1.0.0',
		'title' => 'Explicit Media Box',
		'category' => 'widgets',
		'icon' => 'excerpt-view',
		'description' => 'Explicit Media Box.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'heading' => true
			),
			'shadow' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true
				)
			)
		),
		'attributes' => array(
			
		),
		'allowedBlocks' => array(
			'buntywp/explicit-media-item',
			'core/heading'
		),
		'textdomain' => 'thread-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'explicit-media-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'buntywp/explicit-media-item',
		'version' => '1.0.0',
		'title' => 'Explicit Media',
		'category' => 'media',
		'icon' => 'format-image',
		'description' => 'Explicit Media Item.',
		'example' => array(
			
		),
		'supports' => array(
			'interactivity' => true,
			'html' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'heading' => true
			),
			'shadow' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true
				)
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'minHeight' => false
			),
			'filter' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'mediaId' => array(
				'type' => 'number'
			),
			'mediaUrl' => array(
				'type' => 'string'
			),
			'mediaType' => array(
				'type' => 'string',
				'default' => 'image'
			),
			'liked' => array(
				'type' => 'boolean',
				'default' => false
			),
			'likeCount' => array(
				'type' => 'number',
				'default' => 0
			),
			'blockId' => array(
				'type' => 'string'
			),
			'style' => array(
				'type' => 'string'
			)
		),
		'selectors' => array(
			'filter' => array(
				'duotone' => '.wp-block-buntywp-explicit-media-item img'
			)
		),
		'textdomain' => 'explicit-media',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	)
);

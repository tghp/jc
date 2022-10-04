wp.domReady(() => {

    wp.blocks.registerBlockStyle('core/paragraph', [
        {
            name: 'default',
            label: 'Default Paragraph',
            isDefault: true,
        },
        {
            name: 'large-text',
            label: 'Large text',
        },
        {
            name: 'small-text',
            label: 'Small text',
        },
        {
            name: 'indent-once',
            label: 'Indent',
        },
        {
            name: 'indent-twice',
            label: 'Double indent',
        },
    ]);

    wp.blocks.unregisterBlockType('core/media-text');
    wp.blocks.unregisterBlockType('core/search');
    wp.blocks.unregisterBlockType('core/verse');
    wp.blocks.unregisterBlockType('core/gallery');
    wp.blocks.unregisterBlockType('core/video');
    wp.blocks.unregisterBlockType('core/cover');
    wp.blocks.unregisterBlockType('core/file');
    wp.blocks.unregisterBlockType('core/buttons');
    wp.blocks.unregisterBlockType('core/more');
    wp.blocks.unregisterBlockType('core/spacer');
    wp.blocks.unregisterBlockType('core/site-logo');
    wp.blocks.unregisterBlockType('core/site-title');
    wp.blocks.unregisterBlockType('core/site-tagline');
    wp.blocks.unregisterBlockType('core/query-title');
    wp.blocks.unregisterBlockType('core/post-title');
    wp.blocks.unregisterBlockType('core/post-excerpt');
    wp.blocks.unregisterBlockType('core/post-date');
    wp.blocks.unregisterBlockType('core/post-terms');
    wp.blocks.unregisterBlockType('core/post-content');
    wp.blocks.unregisterBlockType('core/post-featured-image');
    wp.blocks.unregisterBlockType('core/loginout');
    wp.blocks.unregisterBlockType('core/code');
    wp.blocks.unregisterBlockType('core/page-list');
    wp.blocks.unregisterBlockType('core/preformatted');
    wp.blocks.unregisterBlockType('core/archives');
    wp.blocks.unregisterBlockType('core/calendar');
    wp.blocks.unregisterBlockType('core/categories');
    wp.blocks.unregisterBlockType('core/latest-comments');
    wp.blocks.unregisterBlockType('core/latest-posts');
    wp.blocks.unregisterBlockType('core/rss');
    wp.blocks.unregisterBlockType('core/social-links');
    wp.blocks.unregisterBlockType('core/tag-cloud');
    wp.blocks.unregisterBlockType('core/nextpage');
    wp.blocks.unregisterBlockType('core/pullquote');
    wp.blocks.unregisterBlockType('core/query');
    wp.blocks.unregisterBlockType('core/html');
    wp.blocks.unregisterBlockType('core/navigation');
    wp.blocks.unregisterBlockType('core/post-author');
    wp.blocks.unregisterBlockType('core/post-navigation-link');
    wp.blocks.unregisterBlockType('core/post-comments');
    wp.blocks.unregisterBlockType('core/term-description');
    wp.blocks.unregisterBlockType('core/group');
    wp.blocks.unregisterBlockType('core/columns');
    // wp.blocks.unregisterBlockType('core/audio');
    // wp.blocks.unregisterBlockType('core/embed');
    // wp.blocks.unregisterBlockType('core/table');
    // wp.blocks.unregisterBlockType('core/quote');
    // wp.blocks.unregisterBlockType('core/freeform');
    // wp.blocks.unregisterBlockType('core/shortcode');
    // wp.blocks.unregisterBlockType('core/separator');
    // wp.blocks.unregisterBlockType('core/image');

    const allowedEmbedBlocks = [
        'youtube',
        'vimeo',
    ];

    wp.blocks.getBlockVariations('core/embed').forEach(function (blockVariation) {
        if (allowedEmbedBlocks.indexOf(blockVariation.name) === -1) {
            wp.blocks.unregisterBlockVariation('core/embed', blockVariation.name);
        }
    });
});
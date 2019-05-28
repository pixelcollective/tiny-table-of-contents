<?php

/**
 * Plugin Name: Table of Contents
 * Description: Adds a table of contents block to the Block Editor
 */

namespace TinyPixel\Blocks;

add_action('enqueue_block_editor_assets', function () {
    $plugin_deps = [
        'wp-editor',
        'wp-element',
        'wp-plugins',
        'wp-dom-ready',
        'wp-edit-post'
    ];

    wp_enqueue_script('tinyblocks/table-of-contents', plugin_dir_url(__FILE__) .'/dist/tiny-toc.js', $plugin_deps, '', null, true);
});

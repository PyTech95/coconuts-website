<?php
/**
 * Blog: normal WordPress posts (Posts → Add New). The React blog reads them through the REST API.
 */

if (!defined('ABSPATH')) { exit; }

function mc_read_time($post) {
    $saved = get_post_meta($post->ID, 'mc_read_time', true);
    if ($saved) { return $saved; }
    $words = str_word_count(wp_strip_all_tags($post->post_content));
    return max(1, (int) ceil($words / 200)) . ' min read';
}

function mc_post_image($post, $size = 'large') {
    if (has_post_thumbnail($post)) {
        $url = get_the_post_thumbnail_url($post, $size);
        if ($url) { return $url; }
    }
    $meta = get_post_meta($post->ID, 'mc_image', true);
    if ($meta) { return $meta; }
    if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $post->post_content, $m)) { return $m[1]; }
    return '/images/brand/hero-1.jpg';
}

function mc_post_excerpt($post) {
    if (has_excerpt($post)) { return wp_strip_all_tags(get_the_excerpt($post)); }
    return wp_trim_words(wp_strip_all_tags(strip_shortcodes($post->post_content)), 30, '…');
}

function mc_map_post($post, $with_body = false) {
    $tags = wp_get_post_tags($post->ID, array('fields' => 'names'));
    $out = array(
        'id'        => $post->ID,
        'slug'      => $post->post_name ? $post->post_name : (string) $post->ID,
        'title'     => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
        'excerpt'   => html_entity_decode(mc_post_excerpt($post), ENT_QUOTES, 'UTF-8'),
        'image'     => mc_post_image($post),
        'date'      => get_the_date('Y-m-d', $post),
        'readTime'  => mc_read_time($post),
        'keywords'  => is_array($tags) ? $tags : array(),
        'published' => $post->post_status === 'publish',
        'status'    => $post->post_status,
    );
    if ($with_body) {
        $GLOBALS['post'] = $post;
        setup_postdata($post);
        $out['html'] = apply_filters('the_content', $post->post_content);
        wp_reset_postdata();
    }
    return $out;
}

/** Gutenberg-friendly HTML from the old "blocks" format (used for the sample posts). */
function mc_blocks_to_html($blocks) {
    $html = '';
    foreach ((array) $blocks as $b) {
        $type = isset($b['type']) ? $b['type'] : 'p';
        if ($type === 'h') {
            $html .= "<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">" . esc_html($b['text']) . "</h2>\n<!-- /wp:heading -->\n\n";
        } elseif ($type === 'ul') {
            $html .= "<!-- wp:list -->\n<ul class=\"wp-block-list\">";
            foreach ((array) $b['items'] as $item) {
                $html .= "<!-- wp:list-item -->\n<li>" . esc_html($item) . "</li>\n<!-- /wp:list-item -->";
            }
            $html .= "</ul>\n<!-- /wp:list -->\n\n";
        } else {
            $html .= "<!-- wp:paragraph -->\n<p>" . esc_html(isset($b['text']) ? $b['text'] : '') . "</p>\n<!-- /wp:paragraph -->\n\n";
        }
    }
    return $html;
}

/** Adds the 10 ready-made articles once, so the blog is not empty on a new site. */
function mc_seed_blog_posts() {
    if (get_option('mc_blog_seeded')) { return; }
    $file = MC_THEME_DIR . '/data/seed_blogs.json';
    if (!file_exists($file)) { return; }
    $posts = json_decode(file_get_contents($file), true);
    if (!is_array($posts)) { return; }
    update_option('mc_blog_seeded', 1, false);
    foreach ($posts as $p) {
        if (get_page_by_path($p['slug'], OBJECT, 'post')) { continue; }
        $id = wp_insert_post(array(
            'post_type'    => 'post',
            'post_status'  => 'publish',
            'post_title'   => wp_strip_all_tags($p['title']),
            'post_name'    => sanitize_title($p['slug']),
            'post_excerpt' => isset($p['excerpt']) ? $p['excerpt'] : '',
            'post_content' => mc_blocks_to_html(isset($p['content']) ? $p['content'] : array()),
            'post_date'    => (isset($p['date']) ? $p['date'] : gmdate('Y-m-d')) . ' 10:00:00',
            'tags_input'   => isset($p['keywords']) ? $p['keywords'] : array(),
        ), true);
        if (is_wp_error($id)) { continue; }
        if (!empty($p['image'])) { update_post_meta($id, 'mc_image', $p['image']); }
        if (!empty($p['readTime'])) { update_post_meta($id, 'mc_read_time', $p['readTime']); }
    }
    // Remove WordPress' untouched "Hello world!" sample post so it does not show on the blog.
    $hello = get_page_by_path('hello-world', OBJECT, 'post');
    if ($hello && $hello->post_title === 'Hello world!' && $hello->post_modified === $hello->post_date) {
        wp_trash_post($hello->ID);
    }
}
add_action('init', function () { if (!get_option('mc_blog_seeded') && get_option('template') === get_template()) { mc_seed_blog_posts(); } }, 20);

// "Read time" and "picture" boxes on the post editor (optional — filled automatically otherwise).
add_action('init', function () {
    register_post_meta('post', 'mc_read_time', array('type' => 'string', 'single' => true, 'show_in_rest' => true,
        'auth_callback' => function () { return current_user_can('edit_posts'); }));
    register_post_meta('post', 'mc_image', array('type' => 'string', 'single' => true, 'show_in_rest' => true,
        'auth_callback' => function () { return current_user_can('edit_posts'); }));
});

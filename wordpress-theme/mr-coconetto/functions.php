<?php
/**
 * Mr. Coconetto theme bootstrap.
 *
 * The public website is a React app (in /build). Everything it shows — words, pictures,
 * colours, lists, blog posts — is stored in WordPress and edited from the WordPress login:
 *   - Live editor: open the website while logged in and press "Edit this website".
 *   - Admin panel: wp-admin → Mr. Coconetto (or /admin on the website).
 */

if (!defined('ABSPATH')) { exit; }

define('MC_VERSION', wp_get_theme(get_template())->get('Version') ?: '2.0.0');
define('MC_THEME_DIR', get_template_directory());
define('MC_BUILD_DIR', MC_THEME_DIR . '/build');
define('MC_BUILD_URL', get_template_directory_uri() . '/build');

require_once MC_THEME_DIR . '/inc/content.php';
require_once MC_THEME_DIR . '/inc/blog.php';
require_once MC_THEME_DIR . '/inc/inbox.php';
require_once MC_THEME_DIR . '/inc/rest.php';
require_once MC_THEME_DIR . '/inc/admin.php';
require_once MC_THEME_DIR . '/inc/updater.php';

/** Capability needed to edit the website (Administrators and Editors). */
function mc_cap() {
    return apply_filters('mc_edit_capability', 'edit_others_pages');
}

function mc_can_edit() {
    return is_user_logged_in() && current_user_can(mc_cap());
}

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    // The website has its own floating editor, so the black WordPress bar is hidden on the site.
    show_admin_bar(false);
});

// First activation: pretty links (/blog, /customize, /admin need them) + sample blog posts.
add_action('after_switch_theme', function () {
    if (!get_option('permalink_structure')) {
        update_option('permalink_structure', '/%postname%/');
    }
    mc_seed_blog_posts();
    flush_rewrite_rules();
});

// Read the CRA asset manifest to find the hashed JS/CSS bundles.
function mc_entrypoints() {
    $manifest = MC_BUILD_DIR . '/asset-manifest.json';
    if (!file_exists($manifest)) { return array(); }
    $data = json_decode(file_get_contents($manifest), true);
    return isset($data['entrypoints']) ? $data['entrypoints'] : array();
}

add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
    foreach (mc_entrypoints() as $i => $file) {
        $url = MC_BUILD_URL . '/' . $file;
        if (substr($file, -4) === '.css') {
            wp_enqueue_style('mc-app-' . $i, $url, array(), null);
        } elseif (substr($file, -3) === '.js') {
            wp_enqueue_script('mc-app-' . $i, $url, array(), null, true);
        }
    }
}, 100);

// No emoji script / oEmbed noise on the React page. WordPress' own canonical, shortlink and
// prev/next tags describe WordPress URLs, not the app's pages (/cities/delhi, /blog/…), so they go too.
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('template_redirect', 'wp_shortlink_header', 11);

/** Everything the React app needs at start-up, printed into the page (no extra request). */
function mc_frontend_config() {
    $user = wp_get_current_user();
    $can  = mc_can_edit();
    $cfg  = array(
        'api'     => untrailingslashit(rest_url('mc/v1')),
        'home'    => untrailingslashit(home_url('/')),
        'content' => mc_get_content(),
        'canEdit' => $can,
        'version' => MC_VERSION,
    );
    if ($can) {
        $cfg['nonce']      = wp_create_nonce('wp_rest');
        $cfg['user']       = array('name' => $user->display_name, 'email' => $user->user_email);
        $cfg['wpAdmin']    = admin_url('admin.php?page=mc-home');
        $cfg['dashboard']  = admin_url();
        $cfg['newPostUrl'] = admin_url('post-new.php');
        $cfg['ordersUrl']  = admin_url('edit.php?post_type=mc_order');
        $cfg['enquiriesUrl'] = admin_url('edit.php?post_type=mc_enquiry');
        $cfg['logoutUrl']  = wp_logout_url(home_url('/'));
        $cfg['canUpload']  = current_user_can('upload_files');
    }
    $cfg['loginUrl'] = wp_login_url(home_url('/admin'));
    return $cfg;
}

add_action('wp_head', function () {
    $json = wp_json_encode(mc_frontend_config(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    echo "<script>window.MC_CONFIG={$json};</script>\n";
}, 1);

// Pages shown to a logged-in editor must never be cached (they carry the editor key).
add_action('send_headers', function () {
    if (!is_admin() && mc_can_edit()) { nocache_headers(); }
});

// The app has its own /admin panel; stop WordPress redirecting /admin to /wp-admin.
remove_action('template_redirect', 'wp_redirect_admin_locations', 1000);

// Blog posts live at /blog/<slug> in the app.
add_action('template_redirect', function () {
    if (is_singular('post') && !is_preview()) {
        $post = get_queried_object();
        if ($post && $post->post_status === 'publish') {
            wp_safe_redirect(home_url('/blog/' . $post->post_name), 301);
            exit;
        }
    }
});

// Let the React router handle unknown URLs instead of a WordPress 404.
add_filter('pre_handle_404', function ($handled) {
    return is_admin() ? $handled : true;
});
// The app's own URLs (/cities/delhi …) are not WordPress URLs, so WordPress must not "correct" them.
remove_action('template_redirect', 'redirect_canonical');

// Serve the app's root-relative media (/images/..., /videos/...) from the theme build.
add_action('init', function () {
    if (empty($_SERVER['REQUEST_URI'])) { return; }
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $home = parse_url(home_url('/'), PHP_URL_PATH);
    if ($home && $home !== '/' && strpos($path, $home) === 0) { $path = '/' . substr($path, strlen($home)); }
    if (!preg_match('#^/(images|videos)/[A-Za-z0-9_\-./]+$#', $path) || strpos($path, '..') !== false) { return; }
    $file = MC_BUILD_DIR . $path;
    if (!is_file($file)) { return; }
    $types = array('jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif', 'svg' => 'image/svg+xml', 'mp4' => 'video/mp4', 'webm' => 'video/webm');
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    header('Content-Type: ' . (isset($types[$ext]) ? $types[$ext] : 'application/octet-stream'));
    header('Content-Length: ' . filesize($file));
    header('Cache-Control: public, max-age=2592000');
    readfile($file);
    exit;
}, 1);

add_filter('document_title_parts', function ($parts) {
    $parts['title'] = 'Mr. Coconetto | Personalized Coconuts for Weddings, Events & Celebrations';
    unset($parts['site'], $parts['tagline']);
    return $parts;
});

// Tell WordPress' own "View post" buttons where the post really lives.
add_filter('post_link', function ($url, $post) {
    if ($post->post_type === 'post' && $post->post_status === 'publish' && $post->post_name) {
        return home_url('/blog/' . $post->post_name);
    }
    return $url;
}, 10, 2);

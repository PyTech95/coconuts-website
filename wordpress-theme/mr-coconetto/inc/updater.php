<?php
/**
 * Updates from GitHub: every push to `main` builds a new theme zip as a GitHub Release
 * (see .github/workflows/wordpress-theme.yml). WordPress then shows "Update available"
 * under Dashboard → Updates / Appearance → Themes, and installs it with one click.
 */

if (!defined('ABSPATH')) { exit; }

function mc_github_repo() {
    return apply_filters('mc_github_repo', 'PyTech95/coconuts-website');
}

function mc_github_latest_release($force = false) {
    $cached = get_site_transient('mc_github_release');
    if (!$force && is_array($cached)) { return $cached; }
    $res = wp_remote_get('https://api.github.com/repos/' . mc_github_repo() . '/releases/latest', array(
        'timeout' => 10,
        'headers' => array('Accept' => 'application/vnd.github+json', 'User-Agent' => 'mr-coconetto-theme'),
    ));
    $info = array();
    if (!is_wp_error($res) && wp_remote_retrieve_response_code($res) === 200) {
        $body = json_decode(wp_remote_retrieve_body($res), true);
        foreach ((array) ($body['assets'] ?? array()) as $asset) {
            if (($asset['name'] ?? '') === 'mr-coconetto-wordpress-theme.zip') {
                $info = array(
                    'version' => ltrim((string) $body['tag_name'], 'vV'),
                    'package' => $asset['browser_download_url'],
                    'url'     => $body['html_url'],
                );
            }
        }
    }
    set_site_transient('mc_github_release', $info, 6 * HOUR_IN_SECONDS);
    return $info;
}

add_filter('pre_set_site_transient_update_themes', function ($transient) {
    if (!is_object($transient)) { return $transient; }
    $slug = get_template();
    if ($slug !== 'mr-coconetto') { return $transient; }
    $release = mc_github_latest_release();
    if (!empty($release['version']) && version_compare($release['version'], MC_VERSION, '>')) {
        $transient->response[$slug] = array(
            'theme'       => $slug,
            'new_version' => $release['version'],
            'url'         => $release['url'],
            'package'     => $release['package'],
        );
    }
    return $transient;
});

// "Check again" on Dashboard → Updates also re-checks GitHub.
add_action('load-update-core.php', function () {
    if (isset($_GET['force-check'])) { delete_site_transient('mc_github_release'); }
});

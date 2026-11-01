<?php
/**
 * Website content storage: everything changed in the editors lives in one WordPress option.
 *
 *   texts  — "original words" => "new words"   (anything clicked in the live editor)
 *   images — "original picture" => "new picture"
 *   links  — "original link" => "new link"     (where a button goes)
 *   theme  — brand colours
 *   data   — whole sections (lists like FAQ, services, slides …) changed in the section editor
 *
 * Every save keeps the previous version (last 30) so changes can be undone from the admin.
 */

if (!defined('ABSPATH')) { exit; }

const MC_CONTENT_OPTION = 'mc_site_content';
const MC_HISTORY_OPTION = 'mc_site_content_history';
const MC_HISTORY_MAX    = 30;

/** Sections of the website that can be edited as a whole (names match the React data file). */
function mc_section_names() {
    return array(
        'BRAND', 'SOCIAL', 'NAV_LINKS', 'HERO', 'HERO_SLIDES', 'MARQUEE_ITEMS', 'HERO_FEATURES',
        'CUSTOMIZER', 'ABOUT', 'ABOUT_STATS', 'FOUNDER', 'EVENT_TYPES', 'STATS', 'SERVICES', 'PLANS',
        'CITIES', 'OCCASIONS', 'WHY_CHOOSE', 'TESTIMONIALS', 'FAQS', 'CONTACT', 'PRODUCTS', 'INSTAGRAM_FEED', 'CITY_PAGE',
    );
}

function mc_empty_content() {
    return array('texts' => array(), 'images' => array(), 'links' => array(), 'theme' => array(), 'data' => array());
}

function mc_get_content() {
    $stored = get_option(MC_CONTENT_OPTION, array());
    $out = mc_empty_content();
    if (is_array($stored)) {
        foreach ($out as $k => $_) {
            if (isset($stored[$k]) && is_array($stored[$k])) { $out[$k] = $stored[$k]; }
        }
    }
    // JSON objects must stay objects even when empty.
    foreach ($out as $k => $v) { $out[$k] = (object) $v; }
    return $out;
}

function mc_clean_string($s, $max = 20000) {
    $s = wp_check_invalid_utf8((string) $s);
    $s = str_replace("\0", '', $s);
    return function_exists('mb_substr') ? mb_substr($s, 0, $max) : substr($s, 0, $max);
}

function mc_is_dangerous_url($s) {
    return (bool) preg_match('#^\s*(javascript|vbscript|data:text/html)\s*:?#i', html_entity_decode((string) $s));
}

function mc_clean_url($s) {
    $s = trim(mc_clean_string($s, 2000));
    if ($s === '' || mc_is_dangerous_url($s)) { return ''; }
    if ($s[0] === '/' || $s[0] === '#' || $s[0] === '?') { return $s; }
    return esc_url_raw($s, array('http', 'https', 'mailto', 'tel', 'sms', 'whatsapp'));
}

function mc_clean_map($map, $value_cb) {
    $out = array();
    if (!is_array($map)) { return $out; }
    foreach ($map as $k => $v) {
        if (!is_string($k) && !is_int($k)) { continue; }
        if (!is_string($v) || count($out) >= 3000) { continue; }
        $key = mc_clean_string($k, 4000);
        $val = call_user_func($value_cb, $v);
        if ($key !== '' && $val !== '') { $out[$key] = $val; }
    }
    return $out;
}

function mc_clean_data_value($v, $depth = 0) {
    if ($depth > 8) { return null; }
    if (is_string($v)) { return mc_is_dangerous_url($v) ? '' : mc_clean_string($v); }
    if (is_bool($v) || is_int($v) || is_float($v) || $v === null) { return $v; }
    if (is_array($v)) {
        $out = array();
        $i = 0;
        foreach ($v as $k => $item) {
            if (++$i > 1000) { break; }
            $out[is_int($k) ? $k : mc_clean_string($k, 200)] = mc_clean_data_value($item, $depth + 1);
        }
        return $out;
    }
    return null;
}

function mc_sanitize_content($in) {
    $c = mc_empty_content();
    if (!is_array($in)) { return $c; }
    $c['texts']  = mc_clean_map(isset($in['texts']) ? $in['texts'] : array(), function ($v) { return mc_clean_string($v, 20000); });
    $c['images'] = mc_clean_map(isset($in['images']) ? $in['images'] : array(), 'mc_clean_url');
    $c['links']  = mc_clean_map(isset($in['links']) ? $in['links'] : array(), 'mc_clean_url');
    $c['theme']  = mc_clean_map(isset($in['theme']) ? $in['theme'] : array(), function ($v) { return (string) sanitize_hex_color($v); });
    if (isset($in['data']) && is_array($in['data'])) {
        foreach (mc_section_names() as $name) {
            if (array_key_exists($name, $in['data'])) { $c['data'][$name] = mc_clean_data_value($in['data'][$name]); }
        }
    }
    return $c;
}

/** Save new content; the version it replaces goes into the history. */
function mc_save_content($content, $note = '') {
    $content = mc_sanitize_content($content);
    $size = strlen(wp_json_encode($content));
    if ($size > 3 * 1024 * 1024) {
        return new WP_Error('mc_too_big', 'The website content is too big to save.', array('status' => 413));
    }
    $previous = get_option(MC_CONTENT_OPTION, null);
    // The very first save keeps the untouched website, so it is always possible to go back to it.
    mc_push_history(is_array($previous) ? $previous : mc_empty_content(), is_array($previous) ? $note : 'Original website');
    update_option(MC_CONTENT_OPTION, $content, true);
    return mc_get_content();
}

function mc_push_history($content, $note = '') {
    $history = get_option(MC_HISTORY_OPTION, array());
    if (!is_array($history)) { $history = array(); }
    $user = wp_get_current_user();
    array_unshift($history, array(
        'id'      => wp_generate_password(10, false, false),
        'time'    => gmdate('c'),
        'user'    => $user && $user->exists() ? $user->display_name : '',
        'note'    => $note,
        'content' => $content,
    ));
    update_option(MC_HISTORY_OPTION, array_slice($history, 0, MC_HISTORY_MAX), false);
}

function mc_count_changes($c) {
    $n = 0;
    foreach (array('texts', 'images', 'links', 'theme', 'data') as $k) {
        if (isset($c[$k]) && is_array($c[$k])) { $n += count($c[$k]); }
    }
    return $n;
}

function mc_history_list() {
    $history = get_option(MC_HISTORY_OPTION, array());
    $out = array();
    foreach ((array) $history as $h) {
        $out[] = array(
            'id' => $h['id'], 'time' => $h['time'], 'user' => $h['user'], 'note' => isset($h['note']) ? $h['note'] : '',
            'changes' => mc_count_changes($h['content']),
        );
    }
    return $out;
}

function mc_restore_history($id) {
    $history = get_option(MC_HISTORY_OPTION, array());
    foreach ((array) $history as $h) {
        if ($h['id'] === $id) {
            return mc_save_content($h['content'], 'Before going back to ' . $h['time']);
        }
    }
    return new WP_Error('mc_not_found', 'That saved version was not found.', array('status' => 404));
}

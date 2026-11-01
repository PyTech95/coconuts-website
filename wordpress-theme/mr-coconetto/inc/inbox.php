<?php
/**
 * Orders (from "Customize Your Coconut") and Enquiries (from the contact form).
 * Stored as private WordPress post types, listed under wp-admin → Mr. Coconetto.
 */

if (!defined('ABSPATH')) { exit; }

add_action('init', function () {
    $common = array(
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => 'mc-home',
        'show_in_rest'        => false,
        'exclude_from_search' => true,
        'supports'            => array('title'),
        'capability_type'     => 'post',
        'capabilities'        => array('create_posts' => 'do_not_allow'),
        'map_meta_cap'        => true,
    );
    register_post_type('mc_order', $common + array(
        'labels' => array('name' => 'Orders', 'singular_name' => 'Order', 'menu_name' => 'Orders', 'all_items' => '📦 Orders',
            'edit_item' => 'Order', 'search_items' => 'Search orders', 'not_found' => 'No orders yet.', 'not_found_in_trash' => 'No orders in the bin.'),
    ));
    register_post_type('mc_enquiry', $common + array(
        'labels' => array('name' => 'Enquiries', 'singular_name' => 'Enquiry', 'menu_name' => 'Enquiries', 'all_items' => '💬 Enquiries',
            'edit_item' => 'Enquiry', 'search_items' => 'Search enquiries', 'not_found' => 'No enquiries yet.', 'not_found_in_trash' => 'No enquiries in the bin.'),
    ));
});

function mc_order_fields() {
    return array('order_number' => 'Order No', 'print_text' => 'Print on coconut', 'event_name' => 'Event', 'mobile' => 'Mobile', 'logo_url' => 'Logo');
}
function mc_enquiry_fields() {
    return array('name' => 'Name', 'whatsapp' => 'WhatsApp', 'eventType' => 'Event', 'eventDate' => 'Event date', 'location' => 'Location', 'quantity' => 'Quantity', 'customization' => 'Notes');
}

function mc_inbox_row($post, $fields) {
    $row = array('id' => $post->ID, 'created_at' => get_post_time('c', true, $post));
    foreach ($fields as $k => $_) { $row[$k] = (string) get_post_meta($post->ID, 'mc_' . $k, true); }
    return $row;
}

function mc_inbox_list($type) {
    $fields = $type === 'mc_order' ? mc_order_fields() : mc_enquiry_fields();
    $posts = get_posts(array('post_type' => $type, 'post_status' => 'private', 'numberposts' => 500, 'orderby' => 'date', 'order' => 'DESC'));
    return array_map(function ($p) use ($fields) { return mc_inbox_row($p, $fields); }, $posts);
}

function mc_inbox_create($type, $title, $values) {
    $id = wp_insert_post(array('post_type' => $type, 'post_status' => 'private', 'post_title' => $title), true);
    if (is_wp_error($id)) { return $id; }
    foreach ($values as $k => $v) { update_post_meta($id, 'mc_' . $k, $v); }
    return $id;
}

// ---- Simple per-visitor limit for the public forms ----
function mc_rate_limited($bucket, $max = 15, $window = 600) {
    $ip  = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $key = 'mc_rl_' . md5($bucket . '|' . $ip);
    $n   = (int) get_transient($key);
    if ($n >= $max) { return true; }
    set_transient($key, $n + 1, $window);
    return false;
}

// ---- Email alerts ----
function mc_alert_recipients() {
    $raw = get_option('mc_alert_emails', '');
    if ($raw === '') { $raw = get_option('admin_email'); }
    return array_values(array_filter(array_map('trim', explode(',', $raw)), 'is_email'));
}

function mc_send_alert($subject, $rows) {
    $to = mc_alert_recipients();
    if (!$to) { return; }
    $tr = '';
    foreach ($rows as $label => $value) {
        $tr .= '<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">' . esc_html($label) . '</td>'
             . '<td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600;">' . $value . '</td></tr>';
    }
    $html = '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;">'
          . '<div style="background:linear-gradient(90deg,#16a34a,#db2777);color:#fff;padding:18px 22px;border-radius:12px 12px 0 0;">'
          . '<h2 style="margin:0;font-size:18px;">🥥 ' . esc_html($subject) . '</h2></div>'
          . '<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:0;">' . $tr . '</table>'
          . '<p style="color:#9ca3af;font-size:12px;margin-top:12px;">Mr. Coconetto website — <a href="' . esc_url(admin_url('admin.php?page=mc-home')) . '">open admin</a></p></div>';
    wp_mail($to, $subject, $html, array('Content-Type: text/html; charset=UTF-8'));
}

// ---- Customer logo upload (Customize Your Coconut) ----
function mc_handle_logo_upload($file) {
    if (empty($file) || !isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return new WP_Error('mc_no_file', 'Please choose an image.', array('status' => 400));
    }
    if ($file['size'] > 5 * 1024 * 1024) {
        return new WP_Error('mc_too_big', 'Image is too large (max 5 MB).', array('status' => 400));
    }
    $mimes = array('jpg|jpeg|jpe' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp');
    $check = wp_check_filetype_and_ext($file['tmp_name'], $file['name'], $mimes);
    if (empty($check['type']) || !@getimagesize($file['tmp_name'])) {
        return new WP_Error('mc_bad_type', 'Only PNG, JPG, GIF or WEBP images are allowed.', array('status' => 400));
    }
    require_once ABSPATH . 'wp-admin/includes/file.php';
    $dir_filter = function ($dirs) {
        $sub = '/mc-logos' . $dirs['subdir'];
        $dirs['path'] = $dirs['basedir'] . $sub;
        $dirs['url']  = $dirs['baseurl'] . $sub;
        $dirs['subdir'] = $sub;
        return $dirs;
    };
    $file['name'] = wp_generate_uuid4() . '.' . $check['ext'];
    add_filter('upload_dir', $dir_filter);
    $res = wp_handle_upload($file, array('test_form' => false, 'mimes' => $mimes));
    remove_filter('upload_dir', $dir_filter);
    if (isset($res['error'])) {
        return new WP_Error('mc_upload_failed', 'Could not store the image. Please try again.', array('status' => 500));
    }
    $uploads = wp_get_upload_dir();
    return array('url' => $res['url'], 'path' => ltrim(str_replace($uploads['basedir'], '', $res['file']), '/'));
}

// ---- wp-admin list screens ----
add_filter('manage_mc_order_posts_columns', function () {
    return array('cb' => '<input type="checkbox" />', 'mc_logo' => 'Logo', 'title' => 'Order', 'mc_print' => 'Print on coconut', 'mc_event' => 'Event', 'mc_mobile' => 'Mobile', 'date' => 'Received');
});
add_action('manage_mc_order_posts_custom_column', function ($col, $id) {
    $m = function ($k) use ($id) { return get_post_meta($id, 'mc_' . $k, true); };
    if ($col === 'mc_logo') {
        $u = $m('logo_url');
        echo $u ? '<a href="' . esc_url($u) . '" target="_blank"><img src="' . esc_url($u) . '" style="width:48px;height:48px;object-fit:contain;border-radius:8px;background:#f6f7f7" /></a>' : '—';
    }
    if ($col === 'mc_print') { echo nl2br(esc_html($m('print_text') ?: '—')); }
    if ($col === 'mc_event') { echo esc_html($m('event_name')); }
    if ($col === 'mc_mobile') { $p = $m('mobile'); echo '<a href="tel:' . esc_attr($p) . '">' . esc_html($p) . '</a>'; }
}, 10, 2);

add_filter('manage_mc_enquiry_posts_columns', function () {
    return array('cb' => '<input type="checkbox" />', 'title' => 'Name', 'mc_whatsapp' => 'WhatsApp', 'mc_event' => 'Event', 'mc_location' => 'Location', 'mc_qty' => 'Quantity', 'mc_notes' => 'Notes', 'date' => 'Received');
});
add_action('manage_mc_enquiry_posts_custom_column', function ($col, $id) {
    $m = function ($k) use ($id) { return get_post_meta($id, 'mc_' . $k, true); };
    if ($col === 'mc_whatsapp') { $p = $m('whatsapp'); echo '<a href="https://wa.me/' . esc_attr(preg_replace('/\D/', '', $p)) . '" target="_blank">' . esc_html($p) . '</a>'; }
    if ($col === 'mc_event') { echo esc_html(trim($m('eventType') . ($m('eventDate') ? ' · ' . $m('eventDate') : ''), ' ·')) ?: '—'; }
    if ($col === 'mc_location') { echo esc_html($m('location') ?: '—'); }
    if ($col === 'mc_qty') { echo esc_html($m('quantity') ?: '—'); }
    if ($col === 'mc_notes') { echo esc_html(wp_trim_words($m('customization'), 20) ?: '—'); }
}, 10, 2);

// Details box when an order / enquiry is opened.
add_action('add_meta_boxes', function () {
    foreach (array('mc_order' => 'mc_order_fields', 'mc_enquiry' => 'mc_enquiry_fields') as $type => $fields_fn) {
        add_meta_box('mc_details', 'Details', function ($post) use ($fields_fn) {
            echo '<table class="widefat striped" style="border:0">';
            foreach (call_user_func($fields_fn) as $k => $label) {
                $v = (string) get_post_meta($post->ID, 'mc_' . $k, true);
                if ($k === 'logo_url' && $v) {
                    $v = '<a href="' . esc_url($v) . '" target="_blank"><img src="' . esc_url($v) . '" style="max-width:220px;max-height:220px" /></a>';
                } else {
                    $v = $v === '' ? '—' : nl2br(esc_html($v));
                }
                echo '<tr><th style="width:160px">' . esc_html($label) . '</th><td>' . $v . '</td></tr>';
            }
            echo '<tr><th>Received</th><td>' . esc_html(get_the_date('j M Y, g:i a', $post)) . '</td></tr></table>';
        }, $type, 'normal', 'high');
    }
});

<?php
/**
 * REST API used by the React website:  /wp-json/mc/v1/...
 * Public: content, blog, orders, enquiries, logo upload.
 * Editors only (WordPress login + nonce): saving content, uploads, media library, inbox, history.
 */

if (!defined('ABSPATH')) { exit; }

function mc_rest_editor() { return mc_can_edit(); }

function mc_body($req) {
    $json = $req->get_json_params();
    return is_array($json) ? $json : $req->get_body_params();
}

add_action('rest_api_init', function () {
    $ns = 'mc/v1';
    $public = '__return_true';
    $editor = 'mc_rest_editor';

    // ---------- Website content ----------
    register_rest_route($ns, '/content', array(
        array('methods' => 'GET', 'permission_callback' => $public, 'callback' => function () { return mc_get_content(); }),
    ));
    register_rest_route($ns, '/admin/content', array(
        array('methods' => 'PUT, POST', 'permission_callback' => $editor, 'callback' => function ($req) {
            return mc_save_content(mc_body($req));
        }),
    ));
    register_rest_route($ns, '/admin/history', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () { return mc_history_list(); }),
    ));
    register_rest_route($ns, '/admin/history/(?P<id>[A-Za-z0-9]+)/restore', array(
        array('methods' => 'POST', 'permission_callback' => $editor, 'callback' => function ($req) { return mc_restore_history($req['id']); }),
    ));

    // ---------- Who is logged in ----------
    register_rest_route($ns, '/auth/me', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () {
            $u = wp_get_current_user();
            return array('email' => $u->user_email, 'name' => $u->display_name, 'role' => 'admin');
        }),
    ));

    // ---------- Media library ----------
    register_rest_route($ns, '/admin/upload', array(
        array('methods' => 'POST', 'permission_callback' => function () { return mc_can_edit() && current_user_can('upload_files'); },
            'callback' => function ($req) {
                $files = $req->get_file_params();
                if (empty($files['file'])) { return new WP_Error('mc_no_file', 'Please choose a file.', array('status' => 400)); }
                $type = isset($files['file']['type']) ? $files['file']['type'] : '';
                if (!preg_match('#^(image/(jpeg|png|gif|webp|svg\+xml)|video/(mp4|webm|quicktime))$#', $type)) {
                    return new WP_Error('mc_bad_type', 'Please choose a photo (JPG, PNG, GIF, WEBP) or a video (MP4, WEBM, MOV).', array('status' => 400));
                }
                require_once ABSPATH . 'wp-admin/includes/file.php';
                require_once ABSPATH . 'wp-admin/includes/media.php';
                require_once ABSPATH . 'wp-admin/includes/image.php';
                $_FILES['file'] = $files['file'];
                $id = media_handle_upload('file', 0);
                if (is_wp_error($id)) { return new WP_Error('mc_upload_failed', $id->get_error_message(), array('status' => 400)); }
                return array('id' => $id, 'url' => wp_get_attachment_url($id), 'path' => get_attached_file($id));
            }),
    ));
    register_rest_route($ns, '/admin/media/(?P<page>\d+)', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function ($req) {
            $q = new WP_Query(array(
                'post_type' => 'attachment', 'post_status' => 'inherit', 'posts_per_page' => 40, 'paged' => max(1, (int) $req['page']),
                'post_mime_type' => array('image', 'video'), 'orderby' => 'date', 'order' => 'DESC',
            ));
            $items = array();
            foreach ($q->posts as $p) {
                $is_video = strpos($p->post_mime_type, 'video/') === 0;
                $items[] = array(
                    'id' => $p->ID, 'title' => $p->post_title, 'type' => $is_video ? 'video' : 'image',
                    'url' => wp_get_attachment_url($p->ID),
                    'thumb' => $is_video ? wp_get_attachment_url($p->ID) : (wp_get_attachment_image_url($p->ID, 'medium') ?: wp_get_attachment_url($p->ID)),
                );
            }
            return array('items' => $items, 'pages' => (int) $q->max_num_pages);
        }),
    ));

    // ---------- Blog ----------
    register_rest_route($ns, '/blog', array(
        array('methods' => 'GET', 'permission_callback' => $public, 'callback' => function () {
            $posts = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 200));
            return array_map('mc_map_post', $posts);
        }),
    ));
    register_rest_route($ns, '/blog/(?P<slug>[A-Za-z0-9_%\-]+)', array(
        array('methods' => 'GET', 'permission_callback' => $public, 'callback' => function ($req) {
            $posts = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'name' => sanitize_title(urldecode($req['slug'])), 'numberposts' => 1));
            if (!$posts) { return new WP_Error('mc_not_found', 'Post not found', array('status' => 404)); }
            return mc_map_post($posts[0], true);
        }),
    ));
    register_rest_route($ns, '/admin/blog', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () {
            $posts = get_posts(array('post_type' => 'post', 'post_status' => array('publish', 'draft', 'pending', 'future', 'private'), 'numberposts' => 300));
            return array_map(function ($p) {
                $row = mc_map_post($p);
                $row['editUrl'] = get_edit_post_link($p->ID, 'raw');
                return $row;
            }, $posts);
        }),
    ));
    register_rest_route($ns, '/admin/blog/(?P<id>\d+)', array(
        array('methods' => 'DELETE', 'permission_callback' => function ($req) { return current_user_can('delete_post', (int) $req['id']); },
            'callback' => function ($req) {
                $p = get_post((int) $req['id']);
                if (!$p || $p->post_type !== 'post') { return new WP_Error('mc_not_found', 'Post not found', array('status' => 404)); }
                wp_trash_post($p->ID);
                return array('ok' => true);
            }),
    ));

    // ---------- Orders & enquiries (public create) ----------
    register_rest_route($ns, '/orders', array(
        array('methods' => 'POST', 'permission_callback' => $public, 'callback' => function ($req) {
            if (mc_rate_limited('order')) { return new WP_Error('mc_slow_down', 'Too many orders from this device. Please wait a few minutes.', array('status' => 429)); }
            $b = mc_body($req);
            $print = mc_clean_string(isset($b['print_text']) ? $b['print_text'] : '', 60);
            $event = sanitize_text_field(isset($b['event_name']) ? $b['event_name'] : '');
            $mobile = sanitize_text_field(isset($b['mobile']) ? $b['mobile'] : '');
            $logo = isset($b['logo_url']) ? esc_url_raw($b['logo_url']) : '';
            $uploads = wp_get_upload_dir();
            if ($logo && strpos($logo, $uploads['baseurl'] . '/mc-logos/') !== 0) { $logo = ''; }
            if ($event === '' || strlen($event) > 120) { return new WP_Error('mc_bad', 'Please enter your event name.', array('status' => 422)); }
            if (strlen($mobile) < 5 || strlen($mobile) > 20) { return new WP_Error('mc_bad', 'Please enter a valid mobile number.', array('status' => 422)); }
            if (trim($print) === '' && $logo === '') { return new WP_Error('mc_bad', 'Please add print text or a logo for your coconut.', array('status' => 400)); }
            $number = 'MC-' . strtoupper(substr(str_replace('-', '', wp_generate_uuid4()), 0, 6));
            $values = array('order_number' => $number, 'print_text' => $print, 'event_name' => $event, 'mobile' => $mobile,
                'logo_url' => $logo, 'logo_path' => sanitize_text_field(isset($b['logo_path']) ? $b['logo_path'] : ''));
            $id = mc_inbox_create('mc_order', $number . ' — ' . $event, $values);
            if (is_wp_error($id)) { return $id; }
            $rows = array('Order No' => esc_html($number), 'Print text' => esc_html(str_replace("\n", ' / ', $print)), 'Event' => esc_html($event), 'Mobile' => esc_html($mobile));
            if ($logo) { $rows['Logo'] = '<a href="' . esc_url($logo) . '">View logo</a>'; }
            mc_send_alert('New Order ' . $number, $rows);
            $post = get_post($id);
            return mc_inbox_row($post, mc_order_fields());
        }),
    ));
    register_rest_route($ns, '/enquiries', array(
        array('methods' => 'POST', 'permission_callback' => $public, 'callback' => function ($req) {
            if (mc_rate_limited('enquiry')) { return new WP_Error('mc_slow_down', 'Too many messages from this device. Please wait a few minutes.', array('status' => 429)); }
            $b = mc_body($req);
            $limits = array('name' => 120, 'whatsapp' => 30, 'eventType' => 60, 'eventDate' => 40, 'location' => 120, 'quantity' => 60, 'customization' => 1000);
            $values = array();
            foreach ($limits as $k => $max) {
                $v = isset($b[$k]) ? (string) $b[$k] : '';
                $v = $k === 'customization' ? sanitize_textarea_field($v) : sanitize_text_field($v);
                $values[$k] = mb_substr($v, 0, $max);
            }
            if ($values['name'] === '' || strlen($values['whatsapp']) < 3) {
                return new WP_Error('mc_bad', 'Please enter your name and WhatsApp number.', array('status' => 422));
            }
            $id = mc_inbox_create('mc_enquiry', $values['name'], $values);
            if (is_wp_error($id)) { return $id; }
            $labels = mc_enquiry_fields();
            $rows = array();
            foreach ($labels as $k => $label) { $rows[$label] = esc_html($values[$k] !== '' ? $values[$k] : '—'); }
            mc_send_alert('New Enquiry — ' . $values['name'], $rows);
            return mc_inbox_row(get_post($id), mc_enquiry_fields());
        }),
    ));
    register_rest_route($ns, '/upload-logo', array(
        array('methods' => 'POST', 'permission_callback' => $public, 'callback' => function ($req) {
            if (mc_rate_limited('logo', 20)) { return new WP_Error('mc_slow_down', 'Too many uploads. Please wait a few minutes.', array('status' => 429)); }
            $files = $req->get_file_params();
            return mc_handle_logo_upload(isset($files['file']) ? $files['file'] : null);
        }),
    ));

    // ---------- Inbox (editors) ----------
    register_rest_route($ns, '/admin/orders', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () { return mc_inbox_list('mc_order'); }),
    ));
    register_rest_route($ns, '/admin/enquiries', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () { return mc_inbox_list('mc_enquiry'); }),
    ));
    register_rest_route($ns, '/admin/(?P<type>orders|enquiries)/(?P<id>\d+)', array(
        array('methods' => 'DELETE', 'permission_callback' => $editor, 'callback' => function ($req) {
            $type = $req['type'] === 'orders' ? 'mc_order' : 'mc_enquiry';
            $p = get_post((int) $req['id']);
            if (!$p || $p->post_type !== $type) { return new WP_Error('mc_not_found', 'Not found', array('status' => 404)); }
            wp_trash_post($p->ID);
            return array('ok' => true);
        }),
    ));
    register_rest_route($ns, '/admin/stats', array(
        array('methods' => 'GET', 'permission_callback' => $editor, 'callback' => function () {
            $count = function ($type, $status) { $c = wp_count_posts($type); return isset($c->$status) ? (int) $c->$status : 0; };
            return array(
                'orders' => $count('mc_order', 'private'),
                'enquiries' => $count('mc_enquiry', 'private'),
                'posts' => $count('post', 'publish'),
                'edits' => mc_count_changes((array) get_option(MC_CONTENT_OPTION, array())),
            );
        }),
    ));
});

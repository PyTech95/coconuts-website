<?php
/**
 * wp-admin: a simple "Mr. Coconetto" home with big buttons, so anyone can find the editors.
 */

if (!defined('ABSPATH')) { exit; }

function mc_admin_links() {
    return array(
        array('✏️', 'Edit the website', 'Open the website, tap any words or picture and change it. Then press the green Save button.', home_url('/?mc-edit=1'), 'primary'),
        array('🧩', 'Change sections', 'Lists like services, plans, FAQ, slides and cities. Add, remove or move items.', home_url('/admin/sections'), ''),
        array('🖼️', 'Change pictures', 'See every picture and video on the website and swap any of them.', home_url('/admin/pictures'), ''),
        array('🎨', 'Change colours', 'Pick the green, pink and background colours.', home_url('/admin/colours'), ''),
        array('📝', 'Write a blog post', 'Write a new article for the blog.', admin_url('post-new.php'), ''),
        array('📰', 'All blog posts', 'Change or delete blog articles.', admin_url('edit.php'), ''),
        array('📦', 'Orders', 'Coconut orders customers placed on the website.', admin_url('edit.php?post_type=mc_order'), ''),
        array('💬', 'Enquiries', 'Messages from the contact form.', admin_url('edit.php?post_type=mc_enquiry'), ''),
        array('⏪', 'Undo / old versions', 'Made a mistake? Go back to how the website looked before.', home_url('/admin/history'), ''),
    );
}

add_action('admin_menu', function () {
    add_menu_page('Mr. Coconetto', 'Mr. Coconetto', mc_cap(), 'mc-home', 'mc_admin_home_page', 'dashicons-store', 2);
    add_submenu_page('mc-home', 'Mr. Coconetto', '🏠 Start here', mc_cap(), 'mc-home', 'mc_admin_home_page');
    add_submenu_page('mc-home', 'Edit the website', '✏️ Edit the website', mc_cap(), home_url('/?mc-edit=1'));
    add_submenu_page('mc-home', 'Change sections', '🧩 Change sections', mc_cap(), home_url('/admin/sections'));
    add_submenu_page('mc-home', 'Change pictures', '🖼️ Change pictures', mc_cap(), home_url('/admin/pictures'));
    add_submenu_page('mc-home', 'Undo', '⏪ Undo / old versions', mc_cap(), home_url('/admin/history'));
}, 9);

function mc_admin_home_page() {
    if (!current_user_can(mc_cap())) { return; }
    $saved = isset($_GET['mc_saved']);
    $emails = get_option('mc_alert_emails', '');
    ?>
    <div class="wrap mc-wrap">
        <h1 class="mc-title">🥥 Mr. Coconetto website</h1>
        <p class="mc-sub">What would you like to do? Click a big button.</p>
        <div class="mc-grid">
            <?php foreach (mc_admin_links() as $l) : ?>
                <a class="mc-tile <?php echo esc_attr($l[4]); ?>" href="<?php echo esc_url($l[3]); ?>">
                    <span class="mc-emoji"><?php echo esc_html($l[0]); ?></span>
                    <strong><?php echo esc_html($l[1]); ?></strong>
                    <span><?php echo esc_html($l[2]); ?></span>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="mc-card">
            <h2>How to change the website in 3 steps</h2>
            <ol class="mc-steps">
                <li>Press <b>✏️ Edit the website</b>. The website opens with an editing bar at the bottom.</li>
                <li>Tap any <b>words</b> to type new ones, or tap any <b>picture</b> to upload a new one.</li>
                <li>Press the big green <b>💾 Save</b> button. Everyone can now see your change.</li>
            </ol>
            <p>Made a mistake? Press <b>↩️ Undo</b> while editing, or open <b>⏪ Undo / old versions</b> to go back to an earlier day.</p>
        </div>

        <div class="mc-card">
            <h2>📧 Email me when someone orders or sends a message</h2>
            <?php if ($saved) : ?><div class="notice notice-success inline"><p>Saved.</p></div><?php endif; ?>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="mc_save_settings" />
                <?php wp_nonce_field('mc_settings'); ?>
                <label for="mc_alert_emails"><b>Email addresses</b> (separate with commas)</label><br />
                <input type="text" class="regular-text" style="width:100%;max-width:560px" id="mc_alert_emails" name="mc_alert_emails"
                       value="<?php echo esc_attr($emails); ?>" placeholder="<?php echo esc_attr(get_option('admin_email')); ?>" />
                <p class="description">Leave empty to use <?php echo esc_html(get_option('admin_email')); ?>. If emails do not arrive, install an SMTP plugin (for example "WP Mail SMTP").</p>
                <?php submit_button('Save email addresses'); ?>
            </form>
        </div>
    </div>
    <?php
}

add_action('admin_post_mc_save_settings', function () {
    if (!current_user_can(mc_cap())) { wp_die('Not allowed'); }
    check_admin_referer('mc_settings');
    $list = array_filter(array_map('trim', explode(',', sanitize_text_field(wp_unslash($_POST['mc_alert_emails'] ?? '')))), 'is_email');
    update_option('mc_alert_emails', implode(', ', $list), false);
    wp_safe_redirect(admin_url('admin.php?page=mc-home&mc_saved=1'));
    exit;
});

add_action('admin_head', function () {
    ?>
    <style>
        .mc-wrap{max-width:1100px}
        .mc-title{font-size:30px!important;font-weight:800!important;margin:10px 0 4px!important}
        .mc-sub{font-size:16px;color:#50575e;margin:0 0 20px}
        .mc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
        .mc-tile{display:flex;flex-direction:column;gap:6px;padding:20px;border-radius:16px;background:#fff;border:2px solid #e5e7eb;text-decoration:none;color:#1d2327;transition:transform .15s,border-color .15s,box-shadow .15s}
        .mc-tile:hover,.mc-tile:focus{transform:translateY(-2px);border-color:#16a34a;box-shadow:0 8px 24px rgba(0,0,0,.08);color:#1d2327}
        .mc-tile strong{font-size:17px}
        .mc-tile span{color:#50575e;font-size:13px;line-height:1.45}
        .mc-tile .mc-emoji{font-size:34px;line-height:1}
        .mc-tile.primary{background:linear-gradient(135deg,#16a34a,#db2777);border-color:transparent;color:#fff;grid-column:span 2}
        .mc-tile.primary span{color:rgba(255,255,255,.9)}
        .mc-tile.primary strong{font-size:22px}
        @media (max-width:600px){.mc-tile.primary{grid-column:auto}}
        .mc-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:18px 22px;margin-top:20px}
        .mc-card h2{margin-top:0}
        .mc-steps li{font-size:15px;margin-bottom:8px}
        #adminmenu .toplevel_page_mc-home .wp-menu-name{font-weight:700}
    </style>
    <?php
});

// After logging in, editors land on the Mr. Coconetto home instead of the plain dashboard.
add_filter('login_redirect', function ($redirect_to, $requested, $user) {
    if ($user instanceof WP_User && user_can($user, mc_cap())) {
        if ($requested === '' || $requested === admin_url() || $requested === admin_url('/')) {
            return admin_url('admin.php?page=mc-home');
        }
    }
    return $redirect_to;
}, 10, 3);

// Big buttons on the normal WordPress dashboard too.
add_action('wp_dashboard_setup', function () {
    if (!current_user_can(mc_cap())) { return; }
    wp_add_dashboard_widget('mc_dashboard', '🥥 Mr. Coconetto website', function () {
        echo '<p style="font-size:14px">Change the words and pictures of the website:</p><p>';
        echo '<a class="button button-primary button-hero" href="' . esc_url(home_url('/?mc-edit=1')) . '">✏️ Edit the website</a> ';
        echo '<a class="button button-hero" href="' . esc_url(admin_url('admin.php?page=mc-home')) . '">More options</a></p>';
    });
});

// "Edit the website" in the top black bar of wp-admin.
add_action('admin_bar_menu', function ($bar) {
    if (!is_admin() || !current_user_can(mc_cap())) { return; }
    $bar->add_node(array('id' => 'mc-edit', 'title' => '✏️ Edit the website', 'href' => home_url('/?mc-edit=1')));
}, 80);

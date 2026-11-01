import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, CONFIG } from '../../lib/api';
import { PageTitle, fmtDate, useOpenLiveEditor } from './AdminLayout';

const Tile = ({ emoji, title, text, to, href, onClick, testid, count }) => {
  const cls = 'relative text-left flex flex-col gap-1.5 rounded-2xl p-5 bg-white border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all';
  const body = (
    <>
      <span className="text-4xl leading-none">{emoji}</span>
      <span className="mt-2 font-bold text-lg text-gray-900">{title}</span>
      <span className="text-sm text-gray-500 leading-snug">{text}</span>
      {count != null && <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gray-100 text-sm font-bold text-gray-700">{count}</span>}
    </>
  );
  if (to) return <Link to={to} className={cls} data-testid={testid}>{body}</Link>;
  if (href) return <a href={href} className={cls} data-testid={testid}>{body}</a>;
  return <button type="button" onClick={onClick} className={cls} data-testid={testid}>{body}</button>;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const openEditor = useOpenLiveEditor();

  useEffect(() => {
    adminApi.get('/admin/stats').then(setStats).catch(() => {});
    adminApi.get('/admin/orders').then((o) => setOrders(o.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <PageTitle title={`Hello${CONFIG.user?.name ? `, ${CONFIG.user.name}` : ''}! 👋`} sub="What would you like to change today? Click a big button." />

      <button type="button" onClick={openEditor} data-testid="admin-dashboard-live-editor"
        className="w-full text-left rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-green-600 to-pink-600 text-white shadow-xl hover:brightness-110">
        <span className="text-5xl leading-none">✏️</span>
        <div className="mt-3 font-display font-bold text-2xl sm:text-3xl">Edit the website</div>
        <p className="text-white/90 mt-1 text-base max-w-xl">Opens the website. Tap any words or picture and change it. Press the green Save button when you are done.</p>
      </button>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Tile emoji="🧩" title="Change sections" text="Services, plans, FAQ, slides, cities… add, remove or move items." to="/admin/sections" testid="admin-tile-sections" />
        <Tile emoji="🖼️" title="Change pictures" text="Every picture and video on the website in one place." to="/admin/pictures" testid="admin-tile-pictures" />
        <Tile emoji="🎨" title="Change colours" text="The green, pink and background colours." to="/admin/colours" testid="admin-tile-colours" />
        <Tile emoji="📝" title="Write a blog post" text="Opens the WordPress writer for a new article." href={CONFIG.newPostUrl || '/wp-admin/post-new.php'} testid="admin-tile-new-post" />
        <Tile emoji="📦" title="Orders" text="Coconut orders from the website." to="/admin/orders" count={stats?.orders} testid="admin-tile-orders" />
        <Tile emoji="💬" title="Enquiries" text="Messages from the contact form." to="/admin/enquiries" count={stats?.enquiries} testid="admin-tile-enquiries" />
        <Tile emoji="📰" title="Blog posts" text="Change or delete articles." to="/admin/blog" count={stats?.posts} testid="admin-tile-blog" />
        <Tile emoji="🔤" title="Changed words" text="Everything you changed with the live editor." to="/admin/words" testid="admin-tile-words" />
        <Tile emoji="⏪" title="Undo / old versions" text="Go back to how the website looked before." to="/admin/history" testid="admin-tile-history" />
      </div>

      <div className="mt-6 rounded-2xl p-5 bg-white border-2 border-gray-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">📦 Latest orders</span>
          <Link to="/admin/orders" className="text-sm font-semibold text-green-700">See all →</Link>
        </div>
        <div className="mt-3 space-y-2" data-testid="admin-dashboard-recent">
          {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between text-sm">
              <span className="font-semibold text-pink-600">{o.order_number} <span className="text-gray-600 font-normal">· {o.event_name}</span></span>
              <span className="text-gray-400 text-xs">{fmtDate(o.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

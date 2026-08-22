import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Eye, LayoutDashboard, LogOut } from 'lucide-react';
import { useSiteContent } from '../context/SiteContent';

// Floating admin toolbar — only visible when an admin token exists.
const AdminBar = () => {
  const navigate = useNavigate();
  const { editMode, setEditMode, token, syncToken } = useSiteContent();

  useEffect(() => { syncToken && syncToken(); }, [syncToken]);

  const hasToken = (typeof window !== 'undefined' && localStorage.getItem('mc_admin_token')) || token;
  if (!hasToken) return null;

  const logout = () => {
    localStorage.removeItem('mc_admin_token');
    syncToken && syncToken();
    navigate('/admin/login');
  };

  return (
    <div data-testid="admin-bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-[#0d0710] text-white rounded-full pl-4 pr-2 py-2 shadow-2xl border border-white/10">
      <span className="text-xs font-semibold text-pink-300 hidden sm:inline">Admin</span>
      <button
        data-testid="admin-bar-editmode"
        onClick={() => setEditMode(!editMode)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${editMode ? 'bg-pink-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
      >
        {editMode ? <><Eye className="w-3.5 h-3.5" /> Preview</> : <><Pencil className="w-3.5 h-3.5" /> Edit Mode</>}
      </button>
      <button data-testid="admin-bar-dashboard" onClick={() => navigate('/admin')} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-600 hover:bg-green-700">
        <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Dashboard</span>
      </button>
      <button data-testid="admin-bar-logout" onClick={logout} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20" title="Logout">
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AdminBar;

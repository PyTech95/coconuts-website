import React, { useState } from 'react';
import { PenLine, Undo2, Search } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContent';
import { PageTitle, useOpenLiveEditor } from './AdminLayout';

const Row = ({ orig, value, onSave, onReset }) => {
  const [val, setVal] = useState(value);
  const changed = val !== value;
  return (
    <div className="py-4 flex flex-col gap-2" data-testid="admin-words-row">
      <div className="text-sm text-gray-400 break-words"><span className="font-semibold text-gray-500">Before:</span> <span className="line-through">{orig}</span></div>
      <div className="flex flex-col sm:flex-row gap-2">
        <textarea rows={Math.min(5, Math.max(1, Math.ceil(val.length / 70)))} value={val} onChange={(e) => setVal(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-[15px] focus:outline-none focus:border-green-500" data-testid="admin-words-input" />
        <div className="flex gap-2 sm:flex-col">
          {changed && <button type="button" onClick={() => onSave(val)} className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm" data-testid="admin-words-apply">OK</button>}
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-pink-300" data-testid="admin-words-reset"><Undo2 className="w-4 h-4" /> Original</button>
        </div>
      </div>
    </div>
  );
};

const AdminContent = () => {
  const { content, setText, resetText, setLink } = useSiteContent();
  const openEditor = useOpenLiveEditor();
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const texts = Object.entries(content.texts).filter(([k, v]) => !s || `${k} ${v}`.toLowerCase().includes(s));
  const links = Object.entries(content.links);

  return (
    <div data-testid="admin-content-page">
      <PageTitle title="🔤 Changed words" sub="Everything you changed by tapping on the website. Change it again here, or put back the original."
        action={<button type="button" onClick={openEditor} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm" data-testid="admin-content-open-editor"><PenLine className="w-4 h-4" /> Edit the website</button>} />

      <section className="bg-white rounded-3xl border-2 border-gray-100 p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-lg">Words ({Object.keys(content.texts).length})</h2>
          <label className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 rounded-full border border-gray-200 text-sm w-56" />
          </label>
        </div>
        {texts.length === 0 && <p className="text-gray-500 mt-3">No words changed yet. Press “Edit the website” and tap any words to change them.</p>}
        <div className="divide-y divide-gray-100" data-testid="admin-content-texts">
          {texts.map(([k, v]) => <Row key={`${k}|${v}`} orig={k} value={v} onSave={(nv) => setText(v, nv)} onReset={() => resetText(v)} />)}
        </div>
      </section>

      {links.length > 0 && (
        <section className="bg-white rounded-3xl border-2 border-gray-100 p-5 mb-5">
          <h2 className="font-bold text-lg mb-2">🔗 Changed button links ({links.length})</h2>
          <div className="divide-y divide-gray-100">
            {links.map(([k, v]) => (
              <div key={k} className="py-3 text-sm flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 break-all"><span className="text-gray-400 line-through">{k}</span><br /><span className="font-semibold">{v}</span></div>
                <button type="button" onClick={() => setLink(k, '')} className="text-pink-600 font-semibold">↩️ Original</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminContent;

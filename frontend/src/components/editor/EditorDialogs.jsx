import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Undo2, Check, Puzzle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { MediaPicker, MediaPreview } from './MediaPicker';
import { SectionEditor } from './DataForm';
import { useSiteContent } from '../../context/SiteContent';
import { SECTIONS, sectionByName, sectionsContaining, sectionsForPath } from '../../data/cms';

const Shell = ({ open, onClose, title, desc, children, footer, testid, wide }) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent data-editor-ui data-no-edit className={`${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-[92vh] overflow-y-auto`} data-testid={testid}>
      <DialogHeader>
        <DialogTitle className="text-xl sm:text-2xl font-bold">{title}</DialogTitle>
        {desc && <DialogDescription className="text-[15px]">{desc}</DialogDescription>}
      </DialogHeader>
      {children}
      {footer && <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">{footer}</div>}
    </DialogContent>
  </Dialog>
);

const BigBtn = ({ children, onClick, tone = 'green', testid }) => {
  const tones = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    white: 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800',
    pink: 'bg-white border-2 border-pink-200 hover:border-pink-400 text-pink-700',
  };
  return (
    <button type="button" onClick={onClick} data-testid={testid}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[15px] font-bold transition-colors ${tones[tone]}`}>
      {children}
    </button>
  );
};

const SectionHint = ({ text, onOpenSection }) => {
  const found = sectionsContaining(text);
  if (!found.length || !onOpenSection) return null;
  const s = found[0];
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-900">
      <span>This is part of <b>{s.emoji} {s.title}</b>. You can add or remove items there.</span>
      <button type="button" onClick={() => onOpenSection(s.name)} className="inline-flex items-center gap-1.5 font-bold text-green-700 hover:underline" data-testid="editor-open-section">
        <Puzzle className="w-4 h-4" /> Open section
      </button>
    </div>
  );
};

export const TextDialog = ({ target, onClose, onOpenSection }) => {
  const { content, setText, resetText, setLink } = useSiteContent();
  const [val, setVal] = useState('');
  const [link, setLinkVal] = useState('');

  useEffect(() => {
    if (!target) return;
    setVal(content.texts[target.key] ?? target.key);
    if (target.href != null) setLinkVal(content.links[target.href] ?? target.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target) return null;
  const apply = () => {
    const cur = content.texts[target.key] ?? target.key;
    if (val.trim() && val !== cur) setText(target.key, val);
    if (target.href != null) setLink(target.href, link.trim());
    onClose();
  };

  return (
    <Shell open onClose={onClose} title="✏️ Change these words" testid="editor-text-dialog"
      desc="Type the new words. You will see them on the page straight away."
      footer={<>
        <BigBtn tone="white" onClick={onClose}>Cancel</BigBtn>
        <BigBtn tone="pink" onClick={() => { resetText(target.key); if (target.href != null) setLink(target.href, ''); onClose(); }} testid="editor-text-reset"><Undo2 className="w-4 h-4" /> Put back original</BigBtn>
        <BigBtn onClick={apply} testid="editor-text-apply"><Check className="w-5 h-5" /> Done</BigBtn>
      </>}>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={Math.min(8, Math.max(3, Math.ceil(val.length / 45)))} autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) apply(); }}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg leading-relaxed focus:outline-none focus:border-green-500" data-testid="editor-text-input" />
      {target.href != null && (
        <label className="block">
          <span className="block text-sm font-bold text-gray-800 mb-1.5">🔗 Where should this button / link go?</span>
          <input value={link} onChange={(e) => setLinkVal(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-green-500" data-testid="editor-link-input" />
          <span className="block text-xs text-gray-500 mt-1">A website address (https://…), a phone (tel:+91…) or a page of this site (/customize).</span>
        </label>
      )}
      <SectionHint text={target.key} onOpenSection={onOpenSection} />
    </Shell>
  );
};

export const MediaDialog = ({ target, onClose, onOpenSection }) => {
  const { content, setImage, resetImage } = useSiteContent();
  if (!target) return null;
  const current = content.images[target.key] || target.key;
  return (
    <Shell open onClose={onClose} title="🖼️ Change this picture" testid="editor-media-dialog"
      desc="Upload a new photo or video, or choose one you uploaded before."
      footer={<BigBtn onClick={onClose} testid="editor-media-done"><Check className="w-5 h-5" /> Done</BigBtn>}>
      <MediaPicker value={current} onChange={(v) => setImage(target.key, v)} onReset={() => resetImage(target.key)} testid="editor-media" />
      <SectionHint text={target.key} onOpenSection={onOpenSection} />
    </Shell>
  );
};

/** Pick a section of this page, then edit everything in it (add / remove / move items). */
export const SectionDialog = ({ open, onClose, initial }) => {
  const { pathname } = useLocation();
  const [name, setName] = useState(initial || null);
  const [all, setAll] = useState(false);
  useEffect(() => { if (open) { setName(initial || null); setAll(false); } }, [open, initial]);

  const here = sectionsForPath(pathname);
  const list = all ? SECTIONS : here;
  const meta = name ? sectionByName(name) : null;

  return (
    <Shell open={open} onClose={onClose} wide testid="editor-section-dialog"
      title={meta ? `${meta.emoji} ${meta.title}` : '🧩 Change a whole section'}
      desc={meta ? 'Changes show on the page behind this window. Press Save on the editing bar when you are finished.' : 'Choose what you want to change. Here you can add, remove and reorder items too.'}
      footer={meta
        ? <><BigBtn tone="white" onClick={() => setName(null)} testid="editor-section-back"><ArrowLeft className="w-4 h-4" /> All sections</BigBtn><BigBtn onClick={onClose} testid="editor-section-done"><Check className="w-5 h-5" /> Done</BigBtn></>
        : <BigBtn onClick={onClose}>Close</BigBtn>}>
      {meta ? <SectionEditor key={name} name={name} /> : (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            {list.map((s) => (
              <button key={s.name} type="button" onClick={() => setName(s.name)} data-testid={`editor-section-pick-${s.name}`}
                className="text-left rounded-2xl border-2 border-gray-100 hover:border-green-500 p-4 transition-colors">
                <div className="text-lg font-bold text-gray-900">{s.emoji} {s.title}</div>
                <div className="text-xs text-gray-500 mt-1">{s.help}</div>
              </button>
            ))}
          </div>
          {!all && here.length < SECTIONS.length && (
            <button type="button" onClick={() => setAll(true)} className="text-sm font-semibold text-green-700 hover:underline">Show sections of all pages</button>
          )}
        </div>
      )}
    </Shell>
  );
};

export const COLOURS = [
  { key: 'green', label: 'Main green', def: '#16a34a', help: 'Buttons, headings and the top strip.' },
  { key: 'pink', label: 'Main pink', def: '#db2777', help: 'Highlights and second buttons.' },
  { key: 'blush', label: 'Light pink background', def: '#f6dde6', help: 'Background of the pink sections.' },
];

export const ColourFields = () => {
  const { content, setTheme } = useSiteContent();
  const theme = content.theme || {};
  return (
    <div className="space-y-3">
      {COLOURS.map((c) => (
        <label key={c.key} className="flex items-center justify-between gap-3 border-2 border-gray-100 rounded-2xl px-4 py-3 cursor-pointer">
          <span>
            <span className="block font-bold text-gray-900">{c.label}</span>
            <span className="block text-xs text-gray-500">{c.help}</span>
          </span>
          <span className="flex items-center gap-2">
            {theme[c.key] && <button type="button" className="text-xs font-semibold text-pink-600" onClick={(e) => { e.preventDefault(); const t = { ...theme }; delete t[c.key]; setTheme(t); }}>Original</button>}
            <input type="color" value={theme[c.key] || c.def} onChange={(e) => setTheme({ ...theme, [c.key]: e.target.value })} className="w-14 h-14 rounded-xl border-0 bg-transparent cursor-pointer" data-testid={`editor-theme-${c.key}`} />
          </span>
        </label>
      ))}
    </div>
  );
};

export const ThemeDialog = ({ open, onClose }) => (
  <Shell open={open} onClose={onClose} title="🎨 Website colours" testid="editor-theme-dialog"
    desc="Pick a colour. Every button and background with that colour changes."
    footer={<BigBtn onClick={onClose} testid="editor-theme-done"><Check className="w-5 h-5" /> Done</BigBtn>}>
    <ColourFields />
  </Shell>
);

export { MediaPreview };

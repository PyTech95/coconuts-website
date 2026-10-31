import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, Undo2, Redo2, X, LayoutDashboard, Eye, Loader2, Check, AlertTriangle, Paintbrush, Type, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, RotateCcw, EyeOff, ListPlus, Film, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useContent } from './ContentContext';
import { useEditorUI } from './Editable';
import { getListDef } from './schema';
import { Field, ColorInput, FontSelect, inputCls } from './FieldEditor';
import MediaPicker from './MediaPicker';
import { IS_DEMO } from '../lib/api';

const btn = 'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const small = 'inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50';

/** Find the nearest list path an element path belongs to (services.items.2.title → services.items). */
function parentListPath(path) {
  const parts = String(path || '').split('.');
  for (let i = parts.length - 1; i >= 1; i--) {
    if (/^\d+$/.test(parts[i])) {
      const lp = parts.slice(0, i).join('.');
      if (getListDef(lp)) return lp;
    }
  }
  return null;
}

export default function EditorToolbar() {
  const ctx = useContent();
  const { editMode, dirty, saving, status, save, discard, exitEdit, undo, redo, canUndo, canRedo, selected, setSelected } = ctx;
  const ui = useEditorUI();

  // Body class + intercept link clicks while editing so text inside links can be edited.
  useEffect(() => {
    if (!editMode) return undefined;
    document.body.classList.add('cms-editing');
    const onClick = (e) => {
      if (e.target.closest('[data-cms-allow]') || e.target.closest('.cms-toolbar')) return;
      const a = e.target.closest('a[href]');
      if (a) { e.preventDefault(); return; }
      if (e.target.closest('button[type="submit"]')) e.preventDefault();
      if (!e.target.closest('[data-cms]')) setSelected(null);
    };
    const onSubmit = (e) => { if (!e.target.closest('.cms-toolbar')) e.preventDefault(); };
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
      const editing = e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (!editing && mod && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('cms-editing');
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [editMode, save, undo, redo, setSelected]);

  if (!editMode) return <MediaPicker />;

  const onExit = () => {
    if (dirty && !window.confirm('You have unsaved changes. Exit without saving?')) return;
    discard();
    exitEdit();
  };

  return (
    <div className="cms-toolbar">
      {/* ---- bottom bar ---- */}
      <div className="fixed bottom-4 inset-x-0 z-[900] flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-2xl bg-gray-900/95 backdrop-blur text-white shadow-2xl px-2.5 py-2 border border-white/10 max-w-full overflow-x-auto">
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 border-r border-white/10">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs font-bold whitespace-nowrap">Live Editor</span>
            {IS_DEMO && <span className="text-[10px] font-bold uppercase bg-amber-400 text-amber-950 rounded px-1.5 py-0.5">Preview</span>}
          </div>
          <button type="button" onClick={undo} disabled={!canUndo} className={`${btn} hover:bg-white/10`} title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
          <button type="button" onClick={redo} disabled={!canRedo} className={`${btn} hover:bg-white/10`} title="Redo (Ctrl+Shift+Z)"><Redo2 className="w-4 h-4" /></button>
          <span className="w-px h-6 bg-white/10 mx-0.5" />
          <button type="button" onClick={save} disabled={saving || !dirty} className={`${btn} bg-green-600 hover:bg-green-500 text-white`} title="Save (Ctrl+S)">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
          <button type="button" onClick={() => { if (window.confirm('Discard all unsaved changes?')) discard(); }} disabled={!dirty} className={`${btn} hover:bg-white/10 text-white/80`}><RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Discard</span></button>
          <span className="w-px h-6 bg-white/10 mx-0.5" />
          <Link to="/admin" data-cms-allow className={`${btn} hover:bg-white/10 text-white/80`} title="Open the backend editor"><LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Backend editor</span></Link>
          <button type="button" onClick={onExit} className={`${btn} bg-white/10 hover:bg-white/20`} title="Exit live editor"><Eye className="w-4 h-4" /> <span className="hidden sm:inline">Exit</span></button>
        </div>
      </div>

      {/* ---- status toast ---- */}
      {status && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[950] rounded-full px-4 py-2 text-sm font-semibold shadow-xl flex items-center gap-2 ${status.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {status.type === 'ok' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {status.msg}
        </div>
      )}

      {/* ---- hint when nothing selected ---- */}
      {!selected && !ui.list && (
        <div className="fixed top-24 right-4 z-[900] max-w-[260px] rounded-xl bg-white/95 backdrop-blur shadow-xl border border-gray-200 p-3 text-xs text-gray-600 hidden md:block">
          <div className="font-bold text-gray-900 mb-1 flex items-center gap-1.5"><Paintbrush className="w-3.5 h-3.5 text-pink-600" /> How to edit</div>
          <ul className="space-y-1 list-disc pl-4">
            <li>Click any <b>text</b> and type. Press <kbd className="px-1 rounded bg-gray-100 border">Esc</kbd> or click away to apply.</li>
            <li>Click any <b>image / video</b> to replace it.</li>
            <li>Hover a section → click its <b>⬚ name</b> chip to change background colour.</li>
            <li>Use <b>✎ Manage</b> chips to add / remove cards, slides, blogs.</li>
            <li>Selected text: change <b>font, size, colour</b> in this panel.</li>
          </ul>
        </div>
      )}

      {selected && <StylePanel />}
      {ui.list && <ListDrawer />}
      <MediaPicker />
    </div>
  );
}

// ---------------------------------------------------------------------------
function StylePanel() {
  const { selected, setSelected, styles, setStyle, clearStyle, get, set } = useContent();
  const ui = useEditorUI();
  const [collapsed, setCollapsed] = useState(false);
  const path = selected.path;
  const ov = styles[path] || {};
  const kind = selected.kind;
  const listPath = useMemo(() => parentListPath(path), [path]);
  const value = kind === 'text' ? get(path, '') : null;

  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
      <div className="flex items-center gap-1 flex-1 justify-end min-w-0">{children}</div>
    </div>
  );

  return (
    <div className="fixed top-24 right-4 z-[900] w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white">
        {kind === 'text' ? <Type className="w-4 h-4 text-pink-400" /> : kind === 'section' ? <Paintbrush className="w-4 h-4 text-green-400" /> : kind === 'video' ? <Film className="w-4 h-4 text-pink-400" /> : <ImageIcon className="w-4 h-4 text-pink-400" />}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold capitalize">{kind === 'section' ? `Section: ${selected.label || path.replace('sec.', '')}` : kind}</div>
          <div className="text-[10px] text-white/50 truncate" title={path}>{path}</div>
        </div>
        <button type="button" onClick={() => setCollapsed((c) => !c)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center">{collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}</button>
        <button type="button" onClick={() => setSelected(null)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
      </div>

      {!collapsed && (
        <div className="p-3 max-h-[70vh] overflow-y-auto cms-scroll">
          {kind === 'text' && (
            <>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text</label>
              <textarea className={`${inputCls} mt-1 mb-2`} rows={value && value.length > 60 ? 4 : 2} value={value} onChange={(e) => set(path, e.target.value)} />
              <Row label="Font"><FontSelect allowDefault value={ov.fontFamily || ''} onChange={(v) => setStyle(path, { fontFamily: v || undefined })} /></Row>
              <Row label="Size">
                <input type="range" min={10} max={96} value={parseInt(ov.fontSize, 10) || 16} onChange={(e) => setStyle(path, { fontSize: `${e.target.value}px` })} className="flex-1 accent-pink-600" />
                <input className={`${inputCls} !w-20`} placeholder="auto" value={ov.fontSize || ''} onChange={(e) => setStyle(path, { fontSize: e.target.value || undefined })} />
              </Row>
              <Row label="Weight">
                <select className={inputCls} value={ov.fontWeight || ''} onChange={(e) => setStyle(path, { fontWeight: e.target.value || undefined })}>
                  <option value="">Default</option><option value="300">Light</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semi-bold</option><option value="700">Bold</option><option value="800">Extra bold</option>
                </select>
              </Row>
              <Row label="Style">
                <button type="button" className={`${small} ${ov.fontWeight >= 700 ? '!bg-gray-900 !text-white' : ''}`} onClick={() => setStyle(path, { fontWeight: ov.fontWeight >= 700 ? undefined : '700' })}><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className={`${small} ${ov.fontStyle === 'italic' ? '!bg-gray-900 !text-white' : ''}`} onClick={() => setStyle(path, { fontStyle: ov.fontStyle === 'italic' ? undefined : 'italic' })}><Italic className="w-3.5 h-3.5" /></button>
                {[['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]].map(([a, Icon]) => (
                  <button key={a} type="button" className={`${small} ${ov.textAlign === a ? '!bg-gray-900 !text-white' : ''}`} onClick={() => setStyle(path, { textAlign: ov.textAlign === a ? undefined : a })}><Icon className="w-3.5 h-3.5" /></button>
                ))}
                <button type="button" className={`${small} ${ov.textTransform === 'uppercase' ? '!bg-gray-900 !text-white' : ''}`} title="UPPERCASE" onClick={() => setStyle(path, { textTransform: ov.textTransform === 'uppercase' ? undefined : 'uppercase' })}>Aa</button>
              </Row>
              <Row label="Colour"><ColorInput allowClear value={ov.color || ''} onChange={(v) => setStyle(path, { color: v || undefined })} /></Row>
              <Row label="Highlight"><ColorInput allowClear value={ov.backgroundColor || ''} onChange={(v) => setStyle(path, { backgroundColor: v || undefined })} /></Row>
              <Row label="Spacing">
                <input className={`${inputCls} !w-24`} placeholder="letter" value={ov.letterSpacing || ''} onChange={(e) => setStyle(path, { letterSpacing: e.target.value || undefined })} />
                <input className={`${inputCls} !w-24`} placeholder="line" value={ov.lineHeight || ''} onChange={(e) => setStyle(path, { lineHeight: e.target.value || undefined })} />
              </Row>
            </>
          )}

          {(kind === 'image' || kind === 'video') && (
            <>
              <button type="button" onClick={() => ui.openPicker(path, kind)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-semibold">
                {kind === 'video' ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />} Change {kind}
              </button>
              <Row label="Rounding">
                <input type="range" min={0} max={48} value={parseInt(ov.borderRadius, 10) || 0} onChange={(e) => setStyle(path, { borderRadius: e.target.value === '0' ? undefined : `${e.target.value}px` })} className="flex-1 accent-pink-600" />
              </Row>
              <Row label="Opacity">
                <input type="range" min={10} max={100} value={Math.round((ov.opacity ?? 1) * 100)} onChange={(e) => setStyle(path, { opacity: e.target.value === '100' ? undefined : Number(e.target.value) / 100 })} className="flex-1 accent-pink-600" />
              </Row>
            </>
          )}

          {kind === 'section' && (
            <>
              <Row label="Background"><ColorInput allowClear value={ov.backgroundColor || ''} onChange={(v) => setStyle(path, { backgroundColor: v || undefined })} /></Row>
              <Row label="Text colour"><ColorInput allowClear value={ov.color || ''} onChange={(v) => setStyle(path, { color: v || undefined })} /></Row>
              <Row label="Padding">
                <input className={`${inputCls}`} placeholder="e.g. 80px 0" value={ov.padding || ''} onChange={(e) => setStyle(path, { padding: e.target.value || undefined })} />
              </Row>
              <p className="text-[11px] text-gray-400 mt-1">Tip: global colours (brand green / pink, light backgrounds) are in <Link to="/admin/content/theme" data-cms-allow className="underline text-green-700">Backend editor → Theme</Link>.</p>
            </>
          )}

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
            <button type="button" className={`${small} ${ov.hidden ? '!bg-amber-500 !text-white !border-amber-500' : ''}`} onClick={() => setStyle(path, { hidden: ov.hidden ? undefined : true })}>
              <EyeOff className="w-3.5 h-3.5 mr-1" /> {ov.hidden ? 'Hidden — click to show' : 'Hide'}
            </button>
            <button type="button" className={small} onClick={() => clearStyle(path)}><RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset styles</button>
            {listPath && (
              <button type="button" className={`${small} !bg-gray-900 !text-white`} onClick={() => ui.openList(listPath)}><ListPlus className="w-3.5 h-3.5 mr-1" /> Manage list</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ListDrawer() {
  const ui = useEditorUI();
  const def = getListDef(ui.list.path);
  return (
    <div className="fixed inset-y-0 right-0 z-[950] w-full sm:w-[440px] max-w-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <div>
          <div className="text-sm font-bold">{def ? def.label : 'Items'}</div>
          <div className="text-[10px] text-white/50">{ui.list.path} · changes preview live — press Save in the bar to publish</div>
        </div>
        <button type="button" onClick={ui.closeList} className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto cms-scroll p-4 pb-28">
        {def ? <Field def={def} path={ui.list.path} /> : <div className="text-sm text-gray-500">No editor schema for this list.</div>}
      </div>
    </div>
  );
}

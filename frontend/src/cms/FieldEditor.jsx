import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Copy, GripVertical, ImageIcon, Film, X, Upload } from 'lucide-react';
import { useContent, GOOGLE_FONTS, SYSTEM_FONTS, ensureFont } from './ContentContext';
import { useEditorUI } from './Editable';
import { getIcon } from './icons';
import { asset } from '../lib/api';

export const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500';
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1';
const btnSm = 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40';

const joinPath = (a, b) => (a ? `${a}.${b}` : String(b));

// ---------------------------------------------------------------------------
export function Field({ def, path, compact }) {
  const { get, set } = useContent();
  const value = get(path);
  const help = def.help ? <p className="text-[11px] text-gray-400 mt-1">{def.help}</p> : null;
  const wrap = (child) => (
    <div className={compact ? 'mb-2' : 'mb-4'}>
      {def.label && <label className={labelCls}>{def.label}</label>}
      {child}
      {help}
    </div>
  );

  switch (def.type) {
    case 'textarea':
      return wrap(<textarea className={inputCls} rows={compact ? 2 : 3} value={value ?? ''} onChange={(e) => set(path, e.target.value)} />);
    case 'number':
      return wrap(<input type="number" className={inputCls} value={value ?? ''} onChange={(e) => set(path, e.target.value === '' ? '' : Number(e.target.value))} />);
    case 'boolean':
      return (
        <label className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-4'} cursor-pointer select-none`}>
          <input type="checkbox" className="w-4 h-4 accent-green-600" checked={!!value} onChange={(e) => set(path, e.target.checked)} />
          <span className="text-sm text-gray-700 font-medium">{def.label}</span>
        </label>
      );
    case 'select':
      return wrap(
        <select className={inputCls} value={value ?? ''} onChange={(e) => set(path, e.target.value)}>
          {(def.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>,
      );
    case 'icon': {
      const Icon = getIcon(value);
      return wrap(
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
          <select className={inputCls} value={value ?? ''} onChange={(e) => set(path, e.target.value)}>
            {(def.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>,
      );
    }
    case 'color':
      return wrap(<ColorInput value={value} onChange={(v) => set(path, v)} />);
    case 'font':
      return wrap(<FontSelect value={value} onChange={(v) => set(path, v)} />);
    case 'image':
    case 'video':
    case 'media':
      return wrap(<MediaField path={path} kind={def.type === 'media' ? 'any' : def.type} />);
    case 'group':
      return (
        <fieldset className="mb-4 rounded-xl border border-gray-200 p-3">
          <legend className="px-1 text-xs font-bold text-gray-700">{def.label}</legend>
          {(def.fields || []).map((f) => <Field key={f.key} def={f} path={joinPath(path, f.key)} compact />)}
        </fieldset>
      );
    case 'list':
      return <ListField def={def} path={path} compact={compact} />;
    case 'blocks':
      return wrap(<BlocksEditor path={path} />);
    default:
      return wrap(<input className={inputCls} value={value ?? ''} onChange={(e) => set(path, e.target.value)} />);
  }
}

// ---------------------------------------------------------------------------
export function ColorInput({ value, onChange, allowClear }) {
  const hex = /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#ffffff';
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 p-0.5 bg-white cursor-pointer" />
      <input className={inputCls} value={value ?? ''} placeholder="#rrggbb" onChange={(e) => onChange(e.target.value)} />
      {allowClear && <button type="button" className={btnSm} onClick={() => onChange('')}>Clear</button>}
    </div>
  );
}

export function FontSelect({ value, onChange, allowDefault }) {
  return (
    <select
      className={inputCls}
      value={value ?? ''}
      style={value ? { fontFamily: `'${value}'` } : undefined}
      onChange={(e) => { ensureFont(e.target.value); onChange(e.target.value); }}
    >
      {allowDefault && <option value="">Default</option>}
      <optgroup label="Sans-serif">{GOOGLE_FONTS.slice(0, 9).map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}</optgroup>
      <optgroup label="Serif / Display">{GOOGLE_FONTS.slice(9, 15).map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}</optgroup>
      <optgroup label="Script">{GOOGLE_FONTS.slice(15).map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}</optgroup>
      <optgroup label="System">{SYSTEM_FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}</optgroup>
    </select>
  );
}

// ---------------------------------------------------------------------------
export function MediaField({ path, kind = 'image' }) {
  const { get, set } = useContent();
  const { openPicker } = useEditorUI();
  const value = get(path, '');
  const isVideo = kind === 'video' || (kind === 'any' && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(value || ''));
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
        {value ? (
          isVideo ? <video src={asset(value)} className="w-full h-full object-cover" muted /> : <img src={asset(value)} alt="" className="w-full h-full object-cover" />
        ) : (isVideo ? <Film className="w-5 h-5 text-gray-300" /> : <ImageIcon className="w-5 h-5 text-gray-300" />)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-gray-500 truncate" title={value}>{value || 'No file selected'}</div>
        <div className="mt-1 flex gap-1.5">
          <button type="button" className={`${btnSm} !border-green-600 !bg-green-600 !text-white hover:!bg-green-700`} onClick={() => openPicker(path, kind === 'any' ? 'any' : kind)}>
            <Upload className="w-3 h-3" /> {value ? 'Change' : 'Choose'}
          </button>
          {value && <button type="button" className={btnSm} onClick={() => set(path, '')}><X className="w-3 h-3" /> Remove</button>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function itemTitle(def, item, i) {
  if (def.itemLabel) { try { const l = def.itemLabel(item); if (l) return l; } catch {} }
  if (typeof item === 'string') return item || `Item ${i + 1}`;
  if (item && typeof item === 'object') {
    for (const k of ['title', 'name', 'label', 'q', 'text', 'kicker', 'value']) if (item[k]) return String(item[k]);
  }
  return `Item ${i + 1}`;
}

export function ListField({ def, path, compact }) {
  const { get, set } = useContent();
  const items = get(path, []) || [];
  const [open, setOpen] = useState(() => (items.length <= 3 ? items.map((_, i) => i) : []));
  const itemType = def.item?.type || 'object';

  const update = (next) => set(path, next);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
    setOpen((o) => o.map((x) => (x === i ? j : x === j ? i : x)));
  };
  const removeAt = (i) => { if (window.confirm('Remove this item?')) { update(items.filter((_, k) => k !== i)); setOpen([]); } };
  const duplicate = (i) => { const next = [...items]; next.splice(i + 1, 0, JSON.parse(JSON.stringify(items[i]))); update(next); };
  const add = () => {
    const ni = def.newItem ? def.newItem() : (itemType === 'string' ? '' : itemType === 'image' ? '' : {});
    update([...items, ni]);
    setOpen((o) => [...o, items.length]);
  };
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <div className={compact ? 'mb-3' : 'mb-5'}>
      <div className="flex items-center justify-between mb-2">
        <label className={`${labelCls} !mb-0`}>{def.label} <span className="text-gray-300 font-normal">({items.length})</span></label>
        <button type="button" onClick={add} className={`${btnSm} !bg-green-600 !border-green-600 !text-white hover:!bg-green-700`}><Plus className="w-3.5 h-3.5" /> Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const ipath = `${path}.${i}`;
          const controls = (
            <div className="flex items-center gap-0.5 shrink-0">
              <button type="button" className={btnSm} onClick={() => move(i, -1)} disabled={i === 0} title="Move up"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button type="button" className={btnSm} onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"><ChevronDown className="w-3.5 h-3.5" /></button>
              {itemType === 'object' && <button type="button" className={btnSm} onClick={() => duplicate(i)} title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>}
              <button type="button" className={`${btnSm} hover:!bg-red-50 hover:!text-red-600`} onClick={() => removeAt(i)} title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          );
          if (itemType === 'string') {
            return (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <input className={inputCls} value={item ?? ''} onChange={(e) => update(items.map((x, k) => (k === i ? e.target.value : x)))} />
                {controls}
              </div>
            );
          }
          if (itemType === 'image' || itemType === 'video') {
            return (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
                <div className="flex-1"><MediaField path={ipath} kind={itemType} /></div>
                {controls}
              </div>
            );
          }
          const isOpen = open.includes(i);
          return (
            <div key={i} className="rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" onClick={() => toggle(i)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 w-5 shrink-0">{i + 1}</span>
                  {item && item.image && <img src={asset(item.image)} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                  {item && item.src && item.type === 'image' && <img src={asset(item.src)} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                  <span className="text-sm font-semibold text-gray-800 truncate">{itemTitle(def, item, i)}</span>
                  {item && item.published === false && <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-1.5 rounded">Draft</span>}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 ml-auto shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-auto shrink-0" />}
                </button>
                {controls}
              </div>
              {isOpen && (
                <div className="border-t border-gray-100 px-3 pt-3 pb-1">
                  {(def.item?.fields || []).map((f) => <Field key={f.key} def={f} path={`${ipath}.${f.key}`} compact />)}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && <div className="text-xs text-gray-400 italic py-2">No items yet — click Add.</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blog content blocks
// ---------------------------------------------------------------------------
const BLOCK_TYPES = [
  { type: 'p', label: 'Paragraph' },
  { type: 'h', label: 'Heading' },
  { type: 'ul', label: 'Bullet list' },
  { type: 'quote', label: 'Quote' },
  { type: 'img', label: 'Image' },
  { type: 'video', label: 'Video' },
];

export function BlocksEditor({ path }) {
  const { get, set } = useContent();
  const blocks = get(path, []) || [];
  const update = (next) => set(path, next);
  const patch = (i, p) => update(blocks.map((b, k) => (k === i ? { ...b, ...p } : b)));
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= blocks.length) return; const n = [...blocks]; [n[i], n[j]] = [n[j], n[i]]; update(n); };
  const add = (type) => update([...blocks, type === 'ul' ? { type, items: ['First point'] } : type === 'img' || type === 'video' ? { type, src: '', caption: '' } : { type, text: '' }]);

  return (
    <div className="space-y-2">
      {blocks.map((b, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-2 bg-gray-50/60">
          <div className="flex items-center gap-2 mb-1.5">
            <select className="rounded-md border border-gray-200 text-xs px-2 py-1 bg-white" value={b.type} onChange={(e) => patch(i, { type: e.target.value })}>
              {BLOCK_TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
            </select>
            <div className="ml-auto flex gap-0.5">
              <button type="button" className={btnSm} onClick={() => move(i, -1)} disabled={i === 0}><ChevronUp className="w-3.5 h-3.5" /></button>
              <button type="button" className={btnSm} onClick={() => move(i, 1)} disabled={i === blocks.length - 1}><ChevronDown className="w-3.5 h-3.5" /></button>
              <button type="button" className={`${btnSm} hover:!bg-red-50 hover:!text-red-600`} onClick={() => update(blocks.filter((_, k) => k !== i))}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {b.type === 'ul' ? (
            <textarea className={inputCls} rows={3} value={(b.items || []).join('\n')} placeholder="One point per line" onChange={(e) => patch(i, { items: e.target.value.split('\n') })} />
          ) : b.type === 'img' || b.type === 'video' ? (
            <div className="space-y-2">
              <MediaField path={`${path}.${i}.src`} kind={b.type === 'video' ? 'video' : 'image'} />
              <input className={inputCls} placeholder="Caption (optional)" value={b.caption || ''} onChange={(e) => patch(i, { caption: e.target.value })} />
            </div>
          ) : (
            <textarea className={inputCls} rows={b.type === 'h' ? 1 : 3} value={b.text || ''} onChange={(e) => patch(i, { text: e.target.value })} />
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {BLOCK_TYPES.map((t) => <button key={t.type} type="button" className={btnSm} onClick={() => add(t.type)}><Plus className="w-3 h-3" /> {t.label}</button>)}
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, ChevronDown, Undo2 } from 'lucide-react';
import { MediaPicker } from './MediaPicker';
import { useSiteContent } from '../../context/SiteContent';
import {
  DEFAULTS, HIDDEN_FIELDS, LONG_FIELDS, eachString, fieldLabel, getSection, isMediaField, itemTitle, sectionByName, slugify,
} from '../../data/cms';

const clone = (v) => JSON.parse(JSON.stringify(v ?? null));
const input = 'w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-[15px] text-gray-900 focus:outline-none focus:border-green-500';
const smallBtn = 'w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30';

const Label = ({ children }) => <span className="block text-sm font-bold text-gray-800 mb-1.5">{children}</span>;

/** "Are you sure?" inside the page (no browser pop-ups). */
const ConfirmButton = ({ onConfirm, label, title, className = smallBtn, children, testid }) => {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button type="button" title={title} className={className} onClick={() => setAsk(true)} data-testid={testid}>{children}</button>;
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1 text-xs font-semibold text-red-700">
      {label}
      <button type="button" className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => { setAsk(false); onConfirm(); }} data-testid={testid ? `${testid}-yes` : undefined}>Yes</button>
      <button type="button" className="px-2 py-1 rounded bg-white border" onClick={() => setAsk(false)}>No</button>
    </span>
  );
};

const TextInput = ({ k, value, onChange, testid }) => {
  const long = LONG_FIELDS.test(String(k)) || String(value || '').length > 70;
  if (long) {
    const rows = Math.min(10, Math.max(3, Math.ceil(String(value || '').length / 60)));
    return <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={input} data-testid={testid} />;
  }
  return <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={input} data-testid={testid} />;
};

const Field = ({ k, value, def, onChange, ctx, testid }) => {
  if (HIDDEN_FIELDS.has(k)) return null;
  const label = <Label>{fieldLabel(k)}</Label>;

  if ((typeof value === 'string' || value === null || value === undefined) && isMediaField(k, value)) {
    return (
      <div>{label}
        <MediaPicker compact value={value || ''} onChange={onChange} testid={testid}
          onReset={typeof def === 'string' && def !== value ? () => onChange(def) : undefined} />
      </div>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-3 py-2 cursor-pointer">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="w-6 h-6 accent-green-600" data-testid={testid} />
        <span className="text-sm font-bold text-gray-800">{fieldLabel(k)}</span>
      </label>
    );
  }
  if (typeof value === 'number') {
    return <div>{label}<input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={input} data-testid={testid} /></div>;
  }
  if (Array.isArray(value)) {
    return <ListField k={k} value={value} def={Array.isArray(def) ? def : []} onChange={onChange} ctx={ctx} testid={testid} />;
  }
  if (value && typeof value === 'object') {
    return (
      <fieldset className="border-2 border-gray-100 rounded-2xl p-4 space-y-4">
        <legend className="px-2 text-sm font-bold text-gray-700">{fieldLabel(k)}</legend>
        <ObjectFields value={value} def={def || {}} onChange={onChange} ctx={ctx} testid={testid} />
      </fieldset>
    );
  }
  if (k === 'icon') {
    const opts = Array.from(new Set([...(ctx.icons || []), value].filter(Boolean)));
    return (
      <div>{label}
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={input} data-testid={testid}>
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value)) {
    return <div>{label}<input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-16 h-12 rounded-lg" data-testid={testid} /></div>;
  }
  return <div>{label}<TextInput k={k} value={value} onChange={onChange} testid={testid} /></div>;
};

const ObjectFields = ({ value, def, onChange, ctx, testid }) => (
  <div className="space-y-4">
    {Object.keys(value).filter((k) => !HIDDEN_FIELDS.has(k)).map((k) => (
      <Field key={k} k={k} value={value[k]} def={def ? def[k] : undefined} ctx={ctx} testid={`${testid}-${k}`}
        onChange={(v) => onChange({ ...value, [k]: v })} />
    ))}
  </div>
);

const newItemLike = (items, def) => {
  const base = items.length ? items[items.length - 1] : def[0];
  if (typeof base === 'string' || base === undefined) return '';
  const copy = clone(base);
  const key = ['title', 'name', 'q', 'label', 'tag'].find((k) => typeof copy[k] === 'string');
  if (key) copy[key] = `${copy[key]} (new)`;
  if (typeof copy.slug === 'string') copy.slug = `${slugify(copy[key] || 'item')}-${Date.now().toString(36)}`;
  if (typeof copy.highlight === 'boolean') copy.highlight = false;
  return copy;
};

const ListField = ({ k, value, def, onChange, ctx, testid }) => {
  const simple = value.every((v) => typeof v !== 'object' || v === null);
  const [open, setOpen] = useState(() => new Set(value.length <= 3 ? value.map((_, i) => i) : []));
  const lastAdded = useRef(null);

  useEffect(() => {
    if (lastAdded.current != null) {
      document.getElementById(`${testid}-item-${lastAdded.current}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      lastAdded.current = null;
    }
  });

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(value.filter((_, x) => x !== i));
  const add = () => {
    const next = [...value, newItemLike(value, def)];
    lastAdded.current = next.length - 1;
    setOpen((s) => new Set([...s, next.length - 1]));
    onChange(next);
  };
  const toggle = (i) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const mediaList = simple && value.length > 0 && value.every((v) => isMediaField(k, v));

  return (
    <div>
      <Label>{fieldLabel(k)} <span className="font-normal text-gray-400">({value.length})</span></Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} id={`${testid}-item-${i}`} className="rounded-2xl border-2 border-gray-100 bg-gray-50/60" data-testid={`${testid}-item-${i}`}>
            <div className="flex items-center gap-2 p-2">
              <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-500 flex items-center justify-center">{i + 1}</span>
              {simple && !mediaList ? (
                <input value={item ?? ''} onChange={(e) => onChange(value.map((v, x) => (x === i ? e.target.value : v)))} className={`${input} py-2`} data-testid={`${testid}-item-${i}-input`} />
              ) : simple ? (
                <div className="flex-1 min-w-0 text-sm text-gray-500 truncate">{fieldLabel(k)} {i + 1}</div>
              ) : (
                <button type="button" onClick={() => toggle(i)} className="flex-1 min-w-0 flex items-center gap-2 text-left font-semibold text-gray-800 py-2" data-testid={`${testid}-item-${i}-toggle`}>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open.has(i) ? 'rotate-180' : ''}`} />
                  <span className="truncate">{itemTitle(item, i)}</span>
                </button>
              )}
              <button type="button" title="Move up" className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></button>
              <button type="button" title="Move down" className={smallBtn} disabled={i === value.length - 1} onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></button>
              <ConfirmButton title="Remove" label="Remove?" onConfirm={() => remove(i)} testid={`${testid}-item-${i}-remove`}><Trash2 className="w-4 h-4 text-red-500" /></ConfirmButton>
            </div>
            {mediaList && (
              <div className="px-3 pb-3">
                <MediaPicker compact value={item || ''} onChange={(v) => onChange(value.map((x, n) => (n === i ? v : x)))} testid={`${testid}-item-${i}-media`} />
              </div>
            )}
            {!simple && open.has(i) && (
              <div className="px-3 pb-4 pt-1">
                {item && typeof item === 'object'
                  ? <ObjectFields value={item} def={def[i] || def[0] || {}} ctx={ctx} testid={`${testid}-item-${i}`} onChange={(v) => onChange(value.map((x, n) => (n === i ? v : x)))} />
                  : null}
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-green-400 text-green-700 font-bold hover:bg-green-50" data-testid={`${testid}-add`}>
        <Plus className="w-5 h-5" /> Add another
      </button>
    </div>
  );
};

/** Full editor for one website section (used in the live editor and in /admin). */
export const SectionEditor = ({ name }) => {
  const { setSection, resetSection, content, dataVersion } = useSiteContent();
  const meta = sectionByName(name);
  const [local, setLocal] = useState(() => clone(getSection(name)));
  const sent = useRef(JSON.stringify(local));
  const timer = useRef(null);

  // Undo / reset from elsewhere → show the new values.
  useEffect(() => {
    if (timer.current) return; // still typing
    const now = JSON.stringify(getSection(name));
    if (now !== sent.current) { sent.current = now; setLocal(clone(getSection(name))); }
  }, [dataVersion, name]);

  const icons = useMemo(() => {
    const set = new Set();
    eachString(DEFAULTS[name], (path, s) => { if (path[path.length - 1] === 'icon') set.add(s); });
    return Array.from(set);
  }, [name]);

  const flushRef = useRef(null);
  const onChange = (v) => {
    setLocal(v);
    sent.current = JSON.stringify(v);
    if (timer.current) clearTimeout(timer.current);
    flushRef.current = () => setSection(name, v);
    timer.current = setTimeout(() => { timer.current = null; flushRef.current(); }, 450);
  };
  // Make sure the last keystrokes are kept when the editor closes.
  useEffect(() => () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; flushRef.current?.(); }
  }, []);

  if (!meta) return null;
  const changed = content.data && content.data[name] !== undefined;
  const value = local;
  const def = DEFAULTS[name];

  return (
    <div className="space-y-5" data-testid={`section-editor-${name}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-gray-600 max-w-xl">{meta.help}</p>
        {changed && (
          <ConfirmButton label="Put back everything in this section?" onConfirm={() => resetSection(name)} testid={`section-reset-${name}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
            <Undo2 className="w-4 h-4" /> Put back original
          </ConfirmButton>
        )}
      </div>
      {Array.isArray(value)
        ? <ListField k={name === 'HERO_SLIDES' ? 'slides' : 'items'} value={value} def={def} onChange={onChange} ctx={{ icons }} testid={`sec-${name}`} />
        : <ObjectFields value={value} def={def} onChange={onChange} ctx={{ icons }} testid={`sec-${name}`} />}
    </div>
  );
};

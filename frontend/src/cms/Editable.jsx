import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useContent } from './ContentContext';
import { asset, tpl } from '../lib/api';

// ---------------------------------------------------------------------------
// Editor UI state (which picker / list manager is open). Separate from the
// content itself so the site never re-renders for pure UI changes.
// ---------------------------------------------------------------------------
const EditorUIContext = createContext({ openPicker: () => {}, openList: () => {} });

export function EditorUIProvider({ children }) {
  const [picker, setPicker] = useState(null); // { path, kind: 'image'|'video', onPick? }
  const [list, setList] = useState(null); // { path }
  const value = useMemo(() => ({
    picker, list,
    openPicker: (path, kind = 'image', onPick) => setPicker({ path, kind, onPick }),
    closePicker: () => setPicker(null),
    openList: (path) => setList({ path }),
    closeList: () => setList(null),
  }), [picker, list]);
  return <EditorUIContext.Provider value={value}>{children}</EditorUIContext.Provider>;
}
export const useEditorUI = () => useContext(EditorUIContext);

// ---------------------------------------------------------------------------
// Style overrides → inline CSS
// ---------------------------------------------------------------------------
export function styleFromOverride(ov) {
  if (!ov) return undefined;
  const s = {};
  if (ov.color) s.color = ov.color;
  if (ov.backgroundColor) { s.backgroundColor = ov.backgroundColor; s.backgroundImage = 'none'; }
  if (ov.fontFamily) s.fontFamily = `'${ov.fontFamily}', sans-serif`;
  if (ov.fontSize) s.fontSize = typeof ov.fontSize === 'number' ? `${ov.fontSize}px` : ov.fontSize;
  if (ov.fontWeight) s.fontWeight = ov.fontWeight;
  if (ov.fontStyle) s.fontStyle = ov.fontStyle;
  if (ov.textAlign) s.textAlign = ov.textAlign;
  if (ov.letterSpacing) s.letterSpacing = ov.letterSpacing;
  if (ov.lineHeight) s.lineHeight = ov.lineHeight;
  if (ov.textDecoration) s.textDecoration = ov.textDecoration;
  if (ov.textTransform) s.textTransform = ov.textTransform;
  if (ov.opacity !== undefined) s.opacity = ov.opacity;
  if (ov.borderRadius) s.borderRadius = ov.borderRadius;
  if (ov.padding) s.padding = ov.padding;
  if (ov.hidden) s.display = 'none';
  return s;
}

const cx = (...a) => a.filter(Boolean).join(' ');

// ---------------------------------------------------------------------------
// <T/> — editable text
// ---------------------------------------------------------------------------
export function T({ path, as: Tag = 'span', className, style, vars, fallback = '', multiline, children, ...rest }) {
  const { get, set, styles, editMode, selected, setSelected } = useContent();
  const raw = get(path, fallback);
  const value = raw == null ? '' : String(raw);
  const ov = styles[path];
  const ref = useRef(null);
  const isSelected = selected && selected.path === path;

  const commit = useCallback((e) => {
    const text = e.currentTarget.innerText.replace(/\n+$/, '');
    if (text !== value) set(path, text);
  }, [path, set, value]);

  const inline = useMemo(() => ({
    ...(value.includes('\n') ? { whiteSpace: 'pre-line' } : null),
    ...styleFromOverride(ov),
    ...style,
  }), [ov, style, value]);

  if (!editMode) {
    if (ov && ov.hidden) return null;
    return (
      <Tag className={className} style={inline} {...rest}>
        {vars ? tpl(value, vars) : value}
        {children}
      </Tag>
    );
  }

  const isMultiline = multiline ?? ['p', 'div', 'blockquote', 'li', 'td'].includes(Tag);

  return (
    <Tag
      ref={ref}
      className={cx(className, 'cms-edit', isSelected && 'cms-selected')}
      style={{ ...inline, display: ov && ov.hidden ? undefined : inline.display, opacity: ov && ov.hidden ? 0.35 : inline.opacity }}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-cms={path}
      data-cms-kind="text"
      title={`Edit: ${path}`}
      onFocus={() => setSelected({ path, kind: 'text' })}
      onClick={(e) => { e.stopPropagation(); setSelected({ path, kind: 'text' }); }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isMultiline && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); }
        if (e.key === 'Escape') { e.currentTarget.blur(); }
        e.stopPropagation();
      }}
      {...rest}
    >
      {value}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// <Img/> — editable image (click in edit mode → picker)
// ---------------------------------------------------------------------------
export function Img({ path, src, alt = '', className, style, fallback, ...rest }) {
  const { get, styles, editMode, selected, setSelected } = useContent();
  const { openPicker } = useEditorUI();
  const value = path ? get(path, src ?? fallback ?? '') : src;
  const ov = path ? styles[path] : undefined;
  const isSelected = selected && selected.path === path;
  const resolved = asset(value);

  if (!editMode) {
    if (!resolved) return null;
    return <img src={resolved} alt={alt} className={className} style={{ ...styleFromOverride(ov), ...style }} {...rest} />;
  }
  return (
    <img
      src={resolved || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="20">Click to add image</text></svg>'}
      alt={alt}
      className={cx(className, 'cms-edit cms-edit-media', isSelected && 'cms-selected')}
      style={{ ...styleFromOverride(ov), ...style }}
      data-cms={path}
      data-cms-kind="image"
      title={`Change image: ${path}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelected({ path, kind: 'image' }); openPicker(path, 'image'); }}
      {...rest}
    />
  );
}

// ---------------------------------------------------------------------------
// <Vid/> — editable video
// ---------------------------------------------------------------------------
export function Vid({ path, posterPath, src, className, style, ...rest }) {
  const { get, editMode, selected, setSelected } = useContent();
  const { openPicker } = useEditorUI();
  const value = path ? get(path, src || '') : src;
  const poster = posterPath ? asset(get(posterPath, '')) : rest.poster;
  const isSelected = selected && selected.path === path;
  const common = { className: cx(className, editMode && 'cms-edit cms-edit-media', isSelected && 'cms-selected'), style, poster: poster || undefined };
  if (!editMode) return <video src={asset(value)} {...common} {...rest} />;
  return (
    <video
      src={asset(value)}
      {...common}
      {...rest}
      data-cms={path}
      data-cms-kind="video"
      title={`Change video: ${path}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelected({ path, kind: 'video' }); openPicker(path, 'video'); }}
    />
  );
}

// ---------------------------------------------------------------------------
// <Sec/> — section wrapper with editable background / text colour
// ---------------------------------------------------------------------------
export const Sec = React.forwardRef(function Sec({ id, as: Tag = 'section', className, style, children, label, ...rest }, ref) {
  const { styles, editMode, selected, setSelected } = useContent();
  const key = `sec.${id}`;
  const ov = styles[key];
  const isSelected = selected && selected.path === key;
  const inline = { ...styleFromOverride(ov), ...style };
  if (!editMode) {
    if (ov && ov.hidden) return null;
    return <Tag ref={ref} id={rest.id || id} className={className} style={inline} {...rest}>{children}</Tag>;
  }
  return (
    <Tag
      ref={ref}
      id={rest.id || id}
      className={cx(className, 'cms-sec', isSelected && 'cms-sec-selected')}
      style={{ ...inline, display: undefined, opacity: ov && ov.hidden ? 0.4 : inline.opacity }}
      data-cms={key}
      data-cms-kind="section"
      {...rest}
    >
      <button
        type="button"
        className="cms-sec-chip"
        data-cms-allow
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelected({ path: key, kind: 'section', label: label || id }); }}
        title="Section settings (background colour, hide)"
      >
        ⬚ {label || id}
      </button>
      {children}
    </Tag>
  );
});

// ---------------------------------------------------------------------------
// <ListTools/> — "manage items" chip shown in edit mode next to list sections
// ---------------------------------------------------------------------------
export function ListTools({ path, label, className }) {
  const { editMode, get } = useContent();
  const { openList } = useEditorUI();
  if (!editMode) return null;
  const items = get(path, []);
  return (
    <button
      type="button"
      data-cms-allow
      className={cx('cms-list-chip', className)}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openList(path); }}
      title={`Add, remove or reorder ${label || 'items'}`}
    >
      ✎ Manage {label || 'items'} ({Array.isArray(items) ? items.length : 0})
    </button>
  );
}

export function IfEdit({ children }) {
  const { editMode } = useContent();
  return editMode ? children : null;
}

/** Read a content value with {placeholders} filled in. */
export function useText(path, vars, fallback = '') {
  const { get } = useContent();
  return tpl(get(path, fallback), vars);
}

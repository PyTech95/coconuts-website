import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContent';

// Inline click-to-edit text. In edit mode it becomes contentEditable and
// saves to /api/content on blur. Otherwise renders plain.
export const EditableText = ({ path, as: Tag = 'span', className = '', children, multiline = false }) => {
  const { editMode, saveContent } = useSiteContent();
  if (!editMode) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      data-testid={`edit-${path}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => saveContent(path, multiline ? e.target.innerText : e.target.innerText.replace(/\n/g, ' ').trim())}
      className={`${className} outline-none ring-2 ring-pink-400/70 ring-offset-2 rounded-md bg-pink-50/40 cursor-text transition`}
      title="Click to edit"
    >
      {children}
    </Tag>
  );
};

// Inline image editor. In edit mode shows an upload overlay.
export const EditableImage = ({ path, src, alt = '', className = '', imgClassName = '', ...rest }) => {
  const { editMode, saveContent, uploadImage } = useSiteContent();
  const inputRef = useRef(null);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      saveContent(path, url);
    } catch (err) { /* ignore */ }
    if (inputRef.current) inputRef.current.value = '';
  };

  if (!editMode) return <img src={src} alt={alt} className={`${className} ${imgClassName}`} {...rest} />;
  return (
    <div className={`relative group/edit ${className}`}>
      <img src={src} alt={alt} className={`${imgClassName}`} {...rest} />
      <button
        type="button"
        data-testid={`edit-img-${path}`}
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white opacity-0 group-hover/edit:opacity-100 transition rounded-[inherit]"
      >
        <ImagePlus className="w-6 h-6" />
        <span className="text-xs font-semibold">Change image</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </div>
  );
};

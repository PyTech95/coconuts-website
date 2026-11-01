const MAX_SIDE = 1600;
const KEEP_AS_IS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const loadImage = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
  img.src = url;
});

// Resizes big photos and converts phone formats (HEIC etc.) to an upload-friendly image.
export const prepareImage = async (file) => {
  if (KEEP_AS_IS.includes(file.type) && file.size <= 1.5 * 1024 * 1024) return file;
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  const type = file.type === 'image/png' || file.type === 'image/webp' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise((r) => canvas.toBlob(r, type, 0.88));
  if (!blob) throw new Error('encode failed');
  const base = (file.name || 'logo').replace(/\.[^.]+$/, '');
  return new File([blob], `${base}.${type === 'image/png' ? 'png' : 'jpg'}`, { type });
};

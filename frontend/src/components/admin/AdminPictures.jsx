import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MediaPicker, MediaPreview } from '../editor/MediaPicker';
import { useSiteContent } from '../../context/SiteContent';
import { DEFAULTS, allSectionMedia, fieldLabel, getAt, getSection, itemTitle, sectionByName, setAt } from '../../data/cms';
import { PageTitle } from './AdminLayout';

const slotName = (section, path) => {
  const parts = [];
  let cur = getSection(section);
  path.forEach((k) => {
    if (typeof k === 'number') parts.push(itemTitle(cur?.[k], k));
    else parts.push(fieldLabel(k));
    cur = cur?.[k];
  });
  return parts.join(' › ') || sectionByName(section)?.title;
};

const AdminPictures = () => {
  const { content, dataVersion, setSection, resetImage } = useSiteContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const media = useMemo(() => allSectionMedia(), [dataVersion, content.data]);
  const groups = media.reduce((acc, m) => { (acc[m.section] = acc[m.section] || []).push(m); return acc; }, {});
  const swaps = Object.entries(content.images || {});

  return (
    <div data-testid="admin-pictures-page">
      <PageTitle title="🖼️ Pictures & videos" sub="Every picture on the website. Press “Upload new photo” or “My pictures” under any of them to change it. Then press Save at the bottom." />

      {Object.entries(groups).map(([section, items]) => {
        const meta = sectionByName(section);
        return (
          <section key={section} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">{meta.emoji} {meta.title}</h2>
              <Link to={`/admin/sections?s=${section}`} className="text-sm font-semibold text-green-700 hover:underline">Open section →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(({ path, src }) => {
                const def = getAt(DEFAULTS[section], path);
                const set = (v) => setSection(section, setAt(getSection(section), path, v));
                return (
                  <div key={path.join('.')} className="bg-white rounded-2xl border-2 border-gray-100 p-3" data-testid={`picture-${section}-${path.join('-')}`}>
                    <div className="text-sm font-semibold text-gray-700 mb-2 truncate">{slotName(section, path)}</div>
                    <MediaPicker compact value={src} onChange={set} onReset={typeof def === 'string' && def !== src ? () => set(def) : undefined}
                      testid={`picture-${section}-${path.join('-')}`} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {swaps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">✏️ Pictures changed with the live editor</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {swaps.map(([orig, now]) => (
              <div key={orig} className="bg-white rounded-2xl border-2 border-gray-100 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-xs text-gray-500 mb-1">Before</div><MediaPreview src={orig} className="w-full h-24 rounded-lg opacity-60" /></div>
                  <div><div className="text-xs text-gray-500 mb-1">Now</div><MediaPreview src={now} className="w-full h-24 rounded-lg" /></div>
                </div>
                <button type="button" onClick={() => resetImage(now)} className="mt-2 text-sm font-semibold text-pink-600">↩️ Put back the original</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPictures;

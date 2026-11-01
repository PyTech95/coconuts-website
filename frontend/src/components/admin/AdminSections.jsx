import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SECTIONS, sectionByName, ALL_PAGES } from '../../data/cms';
import { SectionEditor } from '../editor/DataForm';
import { useSiteContent } from '../../context/SiteContent';
import { PageTitle } from './AdminLayout';

const GROUPS = [
  ['On every page', (s) => s.pages.includes(ALL_PAGES)],
  ['Home page', (s) => !s.pages.includes(ALL_PAGES) && s.pages.includes('/')],
  ['Other pages', (s) => !s.pages.includes(ALL_PAGES) && !s.pages.includes('/')],
];

const AdminSections = () => {
  const [params, setParams] = useSearchParams();
  const { content } = useSiteContent();
  const name = params.get('s');
  const meta = name ? sectionByName(name) : null;

  if (meta) {
    const page = meta.pages[0] === ALL_PAGES ? '/' : meta.pages[0].replace(/\/$/, '') || '/';
    return (
      <div data-testid="admin-section-page">
        <button type="button" onClick={() => setParams({})} className="mb-4 inline-flex items-center gap-2 text-[15px] font-semibold text-green-700 hover:underline" data-testid="admin-section-back">
          <ArrowLeft className="w-5 h-5" /> All sections
        </button>
        <PageTitle title={`${meta.emoji} ${meta.title}`}
          action={<a href={page === '/cities' ? '/cities/delhi' : page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"><ExternalLink className="w-4 h-4" /> See it on the website</a>} />
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-4 sm:p-6">
          <SectionEditor key={name} name={name} />
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-sections-page">
      <PageTitle title="🧩 Sections" sub="Choose a part of the website. You can change the words and pictures, and add, remove or move items." />
      {GROUPS.map(([label, test]) => {
        const list = SECTIONS.filter(test);
        if (!list.length) return null;
        return (
          <div key={label} className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((s) => (
                <button key={s.name} type="button" onClick={() => setParams({ s: s.name })} data-testid={`admin-section-${s.name}`}
                  className="text-left rounded-2xl bg-white border-2 border-gray-100 hover:border-green-500 p-4 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-gray-900">{s.emoji} {s.title}</span>
                    {content.data?.[s.name] !== undefined && <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">changed</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{s.help}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminSections;

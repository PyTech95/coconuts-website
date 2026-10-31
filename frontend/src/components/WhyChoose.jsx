import React from 'react';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';
import { getIcon } from '../cms/icons';

const WhyChoose = () => {
  const { get } = useContent();
  const items = get('whyChoose.items', []);

  return (
    <Sec id="why-choose" label="Why choose us" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <T path="whyChoose.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            <T path="whyChoose.title" as="span" /> <T path="whyChoose.titleEm" as="em" className="text-green-700 not-italic" />
          </h2>
          <T path="whyChoose.desc" as="p" className="mt-3 text-gray-600 max-w-2xl mx-auto" />
          <ListTools path="whyChoose.items" label="cards" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((w, i) => {
            const Icon = getIcon(w.icon);
            return (
              <div key={i} className="group relative rounded-3xl p-7 bg-gradient-to-br from-green-50 to-pink-50 border border-green-100 hover:border-pink-300 transition-colors overflow-hidden">
                <T path={`whyChoose.items.${i}.num`} as="div" className="absolute -top-4 -right-4 text-8xl font-display font-black text-green-100 select-none" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <T path={`whyChoose.items.${i}.title`} as="h3" className="mt-4 font-display font-bold text-xl text-gray-900" />
                  <T path={`whyChoose.items.${i}.description`} as="p" className="mt-2 text-sm text-gray-600 leading-relaxed" />
                  <T path={`whyChoose.items.${i}.tag`} as="span" className="mt-4 inline-block px-3 py-1 rounded-full bg-white border border-pink-200 text-xs font-semibold text-pink-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sec>
  );
};

export default WhyChoose;

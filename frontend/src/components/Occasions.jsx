import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';
import { tpl } from '../lib/api';

const Occasions = () => {
  const { get } = useContent();
  const [expanded, setExpanded] = useState(false);
  const items = get('occasions.items', []);
  const visible = expanded ? items : items.slice(0, 20);

  return (
    <Sec id="occasions" label="Occasions" className="section-pad bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <T path="occasions.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            <T path="occasions.title" as="span" /> <T path="occasions.titleEm" as="em" className="text-green-700 not-italic" />
          </h2>
          <T path="occasions.desc" as="p" className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed" />
          <ListTools path="occasions.items" label="occasions" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visible.map((o, i) => (
            <a key={i} href="#" className="group px-4 py-3 rounded-xl bg-white border border-green-100 hover:border-pink-300 hover:shadow-md text-sm text-gray-700 hover:text-pink-700 transition-all">
              <T path={`occasions.items.${i}`} as="span" />
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => setExpanded(!expanded)} data-cms-allow className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            {expanded ? get('occasions.showLess', 'Show Less') : tpl(get('occasions.viewAll', 'View All {count}+ Occasions'), { count: items.length })} <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </Sec>
  );
};

export default Occasions;

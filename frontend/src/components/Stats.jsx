import React from 'react';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';

const Stats = () => {
  const { get } = useContent();
  const items = get('stats.items', []);

  return (
    <Sec id="stats" label="Stats band" className="py-14 bg-gradient-to-r from-green-600 via-green-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((s, i) => (
            <div key={i} className="text-white">
              <T path={`stats.items.${i}.value`} as="div" className="font-display font-extrabold text-3xl md:text-4xl" />
              <T path={`stats.items.${i}.label`} as="div" className="text-sm md:text-base text-white/90 mt-1" />
            </div>
          ))}
        </div>
        <div className="text-center"><ListTools path="stats.items" label="stats" /></div>
      </div>
    </Sec>
  );
};

export default Stats;

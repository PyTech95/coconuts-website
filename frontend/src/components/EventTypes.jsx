import React from 'react';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';

const EventTypes = () => {
  const { get } = useContent();
  const items = get('eventTypes.items', []);

  return (
    <Sec id="event-types" label="Event types" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((e, i) => (
            <div key={i} className="coco-card group relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-pink-50 border border-green-100">
              <div className="aspect-[4/3] overflow-hidden">
                <Img path={`eventTypes.items.${i}.image`} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <T path={`eventTypes.items.${i}.title`} as="h3" className="font-display font-bold text-xl text-green-800" />
                <T path={`eventTypes.items.${i}.subtitle`} as="p" className="text-sm text-gray-600 mt-1" />
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow">
                <T path="eventTypes.badge" as="span" />
              </div>
            </div>
          ))}
        </div>
        <ListTools path="eventTypes.items" label="event type cards" />
      </div>
    </Sec>
  );
};

export default EventTypes;

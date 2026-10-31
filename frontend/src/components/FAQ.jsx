import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';

const FAQ = () => {
  const { get, editMode } = useContent();
  const items = get('faqs.items', []);

  return (
    <Sec id="faqs" label="FAQs" className="section-pad bg-gradient-to-b from-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <T path="faqs.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            <T path="faqs.title" as="span" /> <T path="faqs.titleEm" as="em" className="text-green-700 not-italic" />
          </h2>
          <ListTools path="faqs.items" label="FAQs" />
        </div>

        {editMode ? (
          /* In edit mode every answer is expanded so the text can be edited directly. */
          <div className="space-y-3">
            {items.map((f, i) => (
              <div key={i} data-testid={`faq-item-${i}`} className="bg-white border border-green-100 rounded-2xl px-5 py-4 shadow-sm">
                <T path={`faqs.items.${i}.q`} as="div" className="font-semibold text-gray-900 text-left" />
                <T path={`faqs.items.${i}.a`} as="div" className="mt-2 text-sm text-gray-600 leading-relaxed" />
              </div>
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="bg-white border border-green-100 rounded-2xl px-5 shadow-sm">
                <AccordionTrigger data-testid={`faq-trigger-${i}`} className="font-semibold text-gray-900 hover:text-pink-600 text-left">
                  <T path={`faqs.items.${i}.q`} as="span" />
                </AccordionTrigger>
                <AccordionContent data-testid={`faq-answer-${i}`} className="text-gray-600 leading-relaxed">
                  <T path={`faqs.items.${i}.a`} as="span" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Sec>
  );
};

export default FAQ;

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { FAQS } from '../data/mock';

const FAQ = () => {
  return (
    <section id="faqs" className="section-pad bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-pink-600 font-script text-2xl">Got Questions?</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Frequently Asked <em className="text-green-700 not-italic">Questions</em>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`} className="bg-white border border-green-100 rounded-2xl px-5 shadow-sm">
              <AccordionTrigger data-testid={`faq-trigger-${i}`} className="font-semibold text-gray-900 hover:text-pink-600 text-left">{f.q}</AccordionTrigger>
              <AccordionContent data-testid={`faq-answer-${i}`} className="text-gray-600 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

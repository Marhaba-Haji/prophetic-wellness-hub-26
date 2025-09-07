import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    quote: "After just three sessions of hijama therapy, my chronic back pain has reduced significantly. I've tried many treatments before, but this approach has been the most effective.",
    name: "Abdullah K.",
    title: "Back Pain Patient"
  },
  {
    quote: "I was skeptical at first, but the results speak for themselves. My migraines have decreased in frequency and intensity. The staff is professional and the facility is immaculate.",
    name: "Fatima S.",
    title: "Migraine Sufferer"
  },
  {
    quote: "As an athlete, I've found hijama therapy to be excellent for recovery and performance. It helps with muscle soreness and improves my overall energy levels.",
    name: "Ibrahim J.",
    title: "Professional Athlete"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 islamic-pattern-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Read about the experiences of those who have benefited from our professional hijama therapy services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-gray-200 bg-white/90 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-4">
                  <svg className="h-8 w-8 text-brand-gold" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="mt-auto border-t pt-4">
                  <h4 className="font-semibold text-brand-green">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

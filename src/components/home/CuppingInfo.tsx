
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Youtube } from 'lucide-react';

const CuppingInfo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-gold uppercase tracking-wider font-medium">Understanding Hijama</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">What is Cupping Therapy?</h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-4"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollArea className="h-[400px] rounded-md border p-6">
              <div className="pr-4">
                <h3 className="text-xl font-bold text-brand-green mb-4">Historical Origins</h3>
                <p className="mb-4">
                  Cupping therapy (Hijama) has a rich history spanning thousands of years across different civilizations. It was practiced in ancient Chinese, Egyptian, and Greek medicine as early as 1550 BCE.
                </p>
                <p className="mb-6">
                  In Islamic tradition, Hijama gained prominence through the teachings of Prophet Muhammad (PBUH), who recommended it as a beneficial treatment. The word "Hijama" comes from the Arabic word "hajm" meaning "sucking" or "drawing out".
                </p>
                
                <h3 className="text-xl font-bold text-brand-green mb-4">Islamic Significance</h3>
                <p className="mb-6">
                  Prophet Muhammad (PBUH) is reported to have said: "Indeed the best of remedies you have is hijama (cupping)." It has been documented in several hadith collections that the Prophet (PBUH) himself underwent cupping therapy and recommended specific days for its practice, particularly the 17th, 19th, and 21st days of the Islamic lunar month.
                </p>
                
                <h3 className="text-xl font-bold text-brand-green mb-4">Chinese Medicine Connection</h3>
                <p className="mb-6">
                  In traditional Chinese medicine, cupping has been practiced for over 2,000 years. It is believed to balance yin and yang energies within the body and to promote the flow of "qi" (life energy) through meridian pathways. Chinese practitioners typically use fire cupping methods and often combine it with acupuncture.
                </p>
                
                <h3 className="text-xl font-bold text-brand-green mb-4">Modern Practice</h3>
                <p>
                  Today, cupping therapy has gained worldwide recognition, with many variations practiced across different cultures. Modern scientific research continues to explore its benefits for pain management, blood circulation, inflammation reduction, and immune system stimulation.
                </p>
              </div>
            </ScrollArea>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-brand-green mb-4">How Hijama Works</h3>
            <p className="mb-6">
              Hijama therapy works through a systematic process that draws stagnant blood and toxins from the body while stimulating circulation and promoting healing.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold mb-2">1. Assessment</h4>
                <p>A trained practitioner examines your condition and determines appropriate cupping points based on your specific health concerns.</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold mb-2">2. Preparation</h4>
                <p>The treatment area is cleaned and sterilized. For wet cupping, small, superficial incisions are made on the skin.</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold mb-2">3. Cup Application</h4>
                <p>Special cups are placed on the skin, and suction is created either by heat or a pump. The cups remain in place for 5-15 minutes.</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold mb-2">4. Blood Extraction (Wet Cupping)</h4>
                <p>For wet cupping, the cups are removed, and blood is drawn from the small incisions, removing toxins and stagnant blood.</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold mb-2">5. Post-Treatment Care</h4>
                <p>The area is cleaned and dressed. Patients are advised on aftercare and may be given dietary recommendations.</p>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Youtube className="h-16 w-16 text-white" />
                <span className="absolute inset-0" aria-label="Hijama Cupping Therapy Demonstration Video"></span>
              </div>
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/GJTlG5z_tQs" 
                title="Understanding Hijama (Cupping) Therapy" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CuppingInfo;

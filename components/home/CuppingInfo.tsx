
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Youtube, History, BookOpen, Award, Droplet, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CuppingInfo = () => {
  const videos = [
    {
      id: "x36OxMVytrE",
      title: "Hijama (Cupping) Therapy and Mechanism of Action"
    },
    {
      id: "Vf_81igsYXY",
      title: "Understanding Hijama Benefits & Procedure"
    },
    {
      id: "aUBggfl-mkE",
      title: "Clinical Applications of Cupping Therapy"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-brand-green/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-wider font-medium bg-brand-gold/10 px-4 py-1 rounded-full">Understanding Hijama</span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 mt-3">What is Cupping Therapy?</h2>
          <div className="h-1 w-32 bg-brand-gold mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            An ancient healing practice that draws stagnant blood and toxins from the body while 
            stimulating circulation and promoting natural healing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Side - Video Gallery with Tabs */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden shadow-xl">
            <Tabs defaultValue="video1" className="w-full">
              <div className="bg-gray-50 p-4 rounded-t-xl">
                <TabsList className="w-full grid grid-cols-3 bg-brand-green/10">
                  <TabsTrigger value="video1" className="data-[state=active]:bg-brand-green data-[state=active]:text-white">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Video 1</span>
                  </TabsTrigger>
                  <TabsTrigger value="video2" className="data-[state=active]:bg-brand-green data-[state=active]:text-white">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Video 2</span>
                  </TabsTrigger>
                  <TabsTrigger value="video3" className="data-[state=active]:bg-brand-green data-[state=active]:text-white">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Video 3</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {videos.map((video, index) => (
                <TabsContent key={video.id} value={`video${index + 1}`} className="m-0">
                  <div className="relative aspect-video w-full">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="bg-white p-4">
                    <p className="font-medium text-brand-green flex items-center">
                      <Youtube className="h-5 w-5 mr-2 text-brand-gold" />
                      {video.title}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Right Side - Historical Information with Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-green rounded-full p-2">
                <History className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-green">Rich Historical Heritage</h3>
            </div>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-brand-green">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-brand-green mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-brand-gold" />
                      Historical Origins
                    </h4>
                    <p className="mb-4">
                      Cupping therapy (Hijama) has a rich history spanning thousands of years across different civilizations. 
                      It was practiced in ancient Chinese, Egyptian, and Greek medicine as early as 1550 BCE.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-brand-gold">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-brand-green mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-brand-gold" />
                      Islamic Significance
                    </h4>
                    <p className="mb-4">
                      In Islamic tradition, Hijama gained prominence through the teachings of Prophet Muhammad (PBUH), 
                      who recommended it as a beneficial treatment. The word "Hijama" comes from the Arabic word "hajm" 
                      meaning "sucking" or "drawing out".
                    </p>
                    <p className="text-gray-700 italic border-l-4 border-brand-gold pl-4 py-1 bg-brand-gold/5">
                      "Indeed the best of remedies you have is hijama (cupping)." — Prophet Muhammad (PBUH)
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-brand-green">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-brand-green mb-4 flex items-center">
                      <Droplet className="h-5 w-5 mr-2 text-brand-gold" />
                      Chinese Medicine Connection
                    </h4>
                    <p>
                      In traditional Chinese medicine, cupping has been practiced for over 2,000 years. 
                      It is believed to balance yin and yang energies within the body and to promote 
                      the flow of "qi" (life energy) through meridian pathways.
                    </p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-4 mt-6">
                  <h4 className="text-xl font-semibold text-brand-green mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-brand-gold" />
                    How Hijama Works
                  </h4>
                  
                  {[
                    {
                      step: "1. Assessment",
                      desc: "A trained practitioner examines your condition and determines appropriate cupping points based on your specific health concerns."
                    },
                    {
                      step: "2. Preparation",
                      desc: "The treatment area is cleaned and sterilized. For wet cupping, small, superficial incisions are made on the skin."
                    },
                    {
                      step: "3. Cup Application",
                      desc: "Special cups are placed on the skin, and suction is created either by heat or a pump. The cups remain in place for 5-15 minutes."
                    },
                    {
                      step: "4. Blood Extraction (Wet Cupping)",
                      desc: "For wet cupping, the cups are removed, and blood is drawn from the small incisions, removing toxins and stagnant blood."
                    },
                    {
                      step: "5. Post-Treatment Care",
                      desc: "The area is cleaned and dressed. Patients are advised on aftercare and may be given dietary recommendations."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="bg-brand-green text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-brand-green text-sm">{item.step}</h5>
                        <p className="text-gray-700 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/booking-appointment">
            <Button className="gold-gradient text-white hover:opacity-90 transition-opacity px-8 py-6 rounded-full shadow-lg">
              Book An Appointment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CuppingInfo;

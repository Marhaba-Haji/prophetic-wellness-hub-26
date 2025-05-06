
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

// Blog post data
const blogPosts = {
  "history-science-hijama": {
    title: "The History and Science of Hijama Therapy",
    date: "May 10, 2024",
    author: "Dr. Ahmed Khan",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tags: ["History", "Research", "Islamic Medicine"],
    content: `
      <p class="mb-4">Hijama therapy, also known as cupping therapy, has a rich history that dates back thousands of years. It has been practiced across many different cultures including ancient Egypt, China, and most notably in Islamic medicine where it gained significant prominence.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Historical Origins</h3>
      <p class="mb-4">The earliest recorded use of cupping therapy dates to ancient Egypt around 1550 BCE. Evidence of this practice appears in the Ebers Papyrus, one of the oldest medical textbooks in existence. In ancient Chinese medicine, cupping was documented in the Bo Shu, a silk book written in 973 BCE.</p>
      <p class="mb-4">In the Islamic world, cupping therapy gained particular significance as it was highly recommended by Prophet Muhammad (PBUH). This endorsement led to its widespread adoption throughout the Islamic world and its integration into what is now known as Prophetic Medicine (Al-Tibb al-Nabawi).</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Scientific Research</h3>
      <p class="mb-4">Modern scientific research has begun to validate many of the traditional claims about hijama therapy. Studies have shown that cupping may help:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Increase blood circulation to skin and muscles</li>
        <li class="mb-2">Relieve painful muscle tension</li>
        <li class="mb-2">Promote cell repair</li>
        <li class="mb-2">Form new blood vessels</li>
        <li class="mb-2">Reduce inflammation</li>
      </ul>
      
      <p class="mb-4">A 2012 study published in PLoS ONE showed that cupping therapy may help reduce pain and improve function in patients with neck pain. Another study from 2015 in the Journal of Traditional and Complementary Medicine demonstrated positive effects on reducing symptoms of fibromyalgia.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Prophetic Medicine Context</h3>
      <p class="mb-4">In Islamic tradition, the Prophet Muhammad (PBUH) is reported to have said: "Indeed the best of remedies you have is hijama." This hadith and others like it elevated the status of cupping therapy in Islamic medicine.</p>
      <p class="mb-4">The Islamic medical scholars like Ibn Sina (Avicenna) and Al-Razi further developed and documented cupping techniques in their medical encyclopedias. They specified the best times for cupping, the most beneficial anatomical locations, and the various health conditions that respond well to this treatment.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Modern Application</h3>
      <p class="mb-4">Today, hijama therapy is practiced worldwide, with modern practitioners combining traditional knowledge with contemporary medical understanding. Professional hijama clinics maintain strict hygiene standards and use disposable cups and equipment to ensure patient safety.</p>
      <p class="mb-4">The practice continues to gain popularity as more people seek complementary and alternative therapies to address health concerns, and as more research supports its effectiveness for specific conditions.</p>
    `
  },
  "conditions-respond-hijama": {
    title: "7 Common Conditions That Respond Well to Hijama",
    date: "April 23, 2024",
    author: "Dr. Fatima Ahmed",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tags: ["Health", "Treatment", "Conditions"],
    content: `
      <p class="mb-4">While hijama therapy has been used to treat numerous ailments throughout history, modern research and clinical experience have identified several conditions that seem to respond particularly well to this ancient treatment.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">1. Chronic Back Pain</h3>
      <p class="mb-4">Research has shown that hijama can significantly reduce pain and improve function in patients with chronic low back pain. A study published in the Journal of Alternative and Complementary Medicine found that participants who received cupping therapy reported a 70% reduction in pain after just 2 weeks.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">2. Migraine and Tension Headaches</h3>
      <p class="mb-4">Hijama applied to specific points on the upper back, neck and head has shown promising results in reducing both the frequency and intensity of migraine attacks. The therapy helps by improving blood flow to the brain and reducing muscle tension in the neck and shoulders.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">3. Rheumatoid Arthritis</h3>
      <p class="mb-4">Patients suffering from rheumatoid arthritis often experience relief from joint pain and stiffness after hijama sessions. The therapy may help by reducing inflammation and improving circulation to affected joints.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">4. High Blood Pressure</h3>
      <p class="mb-4">Some studies suggest that regular hijama therapy may help in managing hypertension by promoting relaxation and potentially affecting the body's regulation of blood pressure. However, it should be used as a complementary approach alongside conventional medical treatment.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">5. Skin Conditions</h3>
      <p class="mb-4">Conditions like eczema, psoriasis, and acne have shown improvement with hijama therapy. The increased blood circulation helps deliver nutrients to affected skin areas and may help remove toxins that contribute to these conditions.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">6. Respiratory Issues</h3>
      <p class="mb-4">Asthma, bronchitis, and allergies may be alleviated through hijama by reducing inflammation in the respiratory system and by helping to expel phlegm. Many patients report improved breathing after treatment.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">7. Anxiety and Depression</h3>
      <p class="mb-4">The relaxation effect of hijama therapy can help reduce symptoms of anxiety and depression. The therapy may influence the release of endorphins, which are natural mood elevators.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Important Considerations</h3>
      <p class="mb-4">While hijama can be beneficial for these conditions, it's important to remember that it should be used as a complementary therapy alongside conventional medical treatment. Always consult with healthcare providers before starting any new treatment regimen, especially for serious conditions.</p>
      
      <p class="mb-4">Additionally, the effectiveness of hijama therapy can vary from person to person. Some individuals may experience immediate relief, while others might require multiple sessions before noticing significant improvements.</p>
      
      <p class="mb-4">When seeking hijama treatment, always ensure that the practitioner is properly trained and follows strict hygiene protocols to minimize any risk of infection or complications.</p>
    `
  },
  "preparing-first-hijama-session": {
    title: "Preparing for Your First Hijama Session: What to Expect",
    date: "April 12, 2024",
    author: "Maryam Hassan",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tags: ["Guidance", "First-timers", "Preparation"],
    content: `
      <p class="mb-4">If you're considering hijama therapy for the first time, it's natural to feel a mix of curiosity and perhaps a little apprehension. This guide will walk you through what to expect during your first hijama session and how to prepare for the best experience.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Before Your Appointment</h3>
      
      <h4 class="text-lg font-semibold mb-2">1. Stay hydrated</h4>
      <p class="mb-4">Drink plenty of water in the days leading up to your appointment. Good hydration helps with blood flow and can make the process more effective.</p>
      
      <h4 class="text-lg font-semibold mb-2">2. Avoid certain foods</h4>
      <p class="mb-4">Try to avoid heavy, fatty foods, caffeine, and alcohol for at least 24 hours before your session. These can affect your blood consistency and overall results.</p>
      
      <h4 class="text-lg font-semibold mb-2">3. Have a light meal</h4>
      <p class="mb-4">Don't come to your appointment on an empty stomach, but avoid eating a heavy meal right before. A light meal 1-2 hours before is ideal.</p>
      
      <h4 class="text-lg font-semibold mb-2">4. Avoid strenuous activity</h4>
      <p class="mb-4">Refrain from intense exercise on the day of your appointment to avoid excessive fatigue or dehydration.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">During Your First Session</h3>
      
      <h4 class="text-lg font-semibold mb-2">1. Consultation</h4>
      <p class="mb-4">Your session will begin with a consultation where the practitioner will ask about your medical history, current health concerns, and what you hope to achieve with hijama therapy. Be honest and thorough in your responses.</p>
      
      <h4 class="text-lg font-semibold mb-2">2. Preparation</h4>
      <p class="mb-4">You'll be asked to expose only the areas where cups will be placed. For most treatments, this might be your upper back, shoulders, or specific areas related to your health concerns. Privacy and modesty will be maintained throughout.</p>
      
      <h4 class="text-lg font-semibold mb-2">3. The Cupping Process</h4>
      <p class="mb-4">For dry cupping, the practitioner will place cups on your skin and create suction. You'll feel a tight sensation where the cups are placed, but it shouldn't be painful. The cups may be left in place for 5-15 minutes.</p>
      <p class="mb-4">If you're having wet cupping (actual hijama), after the initial cupping, the practitioner will make tiny, superficial incisions before reapplying the cups to draw out a small amount of blood. This process is typically painless due to the numbing effect of the initial cupping.</p>
      
      <h4 class="text-lg font-semibold mb-2">4. Sensations to expect</h4>
      <p class="mb-4">You may experience:
        <ul class="list-disc pl-6 mb-4">
          <li class="mb-2">A pulling or stretching feeling under the cups</li>
          <li class="mb-2">A warm or tingling sensation</li>
          <li class="mb-2">Relaxation or sometimes drowsiness</li>
          <li class="mb-2">In wet cupping, a slight pinching sensation during the small incisions</li>
        </ul>
      </p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">After Your Session</h3>
      
      <h4 class="text-lg font-semibold mb-2">1. Cupping marks</h4>
      <p class="mb-4">Circular marks are normal and expected after cupping. These are not bruises but rather a therapeutic response showing stagnant blood being drawn to the surface. The marks usually fade within 3-10 days.</p>
      
      <h4 class="text-lg font-semibold mb-2">2. Aftercare</h4>
      <p class="mb-4">Your practitioner will provide specific aftercare instructions, but generally you should:
        <ul class="list-disc pl-6 mb-4">
          <li class="mb-2">Keep the area clean and dry for 24-48 hours</li>
          <li class="mb-2">Avoid showering for a few hours (or as advised)</li>
          <li class="mb-2">Avoid strenuous exercise for 24 hours</li>
          <li class="mb-2">Stay hydrated to help your body process released toxins</li>
          <li class="mb-2">Avoid extreme hot or cold temperatures (like saunas or ice baths)</li>
        </ul>
      </p>
      
      <h4 class="text-lg font-semibold mb-2">3. Possible reactions</h4>
      <p class="mb-4">Some people may experience:
        <ul class="list-disc pl-6 mb-4">
          <li class="mb-2">Temporary fatigue</li>
          <li class="mb-2">Mild lightheadedness</li>
          <li class="mb-2">Increased thirst</li>
          <li class="mb-2">In rare cases, a detoxification reaction (similar to mild flu symptoms)</li>
        </ul>
      </p>
      
      <p class="mb-4">These reactions are typically mild and short-lived, indicating that your body is responding to the treatment and beginning the healing process.</p>
      
      <h3 class="text-xl font-bold mb-3 mt-6">Follow-up Sessions</h3>
      <p class="mb-4">Your practitioner will recommend an appropriate schedule for follow-up sessions based on your specific health needs. For acute issues, sessions might be recommended weekly at first, while for maintenance or preventative care, monthly sessions may be sufficient.</p>
      
      <p class="mb-4">Remember, hijama therapy is an ancient practice with modern applications. Approaching it with an open mind and proper preparation will help you get the most benefit from this therapeutic experience.</p>
    `
  }
};

const BlogDetail = () => {
  const { blogSlug } = useParams<{blogSlug: string}>();
  const blogPost = blogSlug ? blogPosts[blogSlug as keyof typeof blogPosts] : null;

  if (!blogPost) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Blog Post Not Found</h1>
          <p className="mb-8">The blog post you are looking for does not exist or has been moved.</p>
          <Link to="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-brand-green hover:text-brand-green-light transition-colors mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">{blogPost.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600">
            <span className="flex items-center mr-6 mb-2">
              <Calendar className="h-4 w-4 mr-1" /> {blogPost.date}
            </span>
            <span className="flex items-center mr-6 mb-2">
              <User className="h-4 w-4 mr-1" /> {blogPost.author}
            </span>
            {blogPost.tags.map((tag, index) => (
              <span key={index} className="flex items-center mr-2 mb-2 bg-brand-green/10 px-2 py-1 rounded-full">
                <Tag className="h-3 w-3 mr-1" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <article className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <img 
            src={blogPost.image} 
            alt={blogPost.title}
            className="w-full h-auto rounded-lg mb-8 shadow-md"
          />
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
          
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                Share on Facebook
              </Button>
              <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                Share on Twitter
              </Button>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4">Read more articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(blogPosts)
                .filter(([key]) => key !== blogSlug)
                .slice(0, 3)
                .map(([key, post]) => (
                  <Link 
                    key={key} 
                    to={`/blog/${key}`} 
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-bold text-brand-green hover:text-brand-green-light transition-colors">{post.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{post.date}</p>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetail;

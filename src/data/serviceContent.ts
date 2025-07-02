export interface ServiceContent {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  process: string[];
  conditions: string[];
  duration: string;
  price: string;
  aftercare: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string;
}

export const serviceContent: Record<string, ServiceContent> = {
  "dry-cupping": {
    id: "dry-cupping",
    title: "Dry Cupping Therapy",
    shortDescription:
      "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension.",
    longDescription:
      "Dry cupping therapy, also known as fire cupping or vacuum cupping, is an ancient healing practice that involves placing specially designed cups on the skin to create suction. This therapeutic technique promotes blood circulation, reduces muscle tension, and helps the body's natural healing processes. Unlike wet cupping (Hijama), dry cupping does not involve any incisions, making it a completely non-invasive treatment option suitable for a wide range of health conditions.",
    benefits: [
      "Improved blood circulation and lymphatic drainage",
      "Relief from muscle tension and chronic pain",
      "Reduction in inflammation and swelling",
      "Enhanced relaxation and stress relief",
      "Improved range of motion and flexibility",
      "Faster recovery from sports injuries",
      "Detoxification through improved circulation",
      "Relief from headaches and migraines",
    ],
    process: [
      "Initial consultation to assess your health condition and needs",
      "Preparation of the treatment area with proper sanitization",
      "Placement of sterilized glass or silicone cups on targeted areas",
      "Creation of vacuum suction using fire or mechanical pump",
      "Cups remain in place for 10-20 minutes depending on condition",
      "Gentle removal of cups and post-treatment care instructions",
    ],
    conditions: [
      "Chronic back and neck pain",
      "Sports injuries and muscle strains",
      "Arthritis and joint stiffness",
      "Fibromyalgia symptoms",
      "Respiratory conditions like asthma",
      "Digestive issues and bloating",
      "Anxiety and stress-related tension",
      "Poor circulation and cold extremities",
    ],
    duration: "45-60 minutes",
    price: "₹999",
    aftercare: [
      "Stay hydrated by drinking plenty of water",
      "Avoid strenuous exercise for 24 hours",
      "Keep the treated area clean and dry",
      "Avoid exposure to cold air or air conditioning",
      "Light bruising (cupping marks) is normal and will fade in 3-7 days",
      "Apply gentle moisturizer if skin feels dry",
    ],
    seoTitle:
      "Dry Cupping Therapy in Bangalore | Professional Cupping Treatment - RevivoHeal",
    seoDescription:
      "Experience professional dry cupping therapy in Bangalore at RevivoHeal. Non-invasive treatment for pain relief, improved circulation, and muscle tension. Book your session today.",
    keywords:
      "dry cupping Bangalore, cupping therapy, fire cupping, vacuum cupping, muscle pain relief, blood circulation therapy, traditional healing Bangalore",
  },

  "wet-cupping": {
    id: "wet-cupping",
    title: "Wet Cupping (Hijama) Therapy",
    shortDescription:
      "Traditional Hijama therapy that involves creating small incisions for detoxification and healing.",
    longDescription:
      "Wet cupping, known as Hijama in Arabic, is a traditional Islamic healing practice that combines the benefits of dry cupping with controlled bloodletting. This ancient therapeutic method involves making small, superficial incisions on the skin after cupping to remove stagnant blood and toxins from the body. Hijama is mentioned in Islamic traditions as a recommended healing practice and has been used for over 1400 years to treat various health conditions naturally.",
    benefits: [
      "Deep detoxification and removal of toxins",
      "Purification of blood and improved circulation",
      "Relief from chronic pain and inflammation",
      "Strengthened immune system function",
      "Hormonal balance and regulation",
      "Improved energy levels and vitality",
      "Treatment of skin conditions and allergies",
      "Spiritual and physical purification as per Islamic tradition",
    ],
    process: [
      "Comprehensive health assessment and consultation",
      "Selection of appropriate cupping points based on condition",
      "Sterilization of equipment and treatment area",
      "Initial dry cupping to bring blood to the surface",
      "Small, sterile incisions made with disposable blades",
      "Re-application of cups to extract stagnant blood",
      "Proper disposal of extracted blood and aftercare guidance",
    ],
    conditions: [
      "High blood pressure and cardiovascular issues",
      "Diabetes and metabolic disorders",
      "Chronic headaches and migraines",
      "Skin conditions like eczema and psoriasis",
      "Fertility issues and hormonal imbalances",
      "Digestive disorders and IBS",
      "Chronic fatigue syndrome",
      "Mental health conditions like anxiety and depression",
    ],
    duration: "60-90 minutes",
    price: "₹999 - ₹1499",
    aftercare: [
      "Keep incision sites clean and dry for 24 hours",
      "Avoid swimming or bathing for 24 hours",
      "Apply prescribed antiseptic cream if needed",
      "Drink plenty of water to aid detoxification",
      "Avoid heavy lifting or strenuous exercise for 48 hours",
      "Follow dietary recommendations for optimal healing",
    ],
    seoTitle:
      "Hijama Wet Cupping Therapy in Bangalore | Traditional Islamic Healing - RevivoHeal",
    seoDescription:
      "Authentic Hijama wet cupping therapy in Bangalore following Islamic traditions. Professional bloodletting treatment for detoxification and healing. Certified practitioners.",
    keywords:
      "Hijama Bangalore, wet cupping therapy, Islamic healing, bloodletting therapy, traditional medicine, detoxification treatment, Sunnah healing Bangalore",
  },

  "sports-massage": {
    id: "sports-massage",
    title: "Sports Injury Massage",
    shortDescription:
      "Specialized massage techniques to treat and prevent sports-related injuries and improve performance.",
    longDescription:
      "Sports injury massage is a specialized form of therapeutic massage designed specifically for athletes and active individuals. This treatment combines various massage techniques including deep tissue massage, trigger point therapy, and myofascial release to address sports-related injuries, enhance performance, and prevent future injuries. Our certified therapists understand the unique demands placed on athletes' bodies and provide targeted treatment to restore optimal function and mobility.",
    benefits: [
      "Faster recovery from sports injuries",
      "Reduced muscle soreness and stiffness",
      "Improved flexibility and range of motion",
      "Enhanced athletic performance",
      "Prevention of future injuries",
      "Reduced inflammation and swelling",
      "Better circulation and oxygen delivery to muscles",
      "Stress relief and mental relaxation",
    ],
    process: [
      "Detailed assessment of injury or performance goals",
      "Evaluation of movement patterns and muscle imbalances",
      "Customized treatment plan based on specific needs",
      "Application of appropriate massage techniques",
      "Integration of stretching and mobility exercises",
      "Post-treatment recommendations and exercise prescription",
    ],
    conditions: [
      "Muscle strains and sprains",
      "Tennis elbow and golfer's elbow",
      "Runner's knee and IT band syndrome",
      "Shin splints and calf injuries",
      "Shoulder impingement and rotator cuff issues",
      "Lower back pain and sciatica",
      "Plantar fasciitis and ankle injuries",
      "Neck and upper trapezius tension",
    ],
    duration: "60-90 minutes",
    price: "₹999 - ₹2499",
    aftercare: [
      "Stay hydrated and drink plenty of water",
      "Apply ice if inflammation is present",
      "Perform recommended stretching exercises",
      "Gradually return to activity as advised",
      "Monitor symptoms and report any concerns",
      "Schedule follow-up sessions as recommended",
    ],
    seoTitle:
      "Sports Injury Massage Therapy in Bangalore | Athletic Recovery Treatment - RevivoHeal",
    seoDescription:
      "Professional sports injury massage therapy in Bangalore. Specialized treatment for athletes, injury recovery, and performance enhancement. Expert therapists available.",
    keywords:
      "sports massage Bangalore, sports injury treatment, athletic massage therapy, muscle recovery, sports physiotherapy, deep tissue massage athletes",
  },

  "oil-massage": {
    id: "oil-massage",
    title: "Deep Tissue Oil Massage",
    shortDescription:
      "Therapeutic massage that targets deeper layers of muscle and connective tissue for chronic pain relief.",
    longDescription:
      "Deep tissue oil massage is an intensive therapeutic massage technique that focuses on the deeper layers of muscle and connective tissue. Using specially selected therapeutic oils, this treatment applies sustained pressure and slow, deep strokes to target chronic muscle tension, adhesions, and knots. The combination of skilled massage techniques with nourishing oils provides both immediate relief and long-term benefits for chronic pain conditions and muscle stiffness.",
    benefits: [
      "Relief from chronic muscle pain and tension",
      "Improved posture and body alignment",
      "Increased flexibility and mobility",
      "Reduced stress and anxiety levels",
      "Better sleep quality and relaxation",
      "Enhanced circulation and lymphatic drainage",
      "Nourished and moisturized skin",
      "Release of muscle knots and adhesions",
    ],
    process: [
      "Consultation to understand pain areas and preferences",
      "Selection of appropriate therapeutic oils",
      "Preparation of treatment room with optimal temperature",
      "Application of warming techniques to prepare muscles",
      "Deep tissue massage using sustained pressure",
      "Focus on problem areas with specialized techniques",
      "Gentle cool-down and relaxation phase",
    ],
    conditions: [
      "Chronic back and neck pain",
      "Postural problems from desk work",
      "Muscle tension and stiffness",
      "Stress-related physical symptoms",
      "Poor circulation and muscle fatigue",
      "Recovery from physical strain",
      "Fibromyalgia and chronic pain syndromes",
      "Rehabilitation after injury",
    ],
    duration: "60-90 minutes",
    price: "₹1999 - ₹2499",
    aftercare: [
      "Drink water to help flush out toxins",
      "Avoid strenuous activity for 24 hours",
      "Take a warm bath to enhance relaxation",
      "Apply heat if muscles feel sore",
      "Get adequate rest and sleep",
      "Schedule regular sessions for best results",
    ],
    seoTitle:
      "Deep Tissue Oil Massage in Bangalore | Therapeutic Massage Treatment - RevivoHeal",
    seoDescription:
      "Professional deep tissue oil massage therapy in Bangalore. Chronic pain relief, muscle tension treatment with therapeutic oils. Expert massage therapists.",
    keywords:
      "deep tissue massage Bangalore, therapeutic oil massage, chronic pain relief, muscle tension therapy, relaxation massage, stress relief massage Bangalore",
  },

  "steam-bath": {
    id: "steam-bath",
    title: "Steam Bath Therapy",
    shortDescription:
      "Relaxing steam treatment that opens pores, improves circulation, and detoxifies the body.",
    longDescription:
      "Steam bath therapy is a traditional wellness treatment that uses moist heat to provide numerous health benefits. Our specialized steam chambers create the perfect environment for deep relaxation, detoxification, and healing. The combination of heat and humidity helps open pores, improve circulation, and promote the elimination of toxins through perspiration. This ancient therapy has been used across cultures for centuries to promote health, wellness, and spiritual purification.",
    benefits: [
      "Deep detoxification through increased perspiration",
      "Improved cardiovascular health and circulation",
      "Cleansed and purified skin with opened pores",
      "Relief from respiratory congestion",
      "Reduced muscle tension and joint stiffness",
      "Enhanced relaxation and stress relief",
      "Boosted immune system function",
      "Improved sleep quality and mental clarity",
    ],
    process: [
      "Pre-treatment consultation and health screening",
      "Preparation with proper hydration guidelines",
      "Entry into temperature-controlled steam chamber",
      "Gradual exposure to therapeutic steam levels",
      "Monitored session with regular check-ins",
      "Cool-down period with refreshing shower",
      "Post-treatment relaxation and rehydration",
    ],
    conditions: [
      "Poor circulation and cold extremities",
      "Respiratory conditions and sinus congestion",
      "Skin problems and clogged pores",
      "Muscle tension and joint stiffness",
      "Stress and anxiety disorders",
      "Poor sleep quality and insomnia",
      "Chronic fatigue and low energy",
      "Detoxification and cleansing needs",
    ],
    duration: "30-45 minutes",
    price: "₹750 - ₹2999 (with massage)",
    aftercare: [
      "Rehydrate with plenty of water and electrolytes",
      "Cool down gradually to room temperature",
      "Avoid alcohol and caffeine for several hours",
      "Take a lukewarm shower to remove toxins",
      "Rest and avoid strenuous activity",
      "Moisturize skin to prevent dryness",
    ],
    seoTitle:
      "Steam Bath Therapy in Bangalore | Detox Steam Treatment - RevivoHeal",
    seoDescription:
      "Rejuvenating steam bath therapy in Bangalore. Professional steam treatment for detoxification, relaxation, and health benefits. Book your wellness session.",
    keywords:
      "steam bath Bangalore, steam therapy, detox steam treatment, wellness steam bath, relaxation therapy, circulation improvement, skin detox Bangalore",
  },
};

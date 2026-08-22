// Content for Mr. Coconetto — Simply Original
// Premium, professional, trustworthy content. Genuine claims only.

export const BRAND = {
  name: 'Mr. Coconetto',
  tagline: 'Simply Original',
  brandLine: 'Mr. Coconetto – Simply Original 🥥',
  logo: 'https://customer-assets-39nsmqrw.emergentagent.net/job_a6cd0a87-081c-4bc9-846e-12b89d12507b/artifacts/deooxfs5_623830492_1285462923637157_9196147907962626499_n.jpg',
  phone: '+91-8700331212',
  phoneRaw: '918700331212',
  email: 'mrcoconetto@gmail.com',
  heroVideo: 'https://seagreen-wildcat-661243.hostingersite.com/wp-content/uploads/2026/05/0518.mp4',
};

// Build a WhatsApp deep link with an optional prefilled message.
export const waLink = (msg) =>
  `https://wa.me/${BRAND.phoneRaw}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

// Social profiles — update these to the brand's exact handles.
export const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const SOCIAL = {
  instagram: 'https://www.instagram.com/mrcoconettooffical',
  facebook: 'https://www.facebook.com/share/19M9d1JRzp/?mibextid=wwXIfr',
  youtube: 'https://www.youtube.com/@mrcoconetto',
};

export const PRODUCTS = [
  {
    slug: 'personalized-coconut',
    icon: 'Nut',
    name: 'Personalized Coconut',
    tagline: 'The signature',
    image:
      'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/c7k8zit9_image.png',
    description:
      'Fresh A+ grade tender coconut, precision-engraved with names, hashtags, logos or monograms. The heart of every Mr. Coconetto setup.',
    features: ['Names, hashtag, logo or monogram', 'A+ grade, delivered chilled', 'Min. 100 coconuts'],
  },
  {
    slug: 'coconut-stirrer',
    icon: 'Utensils',
    name: 'Customised Stirrer',
    tagline: 'Your Brand, Your Style',
    image:
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k4959rny_image.png',
    gallery: [
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k4959rny_image.png',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/0pjfdain_WhatsApp%20Image%202026-08-22%20at%202.27.55%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/rda6kk7a_WhatsApp%20Image%202026-08-22%20at%202.28.15%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/dgyfu0u1_WhatsApp%20Image%202026-08-22%20at%202.28.36%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/4v6gxvai_WhatsApp%20Image%202026-08-22%20at%202.27.54%20PM.jpeg',
    ],
    description:
      'Apne drinks ko dijiye ek premium branded experience ✨',
    features: [
      'Custom Logo & Branding',
      'Multiple Custom Designs',
      'Perfect for Cocktails, Mocktails & Beverages',
      'Ideal for Weddings, Events & Corporate Promotions',
      'Bulk Orders Available',
    ],
    note: 'Har Drink Mein Aapka Brand! 🥥',
  },
  {
    slug: 'hip-flask',
    icon: 'FlaskConical',
    name: 'Customised Hip Flask',
    tagline: 'Premium Branding',
    image:
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/cl9frbav_image.png',
    gallery: [
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/cl9frbav_image.png',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/rl2gnq2p_WhatsApp%20Image%202026-08-22%20at%202.25.28%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/wcp0vzts_WhatsApp%20Image%202026-08-22%20at%202.25.31%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/7zkge6z2_WhatsApp%20Image%202026-08-22%20at%202.25.32%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/tj3pfqi3_WhatsApp%20Image%202026-08-22%20at%202.27.24%20PM.jpeg',
    ],
    description:
      'Apne brand ko dijiye ek premium & memorable touch ✨',
    features: [
      'Custom Logo Engraving',
      'Name & Initials Customisation',
      'Premium Finish',
      'Perfect for Corporate Gifting',
      'Ideal for Events, Weddings & Promotions',
      'Bulk & Custom Orders Available',
    ],
    note: 'Your Brand. Your Style. Your Flask.',
  },
  {
    slug: 'stamp',
    icon: 'Stamp',
    name: 'Customised Stamp',
    tagline: 'Make Your Brand Stand Out',
    image:
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/h9l8rcqf_image.png',
    gallery: [
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/h9l8rcqf_image.png',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/fxfy5wsy_WhatsApp%20Image%202026-08-22%20at%202.27.29%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k7nxwyy3_WhatsApp%20Image%202026-08-22%20at%202.27.31%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/sv807sp8_WhatsApp%20Image%202026-08-22%20at%202.27.34%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/pkaqoi7c_WhatsApp%20Image%202026-08-22%20at%202.27.52%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/9z3mqf5u_WhatsApp%20Image%202026-08-22%20at%202.27.32%20PM.jpeg',
    ],
    description:
      'Apne coconut aur beverages ko dijiye ek unique branded identity ✨',
    features: [
      'Custom Logo Stamp',
      'Brand Name & Hashtag',
      'Clean & Premium Impression',
      'Perfect for Fresh Coconut Branding',
      'Ideal for Events, Weddings & Brand Promotions',
      'Bulk Orders Available',
    ],
    note: 'Aapka Logo • Aapki Branding • Aapka Style',
  },
  {
    slug: 'banta-bottle',
    icon: 'CupSoda',
    name: 'Banta Bottle',
    tagline: 'Mr Coconetto × Banta Bro',
    image:
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/kf59jvom_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM.jpeg',
    gallery: [
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/kf59jvom_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/mceb0j5y_WhatsApp%20Image%202026-08-22%20at%202.28.34%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/d8sokw25_WhatsApp%20Image%202026-08-22%20at%202.28.33%20PM.jpeg',
      'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/4hyf6i88_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM%20%281%29.jpeg',
    ],
    description:
      'Nostalgic desi banta soda in fizzy fun flavours 🥤 Taste the magic — ab chale bachpan mein!',
    features: [
      'Masala Fizz — Tangy & Fiery',
      'Kala Khatta Crush — Sweet, Sour & Satisfying',
      'Blueberry Blast — Tangy & Refreshing',
      'Lemonade — Classic & Zesty',
      'Perfect for events, parties, weddings & stalls',
      'Bulk Orders Available',
    ],
    note: 'Taste The Magic! Ab Chale Bachpan Mein 🥤',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Plans', href: '/#plans' },
  { label: 'FAQs', href: '/#faqs' },
  { label: 'Contact', href: '/#contact' },
];

export const HERO = {
  badge: 'Personalized Coconuts · Weddings, Events & Celebrations',
  heading: 'Personalized Coconuts for Weddings, Events & Celebrations',
  subheading: 'Fresh. Personalized. Unforgettable.',
  brandLine: 'Mr. Coconetto – Simply Original 🥥',
  description:
    'From personalized coconuts for weddings to customized coconuts for corporate events, we turn fresh tender coconuts into a premium welcome experience your guests remember. Carved names, stamped logos and bespoke designs — delivered chilled, pan-India.',
  primaryCta: 'Get a Quote on WhatsApp',
  secondaryCta: 'View Our Work',
  whatsappMsg:
    "Hi Mr. Coconetto! I'd like a quote for personalized coconuts for my event.",
};

export const CUSTOMIZER = {
  label: 'Make It Yours',
  title: 'Customize Your',
  script: 'Coconut',
  subtitle:
    'Type what you want printed, add your event, and see it come alive on the coconut — then submit your order.',
  image:
    'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/7wrllrc3_image.png',
  maxChars: 60,
  engraveNote:
    'Type names, initials or a #hashtag to see it live. Logos & photos are hand-engraved by our team after you order — just mention them on WhatsApp.',
};

export const MARQUEE_ITEMS = [
  'Personalized Coconuts',
  'Weddings & Engagements',
  'Haldi Ceremony',
  'Mehndi Night',
  'Birthday Parties',
  'Corporate Events',
  'Brand Promotions',
  'Baraat Swagat',
  'Destination Weddings',
  'Customized Coconut Bar',
];

export const HERO_FEATURES = [
  { icon: 'Check', text: '1000+ Events Served' },
  { icon: 'Cpu', text: 'Precision Custom Engraving' },
  { icon: 'MapPin', text: 'Pan-India Delivery' },
  { icon: 'Star', text: 'A+ Grade Coconuts' },
];

export const EVENT_TYPES = [
  {
    title: 'Wedding',
    subtitle: 'Personalized Coconuts for Your Big Day',
    image: '/images/brand/hero-1.jpg',
  },
  {
    title: 'Corporate Event',
    subtitle: 'Customized Coconuts that Impress',
    image: '/images/brand/service-5.jpg',
  },
  {
    title: 'Sangeet & Mehndi',
    subtitle: 'A Fresh, Fun Welcome Drink',
    image: '/images/brand/service-2.jpg',
  },
];

export const STATS = [
  { value: '1000+', label: 'Events Served' },
  { value: '25+', label: 'Cities Covered' },
  { value: 'Fresh', label: '& Hygienically Prepared' },
  { value: '100+', label: 'Custom Designs' },
];

export const SERVICES = [
  {
    tag: 'Wedding',
    title: 'Customized Coconut for Wedding',
    image: '/images/brand/hero-1.jpg',
    description:
      'Welcome your wedding guests with fresh, personalized coconuts carved with the couple\'s names, wedding hashtag and date.',
    customization: 'Couple names, hashtag, date, floral motifs',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Haldi',
    title: 'Personalized Coconut for Haldi',
    image: '/images/brand/service-2.jpg',
    description:
      'Add a refreshing, on-theme touch to your Haldi with customized coconuts served chilled and ready to sip.',
    customization: 'Names, marigold theme, custom tags',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Mehndi',
    title: 'Personalized Coconut for Mehndi',
    image: '/images/brand/service-6.jpg',
    description:
      'Green, vibrant and Instagram-ready — customized coconuts that match your Mehndi night decor beautifully.',
    customization: 'Mehndi motifs, names, event date',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Birthday',
    title: 'Personalized Coconut for Birthdays',
    image: '/images/brand/service-4.jpg',
    description:
      'Make every birthday extra special with fresh coconuts engraved with the name, age and a fun message.',
    customization: 'Name, age, message, theme colours',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Corporate',
    title: 'Customized Coconut for Corporate Events',
    image: '/images/brand/service-5.jpg',
    description:
      'A healthy, premium welcome drink for conferences and offsites — coconuts stamped with your company logo.',
    customization: 'Company logo, tagline, event branding',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Promotions',
    title: 'Coconut Bar for Brand Promotions',
    image: '/images/brand/service-3.jpg',
    description:
      'Turn heads at launches and expos with a live customized coconut bar branded end-to-end for your campaign.',
    customization: 'Logo engraving, branded cart, staff',
    minOrder: 'Min. 150 coconuts',
  },
  {
    tag: 'Baraat',
    title: 'Baraat Swagat & Wedding Welcome',
    image: '/images/brand/hero-2.jpg',
    description:
      'A refreshing coconut welcome for the baraat — the perfect coconut for wedding welcome moments in the heat.',
    customization: 'Names, welcome message, decor tags',
    minOrder: 'Min. 100 coconuts',
  },
  {
    tag: 'Destination',
    title: 'Destination Weddings',
    image: '/images/brand/hero-3.jpg',
    description:
      'Pan-India delivery to destination venues — Udaipur, Goa, Jaipur and more — with fresh, personalized coconuts.',
    customization: 'Full-service setup & CocoBoys',
    minOrder: 'Min. 100 coconuts',
  },
];

export const PLANS = [
  {
    name: 'Gold Plan',
    subtitle: 'Basic Starter Plan',
    highlight: false,
    description: 'Personalized coconuts delivered fresh to your venue — perfect for smaller, self-managed setups.',
    features: [
      'Premium personalized coconuts — A+ grade & chilled',
      'Choice of engraving: names, hashtag or logo',
      'Opener / punching key for easy serving',
      'Safe, timely delivery to your city or venue',
    ],
    note: 'Serving staff, table/counter setup and décor to be managed by your team.',
    footer: 'Ideal for those who want fresh personalized coconuts without on-site service.',
    minimum: 'Minimum 100 Coconuts',
  },
  {
    name: 'Diamond Plan',
    subtitle: 'Full-Service Experience',
    highlight: true,
    badge: 'Most Preferred',
    description: 'Personalized coconuts plus trained staff to serve — you enjoy the event, we handle the rest.',
    features: [
      'Everything in the Gold Plan',
      'Personalized coconuts with bespoke engraving',
      'Well-groomed, trained CocoBoys for serving & counter',
      'Logistics, travel & stay of the team handled by us',
    ],
    note: 'Table & counter to be provided by your team.',
    footer: 'Transport, stay, food & travel — every detail handled by the Mr. Coconetto team.',
    minimum: 'Minimum 100 Coconuts',
  },
  {
    name: 'Platinum Plan',
    subtitle: 'Our Most Loved, Luxury Choice',
    highlight: false,
    description: 'A truly hassle-free, premium coconut bar experience — the top choice of wedding planners.',
    features: [
      'Everything in the Diamond Plan',
      'Signature Live Coco Cart with designer décor',
      'Personalized coconuts with bespoke engraving',
      'Complete setup, serving & counter management',
    ],
    note: '',
    footer: 'From setup and serving to travel and transport — every detail handled flawlessly.',
    minimum: 'Minimum 100 Coconuts',
  },
];

export const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Jaipur', 'Chandigarh', 'Pune',
  'Agra', 'Ahmedabad', 'Alibagh', 'Bhopal', 'Chennai', 'Indore',
  'Jaisalmer', 'Jodhpur', 'Kanpur', 'Kolkata', 'Lucknow', 'Ludhiana',
  'Mussoorie', 'Nagpur', 'Patna', 'Surat', 'Udaipur', 'Vadodara',
];

export const WHY_CHOOSE = [
  {
    num: '01',
    icon: 'Cpu',
    title: 'Precision Custom Engraving',
    description: 'Refined, intricate engraving on every coconut — from names and hashtags to monograms, logos and floral motifs.',
    tag: 'Signature Craft',
  },
  {
    num: '02',
    icon: 'Award',
    title: 'A+ Grade Quality',
    description: 'Every coconut is A+ grade, handpicked for freshness, sweetness and water volume — and delivered chilled.',
    tag: 'Premium Quality',
  },
  {
    num: '03',
    icon: 'Clock',
    title: 'On-Time Delivery',
    description: 'Our logistics team ensures your personalized coconuts reach the venue fresh, chilled and exactly on schedule.',
    tag: 'Reliable',
  },
  {
    num: '04',
    icon: 'Palette',
    title: '100+ Design Options',
    description: 'From carved monograms and stamped logos to pull-tab openings — 100+ styles to match your event theme.',
    tag: 'Fully Custom',
  },
  {
    num: '05',
    icon: 'Globe',
    title: 'Pan-India Presence',
    description: 'Serving 25+ cities across India — from destination weddings to corporate events, we deliver everywhere.',
    tag: 'Pan-India Reach',
  },
  {
    num: '06',
    icon: 'Trophy',
    title: 'Trusted by 1000+ Events',
    description: 'From intimate celebrations to grand weddings, Mr. Coconetto is a trusted name for customized coconut bars.',
    tag: 'Trusted Brand',
  },
];

export const OCCASIONS = [
  'Anniversary Celebration', 'Award Ceremony', 'Baby Shower', 'Birthday Party',
  'Corporate Events', 'Engagement Function', 'Festival Parties', 'Get Together',
  'Grand Opening', 'House Warming', 'Kitty Party', 'Networking Events',
  'Office Parties', 'Pool / Beach Party', 'Promotional Events', 'Reunions',
  'Wedding Ceremony', 'Wedding Favour', 'Wedding Invitation', 'Welcome Drink',
];

export const TESTIMONIALS = [
  { name: 'Aditya Raj', city: 'Hyderabad', text: 'We loved the creative, customized coconut concept. Absolutely refreshing, and the team\'s service was top-notch.' },
  { name: 'Aakansha & Avinash', city: 'Chandigarh', text: 'You made our wedding functions so stylish with personalized coconuts. Thank you for making our day unforgettable.' },
  { name: 'Ajit Singh', city: 'Jodhpur', text: 'We sent stamped coconut water as a wedding favour and everyone loved the concept. Beautifully done!' },
  { name: 'Bharti Singh', city: 'Agra', text: 'Great attention to detail and a creative approach. They helped set a new trend at our wedding. Very professional!' },
  { name: 'Aditya Khandelwal', city: 'Udaipur', text: 'A refreshing new concept. The customized coconuts looked amazing and truly elevated our function.' },
  { name: 'Priya Mathur', city: 'Delhi', text: 'Such an attractive welcome drink for guests — everyone loved the unique concept and top-quality tender coconuts.' },
];

export const FAQS = [
  {
    q: 'What is the minimum order for personalized coconuts?',
    a: 'Our minimum order is 100 personalized coconuts per event. This helps us maintain premium A+ grade quality and freshness for every celebration.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'We recommend booking 15–20 days in advance for the best design customization and planning. Last-minute requests are accommodated based on availability.',
  },
  {
    q: 'Do you offer pan-India delivery?',
    a: 'Yes. We deliver customized coconuts across 25+ cities in India including Delhi, Mumbai, Hyderabad, Bangalore, Jaipur, Pune and Chandigarh, plus popular destination-wedding hubs.',
  },
  {
    q: 'What can you customize on the coconut?',
    a: 'We offer 100+ design options including names, wedding hashtags, dates, company logos, monograms and floral motifs — all with precision custom engraving.',
  },
  {
    q: 'Are the coconuts fresh and hygienic?',
    a: 'Absolutely. Every coconut is A+ grade tender coconut, handpicked for sweetness and water volume, and delivered chilled with complete hygiene in every serve.',
  },
  {
    q: 'What is included in each plan?',
    a: 'The Gold plan includes personalized coconuts, straws and an opener. The Diamond plan adds trained CocoBoys for serving. The Platinum plan is a full-service experience with our signature Live Coco Cart.',
  },
];

export const ABOUT = {
  label: 'About Us',
  titleLine1: "We Don't Just",
  titleLine2: 'Serve Coconuts.',
  script: 'We Create Experiences.',
  intro:
    'Mr. Coconetto — Simply Original is a premium personalized coconut brand, redefining the way coconuts are presented at weddings, corporate events, celebrations and luxury occasions across India.',
  mascot:
    'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/5qzjsptm_image.png',
  product:
    'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/c7k8zit9_image.png',
  story:
    'What started with a simple belief — that a natural fruit could become a premium experience — has grown into a trusted name for customized coconut bars. We combine fresh A+ grade tender coconuts with precision custom engraving and professional service to make every occasion memorable.',
  promise: [
    'Fresh Quality — handpicked A+ grade coconuts, delivered chilled',
    'Premium Presentation — designer setups and a signature coconut bar',
    'Personalized Designs — names, logos and 100+ custom options',
    'Professional Service — trained team and reliable logistics',
    'Pan-India Reach — 25+ cities and destination venues',
  ],
  points: [
    {
      icon: 'Sparkles',
      title: 'Customised to Perfection',
      description:
        'From personalized names & hashtags to premium logo branding and bespoke designs, every coconut is crafted to make your occasion different, memorable and unmistakably yours.',
    },
    {
      icon: 'Leaf',
      title: 'Freshness You Can Trust',
      description:
        'We use only handpicked, farm-fresh coconuts ensuring natural taste, maximum freshness and complete hygiene in every serve.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Customized Coconut Bar Experience',
      description:
        'Our signature setups combine premium presentation, creative concepts and professional service — turning a simple coconut into an experience your guests remember.',
    },
  ],
  badges: [
    { icon: 'Leaf', label: 'Fresh' },
    { icon: 'PencilRuler', label: 'Customised' },
    { icon: 'ShieldCheck', label: 'Hygienic' },
    { icon: 'Gem', label: 'Premium' },
  ],
};

export const ABOUT_STATS = [
  { icon: 'Star', value: '1000+', label: 'Events Served' },
  { icon: 'MapPin', value: '25+', label: 'Cities Pan India' },
  { icon: 'Smile', value: 'Fresh', label: '& Hygienically Prepared' },
  { icon: 'Users', value: '100+', label: 'Custom Designs' },
];

export const FOUNDER = {
  name: 'Rupesh Gaur',
  role: 'Founder, Mr. Coconetto',
  photo:
    'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/3hfipv2r_image.png',
  bio:
    'Started with a simple belief — to turn a natural fruit into a premium experience. Today, Mr. Coconetto is a trusted name for customized coconut bars across India.',
};

export const CONTACT = {
  heading: 'Get a Personalized Coconut Quote',
  subheading:
    'Tell us about your event and we\'ll share a custom quote. Prefer chatting? Get a quote on WhatsApp or call us directly.',
  eventTypes: [
    'Wedding', 'Haldi', 'Mehndi', 'Sangeet', 'Birthday',
    'Corporate Event', 'Brand Promotion', 'Baraat Swagat',
    'Destination Wedding', 'Other',
  ],
};

// ---- Blog ----
export const BLOGS = [
  {
    slug: '10-unique-wedding-coconut-ideas',
    title: '10 Unique Wedding Coconut Ideas for Your Big Day',
    excerpt: 'Personalized coconuts are the freshest wedding trend in India. Here are 10 creative ways to use customized coconuts across your wedding functions.',
    image: '/images/brand/hero-1.jpg',
    date: '2026-06-01',
    readTime: '5 min read',
    keywords: ['Wedding Coconut', 'Personalized Coconut for Weddings', 'Customized Coconut for Wedding'],
    content: [
      { type: 'p', text: 'A personalized coconut is more than a welcome drink — it is a keepsake your guests remember. From carved monograms to your wedding hashtag, customized coconuts add a fresh, tropical touch to every function.' },
      { type: 'h', text: '1. Couple Monogram Coconuts' },
      { type: 'p', text: 'Engrave the couple\'s initials for an elegant, timeless look at the mandap or welcome counter.' },
      { type: 'h', text: '2. Wedding Hashtag Coconuts' },
      { type: 'p', text: 'Add your wedding hashtag so guests can snap and share — a personalized coconut for weddings that doubles as social buzz.' },
      { type: 'h', text: '3–10. More Ideas' },
      { type: 'ul', items: ['Haldi-themed marigold coconuts', 'Baraat Swagat welcome coconuts', 'Sangeet night neon tags', 'Mehndi green-motif coconuts', 'Guest name coconuts as favours', 'Live coconut bar with CocoBoys', 'Destination-wedding chilled coconuts', 'Floral engraving to match decor'] },
      { type: 'p', text: 'Want a custom design for your date and venue? Get a quote on WhatsApp and our team will help you plan the perfect wedding coconut experience.' },
    ],
  },
  {
    slug: 'personalized-coconut-for-weddings-guide',
    title: 'Personalized Coconut for Weddings – Everything You Need to Know',
    excerpt: 'A complete guide to personalized coconuts for weddings — designs, minimum order, freshness, delivery and how to book across India.',
    image: '/images/brand/hero-2.jpg',
    date: '2026-05-24',
    readTime: '6 min read',
    keywords: ['Personalized Coconut for Weddings', 'Personalized Coconut India', 'Wedding Coconut'],
    content: [
      { type: 'p', text: 'Personalized coconuts have become a signature welcome experience at Indian weddings. Here is everything you need to know before booking.' },
      { type: 'h', text: 'What is a personalized coconut?' },
      { type: 'p', text: 'It is a fresh A+ grade tender coconut, custom-engraved with names, your wedding hashtag, date or a floral motif, and served chilled with a straw.' },
      { type: 'h', text: 'Minimum order and booking' },
      { type: 'p', text: 'The typical minimum order is 100 coconuts. We recommend booking 15–20 days in advance for the best customization.' },
      { type: 'h', text: 'Freshness and delivery' },
      { type: 'p', text: 'Every coconut is handpicked, delivered chilled, and available pan-India — including destination-wedding hubs like Udaipur, Goa and Jaipur.' },
    ],
  },
  {
    slug: 'best-wedding-welcome-drink-ideas-india',
    title: 'Best Wedding Welcome Drink Ideas in India',
    excerpt: 'From coconut water to mocktails — the best wedding welcome drink ideas, and why a personalized coconut for wedding welcome stands out.',
    image: '/images/brand/hero-3.jpg',
    date: '2026-05-18',
    readTime: '4 min read',
    keywords: ['Coconut for Wedding Welcome', 'Wedding Coconut', 'Personalized Coconut'],
    content: [
      { type: 'p', text: 'A great welcome drink sets the tone for your celebration. Here are refreshing ideas that work beautifully in Indian weather.' },
      { type: 'ul', items: ['Personalized tender coconut water (a crowd favourite)', 'Fresh fruit mocktails', 'Aam panna and jaljeera shots', 'Rose and kesar sherbet'] },
      { type: 'h', text: 'Why choose a personalized coconut?' },
      { type: 'p', text: 'A customized coconut for wedding welcome is natural, hydrating and photogenic — and the engraving makes it uniquely yours.' },
    ],
  },
  {
    slug: 'customized-coconuts-for-wedding-guests',
    title: 'Customized Coconuts for Wedding Guests',
    excerpt: 'Turn a simple welcome drink into a memorable favour with customized coconuts for your wedding guests.',
    image: '/images/brand/service-2.jpg',
    date: '2026-05-10',
    readTime: '4 min read',
    keywords: ['Customized Coconut', 'Wedding Coconut', 'Personalized Coconut for Weddings'],
    content: [
      { type: 'p', text: 'Guests remember thoughtful details. A customized coconut — engraved with their name or your monogram — is both a refreshing drink and a keepsake.' },
      { type: 'h', text: 'Ideas that guests love' },
      { type: 'ul', items: ['Guest-name coconuts at the entrance', 'Monogram coconuts as table favours', 'Hashtag coconuts for social media', 'Themed engraving matching your decor'] },
    ],
  },
  {
    slug: 'personalized-coconut-for-haldi-mehndi',
    title: 'Personalized Coconut for Haldi & Mehndi',
    excerpt: 'How personalized coconuts elevate your Haldi and Mehndi functions with fresh, on-theme, Instagram-ready presentation.',
    image: '/images/brand/service-6.jpg',
    date: '2026-05-03',
    readTime: '4 min read',
    keywords: ['Personalized Coconut for Haldi & Mehndi', 'Customized Coconut', 'Wedding Coconut'],
    content: [
      { type: 'p', text: 'Haldi and Mehndi are colourful, joyful functions — and a personalized coconut fits right in.' },
      { type: 'h', text: 'Haldi' },
      { type: 'p', text: 'Marigold-themed customized coconuts served chilled keep everyone refreshed during daytime celebrations.' },
      { type: 'h', text: 'Mehndi' },
      { type: 'p', text: 'Green, vibrant engraving matches the Mehndi decor beautifully and photographs wonderfully.' },
    ],
  },
  {
    slug: 'customized-coconut-for-corporate-events',
    title: 'Customized Coconut for Corporate Events',
    excerpt: 'A healthy, premium welcome for conferences and offsites — customized coconuts branded with your company logo.',
    image: '/images/brand/service-5.jpg',
    date: '2026-04-26',
    readTime: '4 min read',
    keywords: ['Customized Coconut for Corporate Events', 'Coconut Bar for Events', 'Customized Coconut'],
    content: [
      { type: 'p', text: 'Corporate guests appreciate a healthy, premium welcome. A customized coconut branded with your logo makes a strong first impression.' },
      { type: 'ul', items: ['Logo-engraved coconuts for conferences', 'Branded live coconut bar for expos', 'Healthy alternative to sugary welcome drinks', 'Great for product launches and offsites'] },
    ],
  },
  {
    slug: 'baraat-swagat-ideas',
    title: 'Baraat Swagat Ideas',
    excerpt: 'Fresh, fun and hydrating Baraat Swagat ideas — including the coconut for wedding welcome that guests love.',
    image: '/images/brand/hero-2.jpg',
    date: '2026-04-19',
    readTime: '3 min read',
    keywords: ['Baraat Swagat', 'Coconut for Wedding Welcome', 'Wedding Coconut'],
    content: [
      { type: 'p', text: 'The baraat arrives energised — and often thirsty. A refreshing coconut welcome is the perfect swagat.' },
      { type: 'ul', items: ['Chilled personalized coconuts at the entrance', 'Welcome-message engraving', 'Live coconut cart with CocoBoys', 'Themed tags matching your decor'] },
    ],
  },
  {
    slug: 'personalized-coconut-vs-traditional-welcome-drinks',
    title: 'Personalized Coconut vs Traditional Wedding Welcome Drinks',
    excerpt: 'How does a personalized coconut compare to traditional welcome drinks? A quick, honest comparison.',
    image: '/images/brand/service-4.jpg',
    date: '2026-04-12',
    readTime: '4 min read',
    keywords: ['Personalized Coconut', 'Wedding Coconut', 'Coconut for Wedding Welcome'],
    content: [
      { type: 'p', text: 'Both have their place. Here is a simple comparison to help you decide.' },
      { type: 'h', text: 'Traditional welcome drinks' },
      { type: 'p', text: 'Familiar and easy to serve, but often sugary and not very memorable.' },
      { type: 'h', text: 'Personalized coconut' },
      { type: 'p', text: 'Natural and hydrating, photogenic, and personalized to your event — a keepsake as much as a drink.' },
    ],
  },
  {
    slug: 'how-to-choose-personalized-coconut-design',
    title: 'How to Choose the Right Personalized Coconut Design',
    excerpt: 'Names, hashtags, monograms or logos? A practical guide to choosing the right personalized coconut design.',
    image: '/images/brand/service-3.jpg',
    date: '2026-04-05',
    readTime: '4 min read',
    keywords: ['Personalized Coconut', 'Customized Coconut', 'Personalized Coconut India'],
    content: [
      { type: 'p', text: 'The right design depends on your event and theme. Here is how to choose.' },
      { type: 'ul', items: ['Weddings: couple names, monogram or hashtag', 'Corporate: company logo and tagline', 'Birthdays: name, age and a fun message', 'Match engraving style to your decor colours'] },
      { type: 'p', text: 'Not sure? Share your theme on WhatsApp and we will suggest a design.' },
    ],
  },
  {
    slug: 'personalized-coconut-delivery-across-india',
    title: 'Personalized Coconut Delivery Across India',
    excerpt: 'How pan-India personalized coconut delivery works — cities we serve, freshness and destination weddings.',
    image: '/images/brand/hero-3.jpg',
    date: '2026-03-29',
    readTime: '4 min read',
    keywords: ['Personalized Coconut India', 'Customized Coconut Delhi', 'Personalized Coconut Mumbai'],
    content: [
      { type: 'p', text: 'We deliver personalized coconuts across 25+ cities in India, keeping them fresh and chilled from farm to venue.' },
      { type: 'h', text: 'Cities we serve' },
      { type: 'p', text: 'Delhi, Mumbai, Hyderabad, Bangalore, Jaipur, Chandigarh, Pune and many more — including destination-wedding hubs like Udaipur and Goa.' },
      { type: 'h', text: 'Freshness in transit' },
      { type: 'p', text: 'Careful logistics ensure your customized coconuts arrive fresh, chilled and exactly on schedule.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// DEFAULT SITE CONTENT — Mr. Coconetto
// Every text, image, video, list and colour on the site lives here.
// The admin "Backend Editor" and the on-page "Live Editor" edit a copy of this
// object which is stored in the database (GET/PUT /api/content). Anything that
// is NOT yet saved in the DB falls back to the values below.
// ---------------------------------------------------------------------------

export const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const DEFAULT_CONTENT = {
  brand: {
    name: 'Mr. Coconetto',
    tagline: 'Simply Original',
    brandLine: 'Mr. Coconetto – Simply Original 🥥',
    logo: '/images/brand/mr-coconetto-logo.png',
    phone: '+91-8700331212',
    phoneRaw: '918700331212',
    email: 'mrcoconetto@gmail.com',
    address: 'Delhi (HQ)',
    addressLong: 'Delhi (HQ) · Pan-India Delivery',
  },

  social: {
    instagram: 'https://www.instagram.com/mrcoconettooffical',
    instagramHandle: '@mrcoconettooffical',
    facebook: 'https://www.facebook.com/share/19M9d1JRzp/?mibextid=wwXIfr',
    youtube: 'https://www.youtube.com/@mrcoconetto',
  },

  seo: {
    title: 'Mr. Coconetto | Personalized Coconuts for Weddings, Events & Celebrations',
    description:
      'Mr. Coconetto – Simply Original. Personalized coconuts for weddings, events & celebrations. Customized coconut engraving with names, hashtags & logos. Fresh, A+ grade, pan-India delivery.',
    keywords: 'Personalized Coconut, Customized Coconut, Personalized Coconut for Weddings, Wedding Coconut, Coconut Bar for Events, Customized Coconut for Corporate Events, Personalized Coconut India, Customized Coconut Delhi, Coconut for Wedding Welcome',
  },

  header: {
    supportLabel: 'Support',
    quoteBtn: 'Request a Quote',
    quoteMsg: 'Hi Mr. Coconetto! I would like to request a quote for personalized coconuts.',
    navLinks: [
      { label: 'Home', href: '/#home' },
      { label: 'About Us', href: '/#about' },
      { label: 'Services', href: '/#services' },
      { label: 'Plans', href: '/#plans' },
      { label: 'FAQs', href: '/#faqs' },
      { label: 'Contact', href: '/#contact' },
    ],
    pageLinks: [
      { label: 'Customize', href: '/customize' },
      { label: 'Products', href: '/products' },
      { label: 'Cities', href: '/cities' },
      { label: 'Blog', href: '/blog' },
    ],
  },

  hero: {
    // Slider: images animate with a slow zoom (Ken Burns); videos play muted and
    // move to the next slide when they end. Durations are in seconds.
    slides: [
      {
        id: 's1',
        type: 'image',
        src: '/images/brand/hero-1.jpg',
        kicker: 'Weddings · Haldi · Mehndi',
        title: 'Personalized Coconuts for',
        titleAccent: 'Weddings & Celebrations',
        subtitle: 'Fresh A+ grade tender coconuts, hand-engraved with names, hashtags and logos — delivered chilled, pan-India.',
        duration: 6,
      },
      {
        id: 's2',
        type: 'video',
        src: '/videos/hero-clip-1.mp4',
        poster: '/images/brand/service-2.jpg',
        kicker: 'Live Coconut Bar',
        title: 'A Welcome Drink',
        titleAccent: 'Your Guests Remember',
        subtitle: 'Signature Live Coco Cart with trained CocoBoys serving every guest in style.',
        duration: 6,
      },
      {
        id: 's3',
        type: 'image',
        src: '/images/brand/hero-3.jpg',
        kicker: 'Destination Weddings',
        title: 'From Udaipur to Goa,',
        titleAccent: 'We Deliver Everywhere',
        subtitle: 'Serving 25+ cities across India — destination venues included.',
        duration: 6,
      },
      {
        id: 's4',
        type: 'video',
        src: '/videos/hero-clip-2.mp4',
        poster: '/images/brand/service-4.jpg',
        kicker: 'Corporate & Brand Events',
        title: 'Your Logo,',
        titleAccent: 'On Every Coconut',
        subtitle: 'Precision custom engraving for launches, conferences and brand promotions.',
        duration: 6,
      },
      {
        id: 's5',
        type: 'image',
        src: '/images/brand/service-6.jpg',
        kicker: 'Simply Original',
        title: 'Fresh. Personalized.',
        titleAccent: 'Unforgettable.',
        subtitle: '1000+ events served with 100+ custom designs — crafted for your celebration.',
        duration: 6,
      },
    ],
    brandLine: 'Mr. Coconetto – Simply Original 🥥',
    primaryCta: 'Get a Quote on WhatsApp',
    secondaryCta: 'View Our Work',
    secondaryHref: '#services',
    whatsappMsg: "Hi Mr. Coconetto! I'd like a quote for personalized coconuts for my event.",
    marquee: [
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
    ],
    chips: [
      { icon: 'Star', text: 'A+ Grade · Chilled & Fresh' },
      { icon: 'Trophy', text: '1000+ Events Served' },
      { icon: 'MapPin', text: '25+ Cities · Pan-India' },
    ],
    features: [
      { icon: 'Check', text: '1000+ Events Served' },
      { icon: 'Cpu', text: 'Precision Custom Engraving' },
      { icon: 'MapPin', text: 'Pan-India Delivery' },
      { icon: 'Star', text: 'A+ Grade Coconuts' },
    ],
  },

  customizer: {
    label: 'Make It Yours',
    title: 'Customize Your',
    script: 'Coconut',
    subtitle: 'Type what you want printed, add your event, and see it come alive on the coconut — then submit your order.',
    image: 'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/7wrllrc3_image.png',
    maxChars: 60,
    engraveNote:
      'Type names, initials or a #hashtag to see it live. Logos & photos are hand-engraved by our team after you order — just mention them on WhatsApp.',
    ui: {
      previewBadge: 'Live Preview',
      dragHint: 'Drag text or logo to reposition',
      printLabel: 'Print on Coconut',
      printHint: '(optional if you add a logo · press Enter for a new line · max {max})',
      printPlaceholder: 'e.g.\nRadha\nand\nRupesh',
      eventLabel: 'Event Name',
      eventPlaceholder: "e.g. Priya & Rohan's Sangeet",
      mobileLabel: 'Mobile Number',
      mobilePlaceholder: '+91 98xxxxxxxx',
      logoLabel: 'Add a Logo / Image',
      logoHint: '(optional — PNG, JPG · max 5MB)',
      uploadBtn: 'Upload your logo or artwork',
      footnote: "You'll get an order number instantly. We'll call you to confirm production & payment.",
      submitBtn: 'Submit Order',
      submitting: 'Submitting…',
      successTitle: 'Order Received!',
      successSub: 'Your order number is',
      successText: "We've opened WhatsApp so you can confirm production & payment. Our team will also call you shortly.",
      openWhatsapp: 'Open WhatsApp',
      designAnother: 'Design Another Coconut',
    },
  },

  eventTypes: {
    badge: 'Popular',
    items: [
      { title: 'Wedding', subtitle: 'Personalized Coconuts for Your Big Day', image: '/images/brand/hero-1.jpg' },
      { title: 'Corporate Event', subtitle: 'Customized Coconuts that Impress', image: '/images/brand/service-5.jpg' },
      { title: 'Sangeet & Mehndi', subtitle: 'A Fresh, Fun Welcome Drink', image: '/images/brand/service-2.jpg' },
    ],
  },

  stats: {
    items: [
      { value: '1000+', label: 'Events Served' },
      { value: '25+', label: 'Cities Covered' },
      { value: 'Fresh', label: '& Hygienically Prepared' },
      { value: '100+', label: 'Custom Designs' },
    ],
  },

  about: {
    label: 'About Us',
    titleLine1: "We Don't Just",
    titleLine2: 'Serve Coconuts.',
    script: 'We Create Experiences.',
    intro:
      'Mr. Coconetto — Simply Original is a premium personalized coconut brand, redefining the way coconuts are presented at weddings, corporate events, celebrations and luxury occasions across India.',
    mascot: 'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/5qzjsptm_image.png',
    product: 'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/c7k8zit9_image.png',
    chip: 'A+ Grade · Chilled & Fresh',
    story:
      'What started with a simple belief — that a natural fruit could become a premium experience — has grown into a trusted name for customized coconut bars. We combine fresh A+ grade tender coconuts with precision custom engraving and professional service to make every occasion memorable.',
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
        description: 'We use only handpicked, farm-fresh coconuts ensuring natural taste, maximum freshness and complete hygiene in every serve.',
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
    stats: [
      { icon: 'Star', value: '1000+', label: 'Events Served' },
      { icon: 'MapPin', value: '25+', label: 'Cities Pan India' },
      { icon: 'Smile', value: 'Fresh', label: '& Hygienically Prepared' },
      { icon: 'Users', value: '100+', label: 'Custom Designs' },
    ],
    founder: {
      kicker: 'Meet the Founder',
      name: 'Rupesh Gaur',
      role: 'Founder, Mr. Coconetto',
      photo: 'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/3hfipv2r_image.png',
      bio: 'Started with a simple belief — to turn a natural fruit into a premium experience. Today, Mr. Coconetto is a trusted name for customized coconut bars across India.',
    },
  },

  video: {
    kicker: 'See Us In Action',
    title: 'Our',
    titleEm: 'Customized Coconut Bar',
    titleAfter: 'Experience',
    desc: 'Watch how Mr. Coconetto transforms every event into a fresh, personalized experience — from precision custom engraving to chilled coconuts served by our trained CocoBoys.',
    watchBtn: 'Watch Now',
    youtubeLabel: 'Watch on YouTube',
    youtubeUrl: 'https://www.youtube.com/@mrcoconetto',
    src: '/videos/hero-clip-1.mp4',
    poster: '/images/brand/service-2.jpg',
  },

  services: {
    kicker: 'What We Do',
    title: 'Personalized Coconuts for',
    titleEm: 'Every Occasion',
    desc: 'From weddings and Haldi to corporate events and brand promotions — customized coconuts, crafted for your celebration.',
    quoteBtn: 'Get a Quote',
    storyBtn: 'Read Full Story',
    customizationLabel: 'Customization:',
    storyBackLabel: '← All services',
    storyCustomizationLabel: 'Customization',
    storyMinOrderLabel: 'Order Minimum',
    storyWaBtn: 'Get a Quote on WhatsApp',
    storyCustomizeBtn: 'Customize Your Coconut',
    storyMoreTitle: 'More services',
    storyReadMore: 'Read story',
    items: [
      { tag: 'Wedding', title: 'Customized Coconut for Wedding', image: '/images/brand/hero-1.jpg', description: "Welcome your wedding guests with fresh, personalized coconuts carved with the couple's names, wedding hashtag and date.", customization: 'Couple names, hashtag, date, floral motifs', minOrder: 'Min. 100 coconuts' },
      { tag: 'Haldi', title: 'Personalized Coconut for Haldi', image: '/images/brand/service-2.jpg', description: 'Add a refreshing, on-theme touch to your Haldi with customized coconuts served chilled and ready to sip.', customization: 'Names, marigold theme, custom tags', minOrder: 'Min. 100 coconuts' },
      { tag: 'Mehndi', title: 'Personalized Coconut for Mehndi', image: '/images/brand/service-6.jpg', description: 'Green, vibrant and Instagram-ready — customized coconuts that match your Mehndi night decor beautifully.', customization: 'Mehndi motifs, names, event date', minOrder: 'Min. 100 coconuts' },
      { tag: 'Birthday', title: 'Personalized Coconut for Birthdays', image: '/images/brand/service-4.jpg', description: 'Make every birthday extra special with fresh coconuts engraved with the name, age and a fun message.', customization: 'Name, age, message, theme colours', minOrder: 'Min. 100 coconuts' },
      { tag: 'Corporate', title: 'Customized Coconut for Corporate Events', image: '/images/brand/service-5.jpg', description: 'A healthy, premium welcome drink for conferences and offsites — coconuts stamped with your company logo.', customization: 'Company logo, tagline, event branding', minOrder: 'Min. 100 coconuts' },
      { tag: 'Promotions', title: 'Coconut Bar for Brand Promotions', image: '/images/brand/service-3.jpg', description: 'Turn heads at launches and expos with a live customized coconut bar branded end-to-end for your campaign.', customization: 'Logo engraving, branded cart, staff', minOrder: 'Min. 150 coconuts' },
      { tag: 'Baraat', title: 'Baraat Swagat & Wedding Welcome', image: '/images/brand/hero-2.jpg', description: 'A refreshing coconut welcome for the baraat — the perfect coconut for wedding welcome moments in the heat.', customization: 'Names, welcome message, decor tags', minOrder: 'Min. 100 coconuts' },
      { tag: 'Destination', title: 'Destination Weddings', image: '/images/brand/hero-3.jpg', description: 'Pan-India delivery to destination venues — Udaipur, Goa, Jaipur and more — with fresh, personalized coconuts.', customization: 'Full-service setup & CocoBoys', minOrder: 'Min. 100 coconuts' },
    ],
    storyIntro: 'When it comes to {tag} celebrations, the little details make the biggest impression. {description}',
    storyBody:
      'Every coconut is hand-selected for its freshness and water content, chilled to perfection, and then carefully engraved by our team. We work with {customization} so the final result feels made just for your moment — never generic, always memorable.',
    storyOutro:
      "From the first sip to the last photo, guests remember a welcome that felt thoughtful and premium. That's exactly what a Mr. Coconetto coconut delivers — a refreshing, Instagram-worthy touch that fits right into your theme and décor.",
    storyCtaTitle: 'Ready to plan your {tag}?',
    storyCtaDesc: "Tell us your date and theme — we'll craft a quote for you.",
  },

  plans: {
    kicker: 'Our Plans',
    title: 'Choose Your',
    titleEm: 'Perfect Plan',
    desc: 'Every plan includes a minimum of 100 personalized coconuts. All A+ grade, fresh & chilled. For a custom quote,',
    descLink: 'WhatsApp us →',
    includedLabel: "What's included",
    noteLabel: 'Note:',
    btnPrefix: 'Get a Quote →',
    footnote: 'All prices are indicative.',
    footnoteLink: 'Contact us for a custom quote →',
    items: [
      {
        name: 'Gold Plan', theme: 'gold', subtitle: 'Basic Starter Plan', highlight: false, badge: '',
        description: 'Personalized coconuts delivered fresh to your venue — perfect for smaller, self-managed setups.',
        features: ['Premium personalized coconuts — A+ grade & chilled', 'Choice of engraving: names, hashtag or logo', 'Opener / punching key for easy serving', 'Safe, timely delivery to your city or venue'],
        note: 'Serving staff, table/counter setup and décor to be managed by your team.',
        footer: 'Ideal for those who want fresh personalized coconuts without on-site service.',
        minimum: 'Minimum 100 Coconuts',
      },
      {
        name: 'Diamond Plan', theme: 'diamond', subtitle: 'Full-Service Experience', highlight: true, badge: 'Most Preferred',
        description: 'Personalized coconuts plus trained staff to serve — you enjoy the event, we handle the rest.',
        features: ['Everything in the Gold Plan', 'Personalized coconuts with bespoke engraving', 'Well-groomed, trained CocoBoys for serving & counter', 'Logistics, travel & stay of the team handled by us'],
        note: 'Table & counter to be provided by your team.',
        footer: 'Transport, stay, food & travel — every detail handled by the Mr. Coconetto team.',
        minimum: 'Minimum 100 Coconuts',
      },
      {
        name: 'Platinum Plan', theme: 'platinum', subtitle: 'Our Most Loved, Luxury Choice', highlight: false, badge: '',
        description: 'A truly hassle-free, premium coconut bar experience — the top choice of wedding planners.',
        features: ['Everything in the Diamond Plan', 'Signature Live Coco Cart with designer décor', 'Personalized coconuts with bespoke engraving', 'Complete setup, serving & counter management'],
        note: '',
        footer: 'From setup and serving to travel and transport — every detail handled flawlessly.',
        minimum: 'Minimum 100 Coconuts',
      },
    ],
  },

  cities: {
    kicker: 'Pan-India Presence',
    title: 'Cities',
    titleEm: 'We Serve',
    desc: 'Delivering fresh, personalized coconuts across {count}+ cities nationwide — including destination-wedding hubs.',
    viewAll: 'See all cities & check delivery',
    items: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Jaipur', 'Chandigarh', 'Pune', 'Agra', 'Ahmedabad', 'Alibagh', 'Bhopal', 'Chennai', 'Indore', 'Jaisalmer', 'Jodhpur', 'Kanpur', 'Kolkata', 'Lucknow', 'Ludhiana', 'Mussoorie', 'Nagpur', 'Patna', 'Surat', 'Udaipur', 'Vadodara'],
    pageKicker: 'Pan-India Presence',
    pageTitle: 'Personalized Coconuts,',
    pageTitleEm: 'Delivered Across India',
    pageDesc: 'We deliver fresh, customized coconuts to {count}+ cities — from metros to destination-wedding hubs.',
    chipPrefix: 'Personalized Coconut',
    ctaTitle: "Don't see your city?",
    ctaDesc: 'We serve destination weddings and events nationwide. Ask us about your location.',
    ctaBtn: 'Check Availability on WhatsApp',
    ctaMsg: 'Hi Mr. Coconetto! Do you deliver personalized coconuts to my city?',
  },

  cityDetail: {
    heroImage: '/images/brand/hero-1.jpg',
    backLabel: '← All cities',
    servingLabel: 'Now serving {city}',
    title: 'Personalized Coconuts',
    titleAfter: 'in',
    desc: 'Fresh, hand-engraved coconuts delivered across {city} — the perfect premium welcome drink for weddings, haldi, corporate events and every celebration.',
    quoteBtn: 'Get a Quote for {city}',
    callBtn: 'Call Us',
    stats: [
      { icon: 'Snowflake', label: 'Fresh & Chilled', sub: 'A+ grade coconuts' },
      { icon: 'Award', label: 'Custom Engraved', sub: 'Names · logos · #tags' },
      { icon: 'Clock', label: 'On-Time Delivery', sub: 'To your venue' },
    ],
    offerTitle: 'What we offer in {city}',
    offerings: [
      'Fresh A+ grade tender coconuts, delivered chilled',
      'Custom engraving — names, hashtags, logos & motifs',
      'Live coconut bar with trained CocoBoys (select plans)',
      'On-time delivery to your home, venue or banquet',
    ],
    deliveryTitle: 'Delivery & occasions',
    deliveryDesc: 'We deliver across {city} with a minimum of 100 coconuts. Popular occasions we serve here:',
    occasions: ['Weddings & Engagements', 'Haldi & Mehndi', 'Sangeet Nights', 'Birthday Parties', 'Corporate Events', 'Brand Promotions', 'Baraat Swagat'],
    gallery: ['/images/brand/hero-2.jpg', '/images/brand/service-4.jpg', '/images/brand/service-5.jpg'],
    ctaTitle: 'Planning an event in {city}?',
    ctaDesc: "Share your date & theme — we'll send a custom quote within minutes.",
    ctaWa: 'WhatsApp Us',
    ctaCustomize: 'Customize Your Coconut',
    alsoServe: 'We also serve',
    allCitiesLabel: 'All cities',
  },

  occasions: {
    kicker: 'Every Celebration',
    title: 'Coconut Ideas for',
    titleEm: 'Every Occasion',
    desc: 'From weddings and corporate meetings to intimate get-togethers — our carved, stamped and personalized coconuts add fun and tropical vibes to any event. Try our personalized coconut water to keep you refreshed and energized throughout your celebrations.',
    showLess: 'Show Less',
    viewAll: 'View All {count}+ Occasions',
    items: ['Anniversary Celebration', 'Award Ceremony', 'Baby Shower', 'Birthday Party', 'Corporate Events', 'Engagement Function', 'Festival Parties', 'Get Together', 'Grand Opening', 'House Warming', 'Kitty Party', 'Networking Events', 'Office Parties', 'Pool / Beach Party', 'Promotional Events', 'Reunions', 'Wedding Ceremony', 'Wedding Favour', 'Wedding Invitation', 'Welcome Drink'],
  },

  whyChoose: {
    kicker: 'Our Advantage',
    title: 'Why Choose',
    titleEm: 'Mr. Coconetto?',
    desc: "6+ years of excellence, 1000+ events served — here's why India's top wedding planners trust us.",
    items: [
      { num: '01', icon: 'Cpu', title: 'Precision Custom Engraving', description: 'Refined, intricate engraving on every coconut — from names and hashtags to monograms, logos and floral motifs.', tag: 'Signature Craft' },
      { num: '02', icon: 'Award', title: 'A+ Grade Quality', description: 'Every coconut is A+ grade, handpicked for freshness, sweetness and water volume — and delivered chilled.', tag: 'Premium Quality' },
      { num: '03', icon: 'Clock', title: 'On-Time Delivery', description: 'Our logistics team ensures your personalized coconuts reach the venue fresh, chilled and exactly on schedule.', tag: 'Reliable' },
      { num: '04', icon: 'Palette', title: '100+ Design Options', description: 'From carved monograms and stamped logos to pull-tab openings — 100+ styles to match your event theme.', tag: 'Fully Custom' },
      { num: '05', icon: 'Globe', title: 'Pan-India Presence', description: 'Serving 25+ cities across India — from destination weddings to corporate events, we deliver everywhere.', tag: 'Pan-India Reach' },
      { num: '06', icon: 'Trophy', title: 'Trusted by 1000+ Events', description: 'From intimate celebrations to grand weddings, Mr. Coconetto is a trusted name for customized coconut bars.', tag: 'Trusted Brand' },
    ],
  },

  cta: {
    title: 'Ready to make your event unforgettable?',
    desc: 'Trusted by 1000+ events across India for fresh, personalized coconuts. Get a custom quote for your celebration today.',
    callLabel: 'Call',
    waLabel: 'Get a Quote on WhatsApp',
    waMsg: 'Hi Mr. Coconetto! I would like a custom quote for personalized coconuts.',
  },

  testimonials: {
    kicker: 'Client Love',
    title: 'What Our',
    titleEm: 'Guests',
    titleAfter: 'Say',
    items: [
      { name: 'Aditya Raj', city: 'Hyderabad', text: "We loved the creative, customized coconut concept. Absolutely refreshing, and the team's service was top-notch." },
      { name: 'Aakansha & Avinash', city: 'Chandigarh', text: 'You made our wedding functions so stylish with personalized coconuts. Thank you for making our day unforgettable.' },
      { name: 'Ajit Singh', city: 'Jodhpur', text: 'We sent stamped coconut water as a wedding favour and everyone loved the concept. Beautifully done!' },
      { name: 'Bharti Singh', city: 'Agra', text: 'Great attention to detail and a creative approach. They helped set a new trend at our wedding. Very professional!' },
      { name: 'Aditya Khandelwal', city: 'Udaipur', text: 'A refreshing new concept. The customized coconuts looked amazing and truly elevated our function.' },
      { name: 'Priya Mathur', city: 'Delhi', text: 'Such an attractive welcome drink for guests — everyone loved the unique concept and top-quality tender coconuts.' },
    ],
  },

  blog: {
    kicker: 'From the Blog',
    title: 'Personalized Coconut',
    titleEm: 'Ideas & Guides',
    viewAll: 'View all articles',
    pageKicker: 'The Coconut Journal',
    pageTitle: 'Ideas & Guides on',
    pageTitleEm: 'Personalized Coconuts',
    pageDesc: 'Tips, inspiration and everything you need to know about customized coconuts for weddings, events and celebrations across India.',
    readMore: 'Read more',
    backLabel: 'Back to Blog',
    relatedTitle: 'Read Next',
    ctaTitle: 'Planning an event? Get a personalized coconut quote.',
    ctaBtn: 'Get a Quote on WhatsApp',
    posts: [
      {
        slug: '10-unique-wedding-coconut-ideas', title: '10 Unique Wedding Coconut Ideas for Your Big Day',
        excerpt: 'Personalized coconuts are the freshest wedding trend in India. Here are 10 creative ways to use customized coconuts across your wedding functions.',
        image: '/images/brand/hero-1.jpg', date: '2026-06-01', readTime: '5 min read', published: true,
        keywords: ['Wedding Coconut', 'Personalized Coconut for Weddings', 'Customized Coconut for Wedding'],
        content: [
          { type: 'p', text: 'A personalized coconut is more than a welcome drink — it is a keepsake your guests remember. From carved monograms to your wedding hashtag, customized coconuts add a fresh, tropical touch to every function.' },
          { type: 'h', text: '1. Couple Monogram Coconuts' },
          { type: 'p', text: "Engrave the couple's initials for an elegant, timeless look at the mandap or welcome counter." },
          { type: 'h', text: '2. Wedding Hashtag Coconuts' },
          { type: 'p', text: 'Add your wedding hashtag so guests can snap and share — a personalized coconut for weddings that doubles as social buzz.' },
          { type: 'h', text: '3–10. More Ideas' },
          { type: 'ul', items: ['Haldi-themed marigold coconuts', 'Baraat Swagat welcome coconuts', 'Sangeet night neon tags', 'Mehndi green-motif coconuts', 'Guest name coconuts as favours', 'Live coconut bar with CocoBoys', 'Destination-wedding chilled coconuts', 'Floral engraving to match decor'] },
          { type: 'p', text: 'Want a custom design for your date and venue? Get a quote on WhatsApp and our team will help you plan the perfect wedding coconut experience.' },
        ],
      },
      {
        slug: 'personalized-coconut-for-weddings-guide', title: 'Personalized Coconut for Weddings – Everything You Need to Know',
        excerpt: 'A complete guide to personalized coconuts for weddings — designs, minimum order, freshness, delivery and how to book across India.',
        image: '/images/brand/hero-2.jpg', date: '2026-05-24', readTime: '6 min read', published: true,
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
        slug: 'best-wedding-welcome-drink-ideas-india', title: 'Best Wedding Welcome Drink Ideas in India',
        excerpt: 'From coconut water to mocktails — the best wedding welcome drink ideas, and why a personalized coconut for wedding welcome stands out.',
        image: '/images/brand/hero-3.jpg', date: '2026-05-18', readTime: '4 min read', published: true,
        keywords: ['Coconut for Wedding Welcome', 'Wedding Coconut', 'Personalized Coconut'],
        content: [
          { type: 'p', text: 'A great welcome drink sets the tone for your celebration. Here are refreshing ideas that work beautifully in Indian weather.' },
          { type: 'ul', items: ['Personalized tender coconut water (a crowd favourite)', 'Fresh fruit mocktails', 'Aam panna and jaljeera shots', 'Rose and kesar sherbet'] },
          { type: 'h', text: 'Why choose a personalized coconut?' },
          { type: 'p', text: 'A customized coconut for wedding welcome is natural, hydrating and photogenic — and the engraving makes it uniquely yours.' },
        ],
      },
      {
        slug: 'customized-coconuts-for-wedding-guests', title: 'Customized Coconuts for Wedding Guests',
        excerpt: 'Turn a simple welcome drink into a memorable favour with customized coconuts for your wedding guests.',
        image: '/images/brand/service-2.jpg', date: '2026-05-10', readTime: '4 min read', published: true,
        keywords: ['Customized Coconut', 'Wedding Coconut', 'Personalized Coconut for Weddings'],
        content: [
          { type: 'p', text: 'Guests remember thoughtful details. A customized coconut — engraved with their name or your monogram — is both a refreshing drink and a keepsake.' },
          { type: 'h', text: 'Ideas that guests love' },
          { type: 'ul', items: ['Guest-name coconuts at the entrance', 'Monogram coconuts as table favours', 'Hashtag coconuts for social media', 'Themed engraving matching your decor'] },
        ],
      },
      {
        slug: 'personalized-coconut-for-haldi-mehndi', title: 'Personalized Coconut for Haldi & Mehndi',
        excerpt: 'How personalized coconuts elevate your Haldi and Mehndi functions with fresh, on-theme, Instagram-ready presentation.',
        image: '/images/brand/service-6.jpg', date: '2026-05-03', readTime: '4 min read', published: true,
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
        slug: 'customized-coconut-for-corporate-events', title: 'Customized Coconut for Corporate Events',
        excerpt: 'A healthy, premium welcome for conferences and offsites — customized coconuts branded with your company logo.',
        image: '/images/brand/service-5.jpg', date: '2026-04-26', readTime: '4 min read', published: true,
        keywords: ['Customized Coconut for Corporate Events', 'Coconut Bar for Events', 'Customized Coconut'],
        content: [
          { type: 'p', text: 'Corporate guests appreciate a healthy, premium welcome. A customized coconut branded with your logo makes a strong first impression.' },
          { type: 'ul', items: ['Logo-engraved coconuts for conferences', 'Branded live coconut bar for expos', 'Healthy alternative to sugary welcome drinks', 'Great for product launches and offsites'] },
        ],
      },
      {
        slug: 'baraat-swagat-ideas', title: 'Baraat Swagat Ideas',
        excerpt: 'Fresh, fun and hydrating Baraat Swagat ideas — including the coconut for wedding welcome that guests love.',
        image: '/images/brand/hero-2.jpg', date: '2026-04-19', readTime: '3 min read', published: true,
        keywords: ['Baraat Swagat', 'Coconut for Wedding Welcome', 'Wedding Coconut'],
        content: [
          { type: 'p', text: 'The baraat arrives energised — and often thirsty. A refreshing coconut welcome is the perfect swagat.' },
          { type: 'ul', items: ['Chilled personalized coconuts at the entrance', 'Welcome-message engraving', 'Live coconut cart with CocoBoys', 'Themed tags matching your decor'] },
        ],
      },
      {
        slug: 'personalized-coconut-vs-traditional-welcome-drinks', title: 'Personalized Coconut vs Traditional Wedding Welcome Drinks',
        excerpt: 'How does a personalized coconut compare to traditional welcome drinks? A quick, honest comparison.',
        image: '/images/brand/service-4.jpg', date: '2026-04-12', readTime: '4 min read', published: true,
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
        slug: 'how-to-choose-personalized-coconut-design', title: 'How to Choose the Right Personalized Coconut Design',
        excerpt: 'Names, hashtags, monograms or logos? A practical guide to choosing the right personalized coconut design.',
        image: '/images/brand/service-3.jpg', date: '2026-04-05', readTime: '4 min read', published: true,
        keywords: ['Personalized Coconut', 'Customized Coconut', 'Personalized Coconut India'],
        content: [
          { type: 'p', text: 'The right design depends on your event and theme. Here is how to choose.' },
          { type: 'ul', items: ['Weddings: couple names, monogram or hashtag', 'Corporate: company logo and tagline', 'Birthdays: name, age and a fun message', 'Match engraving style to your decor colours'] },
          { type: 'p', text: 'Not sure? Share your theme on WhatsApp and we will suggest a design.' },
        ],
      },
      {
        slug: 'personalized-coconut-delivery-across-india', title: 'Personalized Coconut Delivery Across India',
        excerpt: 'How pan-India personalized coconut delivery works — cities we serve, freshness and destination weddings.',
        image: '/images/brand/hero-3.jpg', date: '2026-03-29', readTime: '4 min read', published: true,
        keywords: ['Personalized Coconut India', 'Customized Coconut Delhi', 'Personalized Coconut Mumbai'],
        content: [
          { type: 'p', text: 'We deliver personalized coconuts across 25+ cities in India, keeping them fresh and chilled from farm to venue.' },
          { type: 'h', text: 'Cities we serve' },
          { type: 'p', text: 'Delhi, Mumbai, Hyderabad, Bangalore, Jaipur, Chandigarh, Pune and many more — including destination-wedding hubs like Udaipur and Goa.' },
          { type: 'h', text: 'Freshness in transit' },
          { type: 'p', text: 'Careful logistics ensure your customized coconuts arrive fresh, chilled and exactly on schedule.' },
        ],
      },
    ],
  },

  faqs: {
    kicker: 'Got Questions?',
    title: 'Frequently Asked',
    titleEm: 'Questions',
    items: [
      { q: 'What is the minimum order for personalized coconuts?', a: 'Our minimum order is 100 personalized coconuts per event. This helps us maintain premium A+ grade quality and freshness for every celebration.' },
      { q: 'How far in advance should we book?', a: 'We recommend booking 15–20 days in advance for the best design customization and planning. Last-minute requests are accommodated based on availability.' },
      { q: 'Do you offer pan-India delivery?', a: 'Yes. We deliver customized coconuts across 25+ cities in India including Delhi, Mumbai, Hyderabad, Bangalore, Jaipur, Pune and Chandigarh, plus popular destination-wedding hubs.' },
      { q: 'What can you customize on the coconut?', a: 'We offer 100+ design options including names, wedding hashtags, dates, company logos, monograms and floral motifs — all with precision custom engraving.' },
      { q: 'Are the coconuts fresh and hygienic?', a: 'Absolutely. Every coconut is A+ grade tender coconut, handpicked for sweetness and water volume, and delivered chilled with complete hygiene in every serve.' },
      { q: 'What is included in each plan?', a: 'The Gold plan includes personalized coconuts, straws and an opener. The Diamond plan adds trained CocoBoys for serving. The Platinum plan is a full-service experience with our signature Live Coco Cart.' },
    ],
  },

  contact: {
    kicker: 'Contact Us',
    heading: 'Get a Personalized Coconut Quote',
    subheading: "Tell us about your event and we'll share a custom quote. Prefer chatting? Get a quote on WhatsApp or call us directly.",
    waBtn: 'Get Quote on WhatsApp',
    waMsg: 'Hi Mr. Coconetto! I would like a quote for personalized coconuts.',
    callBtn: 'Call Us ·',
    submitBtn: 'Send Enquiry & Get Quote on WhatsApp',
    form: {
      nameLabel: 'Name *', namePlaceholder: 'Your name',
      whatsappLabel: 'WhatsApp Number *', whatsappPlaceholder: '+91 …',
      dateLabel: 'Event Date',
      locationLabel: 'Location / City', locationPlaceholder: 'e.g. Delhi',
      quantityLabel: 'Quantity', quantityPlaceholder: 'e.g. 200 coconuts',
      eventTypeLabel: 'Event Type', eventTypePlaceholder: 'Select event type',
      customizationLabel: 'Customization Details', customizationPlaceholder: 'Names, hashtag, logo, theme colours…',
      sending: 'Sending…',
    },
    eventTypes: ['Wedding', 'Haldi', 'Mehndi', 'Sangeet', 'Birthday', 'Corporate Event', 'Brand Promotion', 'Baraat Swagat', 'Destination Wedding', 'Other'],
  },

  instagram: {
    kicker: 'Follow the freshness',
    title: 'Live on',
    titleEm: 'Instagram',
    desc: 'See our latest personalized coconut moments — tag us to get featured.',
    posts: ['/images/brand/hero-1.jpg', '/images/brand/service-2.jpg', '/images/brand/hero-2.jpg', '/images/brand/service-4.jpg', '/images/brand/service-5.jpg', '/images/brand/hero-3.jpg'],
  },

  products: {
    kicker: 'Our Products',
    title: 'Personalized Coconuts',
    titleEm: '& More',
    desc: 'From our signature engraved coconuts to stirrers, hip flasks, custom stamps and Banta bottles — every detail, made yours.',
    enquireBtn: 'Enquire on WhatsApp',
    detailsLink: 'View details & gallery →',
    comingSoon: 'Photo coming soon',
    detailKicker: 'Mr. Coconetto',
    detailBack: 'Back to Products',
    detailEnquireBtn: 'Enquire on WhatsApp',
    detailCustomizeBtn: 'Customize Yours',
    detailFootnote: '📦 Bulk & custom orders available · 📲 DM/WhatsApp us for pricing & customization.',
    detailEnquireMsg: "Hi Mr. Coconetto! I'm interested in: {name}. Please share pricing & customization details.",
    items: [
      {
        slug: 'personalized-coconut', icon: 'Nut', name: 'Personalized Coconut', tagline: 'The signature',
        image: 'https://customer-assets-rejwkqb3.emergentagent.net/job_coconuts-ship/artifacts/c7k8zit9_image.png', gallery: [], price: '',
        description: 'Fresh A+ grade tender coconut, precision-engraved with names, hashtags, logos or monograms. The heart of every Mr. Coconetto setup.',
        features: ['Names, hashtag, logo or monogram', 'A+ grade, delivered chilled', 'Min. 100 coconuts'],
        note: '',
      },
      {
        slug: 'coconut-stirrer', icon: 'Utensils', name: 'Customised Stirrer', tagline: 'Your Brand, Your Style',
        image: 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k4959rny_image.png', price: '',
        gallery: ['https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k4959rny_image.png', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/0pjfdain_WhatsApp%20Image%202026-08-22%20at%202.27.55%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/rda6kk7a_WhatsApp%20Image%202026-08-22%20at%202.28.15%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/dgyfu0u1_WhatsApp%20Image%202026-08-22%20at%202.28.36%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/4v6gxvai_WhatsApp%20Image%202026-08-22%20at%202.27.54%20PM.jpeg'],
        description: 'Apne drinks ko dijiye ek premium branded experience ✨',
        features: ['Custom Logo & Branding', 'Multiple Custom Designs', 'Perfect for Cocktails, Mocktails & Beverages', 'Ideal for Weddings, Events & Corporate Promotions', 'Bulk Orders Available'],
        note: 'Har Drink Mein Aapka Brand! 🥥',
      },
      {
        slug: 'hip-flask', icon: 'FlaskConical', name: 'Customised Hip Flask', tagline: 'Premium Branding',
        image: 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/cl9frbav_image.png', price: '',
        gallery: ['https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/cl9frbav_image.png', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/rl2gnq2p_WhatsApp%20Image%202026-08-22%20at%202.25.28%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/wcp0vzts_WhatsApp%20Image%202026-08-22%20at%202.25.31%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/7zkge6z2_WhatsApp%20Image%202026-08-22%20at%202.25.32%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/tj3pfqi3_WhatsApp%20Image%202026-08-22%20at%202.27.24%20PM.jpeg'],
        description: 'Apne brand ko dijiye ek premium & memorable touch ✨',
        features: ['Custom Logo Engraving', 'Name & Initials Customisation', 'Premium Finish', 'Perfect for Corporate Gifting', 'Ideal for Events, Weddings & Promotions', 'Bulk & Custom Orders Available'],
        note: 'Your Brand. Your Style. Your Flask.',
      },
      {
        slug: 'stamp', icon: 'Stamp', name: 'Customised Stamp', tagline: 'Make Your Brand Stand Out',
        image: 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/h9l8rcqf_image.png', price: '',
        gallery: ['https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/h9l8rcqf_image.png', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/fxfy5wsy_WhatsApp%20Image%202026-08-22%20at%202.27.29%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/k7nxwyy3_WhatsApp%20Image%202026-08-22%20at%202.27.31%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/sv807sp8_WhatsApp%20Image%202026-08-22%20at%202.27.34%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/pkaqoi7c_WhatsApp%20Image%202026-08-22%20at%202.27.52%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/9z3mqf5u_WhatsApp%20Image%202026-08-22%20at%202.27.32%20PM.jpeg'],
        description: 'Apne coconut aur beverages ko dijiye ek unique branded identity ✨',
        features: ['Custom Logo Stamp', 'Brand Name & Hashtag', 'Clean & Premium Impression', 'Perfect for Fresh Coconut Branding', 'Ideal for Events, Weddings & Brand Promotions', 'Bulk Orders Available'],
        note: 'Aapka Logo • Aapki Branding • Aapka Style',
      },
      {
        slug: 'banta-bottle', icon: 'CupSoda', name: 'Banta Bottle', tagline: 'Mr Coconetto × Banta Bro',
        image: 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/kf59jvom_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM.jpeg', price: '',
        gallery: ['https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/kf59jvom_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/mceb0j5y_WhatsApp%20Image%202026-08-22%20at%202.28.34%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/d8sokw25_WhatsApp%20Image%202026-08-22%20at%202.28.33%20PM.jpeg', 'https://customer-assets-39nsmqrw.emergentagent.net/job_full-stack-coconatu/artifacts/4hyf6i88_WhatsApp%20Image%202026-08-22%20at%202.28.17%20PM%20%281%29.jpeg'],
        description: 'Nostalgic desi banta soda in fizzy fun flavours 🥤 Taste the magic — ab chale bachpan mein!',
        features: ['Masala Fizz — Tangy & Fiery', 'Kala Khatta Crush — Sweet, Sour & Satisfying', 'Blueberry Blast — Tangy & Refreshing', 'Lemonade — Classic & Zesty', 'Perfect for events, parties, weddings & stalls', 'Bulk Orders Available'],
        note: 'Taste The Magic! Ab Chale Bachpan Mein 🥤',
      },
    ],
  },

  footer: {
    about: "India's premium personalized coconut brand for weddings, haldi, mehndi, corporate events and every occasion worth celebrating — customized coconuts delivered fresh, pan-India.",
    quickLinksTitle: 'Quick Links',
    citiesTitle: 'Personalized Coconuts Across India',
    contactTitle: 'Get in Touch',
    customizeLink: 'Customize Your Coconut',
    waBtn: 'Get a Quote on WhatsApp',
    waMsg: 'Hi Mr. Coconetto! I would like a quote for personalized coconuts.',
    copyright: '© {year} Mr. Coconetto. All Rights Reserved.',
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund Policy', href: '#' },
    ],
  },

  floating: {
    instagramLabel: 'Instagram',
    whatsappLabel: 'WhatsApp Us',
    callLabel: 'Call Now',
  },

  // Theme colours. Light backgrounds have been darkened ~50% vs the original
  // Tailwind tints (pink-50 / green-50) as requested, and are editable here.
  theme: {
    green500: '#22c55e',
    green600: '#16a34a',
    green700: '#15803d',
    pink500: '#ec4899',
    pink600: '#db2777',
    pink700: '#be185d',
    pink50: '#fbd0e5',   // was #fdf2f8
    pink100: '#f9bcda',  // was #fce7f3
    green50: '#c6f2d4',  // was #f0fdf4
    green100: '#b4ecc6', // was #dcfce7
    beige: '#ebe4d2',    // was #f6f4ee (About section)
    dark: '#0d0710',     // Plans section background
    bodyBg: '#ffffff',
    bodyText: '#1f2937',
    fontBody: 'Poppins',
    fontDisplay: 'Playfair Display',
    fontScript: 'Dancing Script',
  },

  // Per-element style overrides set from the Live Editor, keyed by the element
  // path (e.g. "services.title") or section id ("sec.services").
  styles: {},
};

export default DEFAULT_CONTENT;

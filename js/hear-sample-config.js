// ============================================
// CONFIGURACIÓN DE AUDIOS - HEAR A SAMPLE
// ============================================
// 
// INSTRUCCIONES PARA COMPLETAR:
// 
// 1. Escucha el audio y anota el diálogo exacto
// 2. Marca el tiempo (en segundos) cuando aparece cada mensaje
// 3. Reemplaza los textos de ejemplo con el contenido real
// 4. Ajusta los tiempos (time) para que coincidan con el audio
// 5. Agrega más mensajes si el audio tiene más diálogos
//
// ESTRUCTURA DE CADA MENSAJE:
// {
//   type: 'agent' o 'client',  // ¿Quién habla?
//   time: 0,                   // ¿En qué segundo aparece? (ej: 0, 3, 8, 15)
//   text: 'Texto exacto...'    // ¿Qué dice exactamente?
// }
//
// ============================================

const HEAR_SAMPLE_CONFIG = {
  // ===== HOME SERVICES (Icono de casa) =====
  // Placeholder until sample-home-services.mp3 is added
  home: {
    audio: './audio/sample-home-services.mp3',
    image: './images/hear-a-sample-call/home_service_pros_sample_call.webp',
    label: 'Home Services',
    title: 'Home Services Pros',
    messages: [
      { type: 'agent', time: 0, text: 'Thank you for calling. How can I help you today?' },
      { type: 'client', time: 3, text: 'I need help with a home service.' }
    ],
    customerIssue: 'Home service request',
    revoAction: 'Sample call for Home Services Pros will be available soon.',
    whyItMatters: 'Revo will handle home service calls with clarity and capture the information the business needs.'
  },

  // ===== PLUMBING (Icono de llave inglesa) =====
  wrench: {
    audio: './audio/sample-plumbing.mp3',
    image: './images/hear-a-sample-call/Plumbing Pros.webp',
    label: 'Plumbing',
    title: 'Plumbing Pros',
    messages: [
      {
        type: 'agent',
        time: 1, // Tiempo: 00:00:00,699
        text: 'Hi.'
      },
      {
        type: 'client',
        time: 3, // Tiempo: 00:00:02,919
        text: 'Hi, how are you?'
      },
      {
        type: 'agent',
        time: 5, // Tiempo: 00:00:05,480
        text: 'I\'m good, thanks. And you?'
      },
      {
        type: 'client',
        time: 8, // Tiempo: 00:00:08,680
        text: 'I\'m fine, thanks. What is your name?'
      },
      {
        type: 'agent',
        time: 12, // Tiempo: 00:00:11,299
        text: 'I\'m Kovi. What\'s yours?'
      },
      {
        type: 'client',
        time: 15, // Tiempo: 00:00:14,749
        text: 'My name is Jason.'
      },
      {
        type: 'agent',
        time: 17, // Tiempo: 00:00:17,040
        text: 'Nice to meet you, Jason.'
      },
      {
        type: 'client',
        time: 20, // Tiempo: 00:00:19,890
        text: 'Nice to meet you too, Kovi.'
      },
      {
        type: 'agent',
        time: 23, // Tiempo: 00:00:23,100
        text: 'Bye. See you soon.'
      },
      {
        type: 'client',
        time: 26, // Tiempo: 00:00:26,239
        text: 'Goodbye. Have a nice day.'
      }
    ],
    customerIssue: 'General greeting and introduction',
    revoAction: 'Revo exchanged a friendly greeting and introduction with the caller.',
    whyItMatters: 'Revo showed a personable, professional tone and set a positive tone for the conversation.'
  },

  // ===== LAW FIRMS (Icono de martillo) =====
  hammer: {
    audio: './audio/sample-law-firms.mp3',
    image: './images/Hear a Sample Call/Legal Services Pros.png',
    label: 'Law Firms',
    title: 'Legal Services Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Construction Experts. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need an estimate for a kitchen renovation.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me connect you with one of our project managers to schedule a consultation.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ],
    customerIssue: 'Request for kitchen renovation estimate',
    revoAction: 'Revo acknowledged the request and offered to connect the caller with a project manager to schedule a consultation.',
    whyItMatters: 'Revo quickly identified the need and routed the caller to the right next step without losing the lead.'
  },

  // ===== LOCKSMITH (Icono de llave) =====
  // Dialogue and timing from original sample-home-services.mp3 (car lockout — 10 Minute Locksmith)
  key: {
    audio: './audio/sample-locksmith.mp3',
    image: './images/hear-a-sample-call/locksmith_pros_sample_call.webp',
    label: 'Locksmith',
    title: 'Locksmith Pros',
    messages: [
      { type: 'agent', time: 0.16, text: 'Thank you for calling 10 Minute Locksmith. How can I help you?' },
      { type: 'client', time: 2.96, text: 'Hello?' },
      { type: 'agent', time: 4.04, text: 'Hi there, yeah, I\'m here. How can I help you today?' },
      { type: 'client', time: 6.6, text: 'Oh, hello. I locked myself out of my car, and I need a locksmith to unlock my car for me because my keys are in there and I can\'t get back in.' },
      { type: 'agent', time: 16.36, text: 'Yeah, no worries at all. That happens more often than you think. I can help you with that. Where will you need us to come out?' },
      { type: 'client', time: 22.36, text: 'Okay, hold on, let me find the address.' },
      { type: 'agent', time: 24.52, text: 'Okay, sure, take your time. I\'m right here.' },
      { type: 'client', time: 28.29, text: 'It\'s, It\'s 985 Bon Road Drive Northeast.' },
      { type: 'agent', time: 34.04, text: 'And what\'s the zip code?' },
      { type: 'client', time: 35.84, text: 'Atlanta, Georgia 30308.' },
      { type: 'agent', time: 39.44, text: 'Okay, I have 985 Bon Road Drive, Atlanta, Georgia 30308. Is that correct?' },
      { type: 'client', time: 45.88, text: 'Yes.' },
      { type: 'agent', time: 47.4, text: 'And what kind of car is it? Can I get the year, make, and model?' },
      { type: 'client', time: 51.57, text: '2018 Mitsubishi Mirage. It\'s a GST4.' },
      { type: 'agent', time: 59.33, text: 'Got it. I have a 2018 Mitsubishi Mirage GST4. Does that sound right? And can I get your name?' },
      { type: 'client', time: 67.29, text: 'Yes, Gabriella Bernard Minas.' },
      { type: 'agent', time: 71.05, text: 'Okay, I have Gabriella Bernard Minas. And what\'s the best number to reach you at just in case we get disconnected?' },
      { type: 'client', time: 77.57, text: '678-768-515' },
      { type: 'agent', time: 85.65, text: 'All right, Gabriella, you\'re all set. Please keep your line available. Our specialist will give you a call. And thank you so much for calling.' },
      { type: 'client', time: 92.17, text: 'Thank you.' },
      { type: 'agent', time: 93.25, text: 'You\'re very welcome. We\'ll be reaching out shortly. Have a good one.' },
      { type: 'client', time: 96.61, text: 'You too.' },
      { type: 'agent', time: 98.05, text: 'Goodbye.' }
    ],
    customerIssue: 'Customer locked out of car — needs locksmith',
    revoActions: [
      'Answered promptly and reassured the caller',
      'Collected service address and location details',
      'Collected vehicle details (year, make, model)',
      'Collected caller name and phone number',
      'Confirmed all details and informed customer a specialist would call back'
    ],
    whyItMatters: 'Revo kept the call professional and efficient, capturing everything the business needs to dispatch the job while putting the customer at ease.'
  },

  // ===== CYBER SECURITY (Icono de escudo) =====
  shield: {
    audio: './audio/sample-cyber-security.mp3',
    image: './images/Hear a Sample Call/Cybersecurity Pros.png',
    label: 'Cyber Security',
    title: 'Cybersecurity Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Security Plus. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I\'m interested in installing a home security system.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'Great! I can help you with that. Let me schedule a free consultation with one of our security specialists.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ],
    customerIssue: 'Inquiry about home security system',
    revoAction: 'Revo offered to schedule a free consultation with a security specialist.',
    whyItMatters: 'Revo turned the inquiry into a clear next step and kept the lead warm.'
  },

  // ===== AIR DUCT CLEANING =====
  'air-duct-cleaning': {
    audio: './audio/sample-air-duct-cleaning.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Air Duct Cleaning',
    title: 'Air Duct Cleaning Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Fresh Air Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to schedule a duct cleaning service for my home.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. When would be a convenient time for you?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ],
    customerIssue: 'Request to schedule duct cleaning',
    revoAction: 'Revo confirmed willingness to help and asked for a convenient time.',
    whyItMatters: 'Revo moved the caller toward scheduling while keeping the conversation focused.'
  },

  // ===== HVAC =====
  'hvac': {
    audio: './audio/sample-hvac.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'HVAC',
    title: 'HVAC Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Climate Control Experts. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'My air conditioning stopped working. It\'s really hot in here.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I understand how uncomfortable that must be. Let me schedule a technician to come out and assess the situation.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== CHIMNEY SWEEP =====
  'chimney-sweep': {
    audio: './audio/sample-chimney-sweep.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Chimney Sweep',
    title: 'Chimney Sweep Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Clean Chimney Services. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to have my chimney cleaned before winter.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'That\'s a great idea for safety. Let me check our availability and schedule an appointment for you.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== LAWN CARE =====
  'lawn-care': {
    audio: './audio/sample-lawn-care.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Lawn Care',
    title: 'Lawn Care Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Green Lawn Services. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need regular lawn maintenance for my property.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me gather some information about your lawn to provide the best service.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== RESTORATION =====
  'restoration': {
    audio: './audio/sample-restoration.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Restoration',
    title: 'Restoration Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Restoration Experts. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I had water damage in my basement. I need emergency restoration services.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I understand this is urgent. Let me dispatch a team to assess the damage and start the restoration process.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== JUNK REMOVAL =====
  'junk-removal': {
    audio: './audio/sample-junk-removal.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Junk Removal',
    title: 'Junk Removal Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Quick Junk Removal. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to get rid of some old furniture and appliances.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Can you tell me what items you need removed and your location?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== PRESSURE WASHING =====
  'pressure-washing': {
    audio: './audio/sample-pressure-washing.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Pressure Washing',
    title: 'Pressure Washing Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Clean Surfaces Pro. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to have my driveway and siding pressure washed.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me schedule a service appointment for you.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== CARPET CLEANING =====
  'carpet-cleaning': {
    audio: './audio/sample-carpet-cleaning.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Carpet Cleaning',
    title: 'Carpet Cleaning Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Fresh Carpets. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need professional carpet cleaning for my home.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. How many rooms need cleaning and when would be convenient for you?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== COMPUTER REPAIR =====
  'computer-repair': {
    audio: './audio/sample-computer-repair.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Computer Repair',
    title: 'Computer Repair Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Tech Fix Solutions. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'My computer is running very slowly and keeps freezing.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I understand how frustrating that can be. Let me schedule a diagnostic appointment to identify the issue.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== PEST CONTROL =====
  'pest-control': {
    audio: './audio/sample-pest-control.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Pest Control',
    title: 'Pest Control Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Pest Free Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I have an ant problem in my kitchen. I need pest control service.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule an inspection and treatment for your home.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== SNOW REMOVAL =====
  'snow-removal': {
    audio: './audio/sample-snow-removal.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Snow Removal',
    title: 'Snow Removal Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Clear Path Services. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need snow removal for my driveway and walkway.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Would you like one-time service or a seasonal contract?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== ROOFING =====
  'roofing': {
    audio: './audio/sample-roofing.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Roofing',
    title: 'Roofing Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Top Roof Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need a roof inspection and possibly some repairs.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help. Let me schedule a free inspection to assess your roof\'s condition.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== LANDSCAPE =====
  'landscape': {
    audio: './audio/sample-landscape.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Landscape',
    title: 'Landscape Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Beautiful Landscapes. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I want to redesign my front yard landscaping.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'That sounds exciting! Let me schedule a consultation with one of our landscape designers.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== CONSTRUCTION =====
  'construction': {
    audio: './audio/sample-construction.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Construction',
    title: 'Construction Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Build Right Construction. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need an estimate for a home addition project.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me connect you with one of our project managers to discuss your needs.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== MAID & CLEANING =====
  'maid-cleaning': {
    audio: './audio/sample-maid-cleaning.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Maid & Cleaning',
    title: 'Maid & Cleaning Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Sparkle Clean Services. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need regular house cleaning services.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Would you like weekly, bi-weekly, or monthly service?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== ELECTRICAL =====
  'electrical': {
    audio: './audio/sample-electrical.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Electrical',
    title: 'Electrical Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Safe Electric. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I have some outlets that stopped working. I need an electrician.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I understand this is important for your safety. Let me schedule an electrician to come out and diagnose the issue.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== PROPERTY MAINTENANCE =====
  'property-maintenance': {
    audio: './audio/sample-property-maintenance.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Property Maintenance',
    title: 'Property Maintenance Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Maintenance Masters. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need ongoing maintenance services for my rental properties.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me discuss our maintenance packages and find the best solution for your properties.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== GENERAL CONTRACTING =====
  'general-contracting': {
    audio: './audio/sample-general-contracting.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'General Contracting',
    title: 'General Contracting Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Pro Contractors. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need a contractor for a bathroom renovation project.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me schedule a consultation to discuss your renovation plans.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== TOWING =====
  'towing': {
    audio: './audio/sample-towing.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Towing',
    title: 'Towing Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Quick Tow Service. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'My car broke down on the highway. I need a tow truck.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Can you provide your current location and vehicle information?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== MOVING =====
  'moving': {
    audio: './audio/sample-moving.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Moving',
    title: 'Moving Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Reliable Movers. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to schedule a moving service for next month.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me gather some information about your move to provide an accurate quote.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== HANDYMAN =====
  'handyman': {
    audio: './audio/sample-handyman.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Handyman',
    title: 'Handyman Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Fix It All Handyman. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I have several small repairs around the house that need attention.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Can you tell me what repairs you need so I can schedule a visit?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== ALARM & SECURITY =====
  'alarm-security': {
    audio: './audio/sample-alarm-security.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Alarm & Security',
    title: 'Alarm & Security Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Secure Home Systems. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I want to install a home security alarm system.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule a free consultation to discuss your security needs.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== POOL SERVICES =====
  'pool-services': {
    audio: './audio/sample-pool-services.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Pool Services',
    title: 'Pool Services Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Crystal Clear Pools. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need regular pool maintenance and cleaning services.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me discuss our maintenance packages and find the best schedule for your pool.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== APPLIANCE REPAIR =====
  'appliance-repair': {
    audio: './audio/sample-appliance-repair.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Appliance Repair',
    title: 'Appliance Repair Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Appliance Fix Pro. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'My dishwasher stopped working. I need it repaired.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule a technician to come out and diagnose the problem.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== SOLAR INSTALLATION =====
  'solar-installation': {
    audio: './audio/sample-solar-installation.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Solar Installation',
    title: 'Solar Installation Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Solar Energy Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I\'m interested in installing solar panels on my home.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'That\'s great! Let me schedule a free consultation to assess your home\'s solar potential and discuss options.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== GARAGE DOOR =====
  'garage-door': {
    audio: './audio/sample-garage-door.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Garage Door',
    title: 'Garage Door Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Door Masters. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'My garage door opener stopped working. I need it fixed.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule a technician to come out and repair your garage door.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== PAINTING =====
  'painting': {
    audio: './audio/sample-painting.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Painting',
    title: 'Painting Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Perfect Paint. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to have the interior of my house painted.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me schedule an estimate to discuss colors and timing.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== TILLING =====
  'tilling': {
    audio: './audio/sample-tilling.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Tilling',
    title: 'Tilling Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Ground Prep Services. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need tilling services for my garden before planting season.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule a service to prepare your garden soil.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== WINDOW CLEANING =====
  'window-cleaning': {
    audio: './audio/sample-window-cleaning.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Window Cleaning',
    title: 'Window Cleaning Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Clear View Windows. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need professional window cleaning for my home.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Would you like one-time service or regular maintenance?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== HEALTHCARE & MEDICAL =====
  'healthcare-medical': {
    audio: './audio/sample-healthcare-medical.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Healthcare & Medical',
    title: 'Healthcare & Medical Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Medical Care Center. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to schedule an appointment with a doctor.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. What type of appointment do you need and when would be convenient?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== FINANCIAL SERVICE =====
  'financial-service': {
    audio: './audio/sample-financial-service.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Financial Service',
    title: 'Financial Service Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Financial Advisors Plus. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need advice on retirement planning.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me schedule a consultation with one of our financial advisors.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== REAL ESTATE & PROPERTY MANAGEMENT =====
  'real-estate-property-management': {
    audio: './audio/sample-real-estate-property-management.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Real Estate & Property Management',
    title: 'Real Estate & Property Management Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Property Experts. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I\'m looking to rent out my property and need management services.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me schedule a consultation to discuss our property management services.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== SMALL BUSINESS =====
  'small-business': {
    audio: './audio/sample-small-business.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Small Business',
    title: 'Small Business Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Business Solutions. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need help with customer service for my small business.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. Let me discuss our solutions for small businesses.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== CORPORATE & GOVERNMENT =====
  'corporate-government': {
    audio: './audio/sample-corporate-government.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Corporate & Government',
    title: 'Corporate & Government Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Enterprise Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need information about your corporate communication services.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me connect you with our enterprise solutions team.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== RETAIL & ECOMMERCE =====
  'retail-ecommerce': {
    audio: './audio/sample-retail-ecommerce.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Retail & eCommerce',
    title: 'Retail & eCommerce Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Retail Support Services. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need customer service support for my online store.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me discuss our eCommerce customer service solutions.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== MARKETING, MEDIA & ADVERTISING =====
  'marketing-media-advertising': {
    audio: './audio/sample-marketing-media-advertising.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Marketing, Media & Advertising',
    title: 'Marketing, Media & Advertising Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Creative Media Solutions. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need help managing incoming calls for my marketing agency.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me discuss our communication solutions for marketing agencies.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== FRANCHISES =====
  'franchises': {
    audio: './audio/sample-franchises.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Franchises',
    title: 'Franchises Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Franchise Support. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I own multiple franchise locations and need consistent call handling.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me discuss our franchise communication solutions.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== TOURISM, TRAVEL & HOSPITALITY =====
  'tourism-travel-hospitality': {
    audio: './audio/sample-tourism-travel-hospitality.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Tourism, Travel & Hospitality',
    title: 'Tourism, Travel & Hospitality Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Travel Services. How may I assist you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need to make a reservation for a hotel room.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I\'d be happy to help you with that. What dates are you looking for?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  },

  // ===== BUILDING, CONSTRUCTION & TRADES =====
  'building-construction-trades': {
    audio: './audio/sample-building-construction-trades.mp3',
    image: './images/Hear a Sample Call/example_call.png',
    label: 'Building, Construction & Trades',
    title: 'Building, Construction & Trades Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Trade Professionals. How can I help you?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I need a contractor for a commercial building project.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I can help you with that. Let me connect you with one of our project managers.' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
  }
};

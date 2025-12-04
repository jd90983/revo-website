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
  home: {
    audio: './audio/sample-home-services.mp3',
    image: './images/Hear a Sample Call/sample-home-services_pros_2.png',
    label: 'Home Services',
    title: 'Home Services Pros',
    messages: [
      {
        type: 'agent', // Revo Agent habla
        time: 0, // Tiempo: 00:00:00,219 (inicio del audio)
        text: 'Hi, my name is John. Nice to meet you.'
      },
      {
        type: 'client', // Cliente habla
        time: 4, // Tiempo: 00:00:03,970 (cuando el cliente empieza a hablar)
        text: 'Hi John, I\'m Sarah. Nice to meet you too.'
      },
      {
        type: 'agent',
        time: 9, // Tiempo: 00:00:08,530
        text: 'How are you doing today?'
      },
      {
        type: 'client',
        time: 11, // Tiempo: 00:00:10,750
        text: 'I\'m doing pretty well, thanks.'
      }
    ]
  },

  // ===== PLUMBING (Icono de llave inglesa) =====
  wrench: {
    audio: './audio/sample-plumbing.mp3',
    image: './images/Hear a Sample Call/Plumbing Pros.png',
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
    ]
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
    ]
  },

  // ===== LOCKSMITH (Icono de llave) =====
  key: {
    audio: './audio/sample-locksmith.mp3',
    image: './images/Hear a Sample Call/Locksmith Pros.png',
    label: 'Locksmith',
    title: 'Locksmith Pros',
    messages: [
      {
        type: 'agent',
        time: 0, // ⏱️ ACTUALIZA
        text: 'Thank you for calling Secure Locks. How can I help you today?' // ✏️ ACTUALIZA
      },
      {
        type: 'client',
        time: 3, // ⏱️ ACTUALIZA
        text: 'I\'m locked out of my house. I need emergency service.' // ✏️ ACTUALIZA
      },
      {
        type: 'agent',
        time: 6, // ⏱️ ACTUALIZA
        text: 'I understand this is urgent. I can dispatch a locksmith to your location right away. What\'s your address?' // ✏️ ACTUALIZA
      }
      // 💡 Agrega más mensajes si es necesario
    ]
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
    ]
  }
};

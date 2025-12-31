# Ejemplo de Transcripción Completa

Este es un ejemplo de cómo debería verse una transcripción completa. Úsalo como referencia.

## 📁 Archivo: sample-home-services.mp3

### Transcripción del Audio:

```
[0:00 - 0:05] Agent: "Thank you for calling Elite Home Services. How can I assist you today?"

[0:05 - 0:12] Client: "Hi, I need someone to come out and take a look at my HVAC system. It's making a strange noise and not cooling properly."

[0:12 - 0:20] Agent: "I understand how uncomfortable that can be, especially during warm weather. I can schedule one of our HVAC technicians to come out and diagnose the issue. What's your availability this week?"

[0:20 - 0:25] Client: "I'm available tomorrow afternoon, around 2 PM."

[0:25 - 0:30] Agent: "Perfect! I have an opening at 2:30 PM tomorrow. Would that work for you?"
```

### Configuración en JavaScript:

```javascript
home: {
  audio: './audio/sample-home-services.mp3',
  image: './images/Placeholder Image.png',
  label: 'Home Services Pros',
  messages: [
    {
      type: 'agent',
      time: 0,  // Empieza a los 0 segundos
      text: 'Thank you for calling Elite Home Services. How can I assist you today?'
    },
    {
      type: 'client',
      time: 5,  // Empieza a los 5 segundos
      text: 'Hi, I need someone to come out and take a look at my HVAC system. It\'s making a strange noise and not cooling properly.'
    },
    {
      type: 'agent',
      time: 12,  // Empieza a los 12 segundos
      text: 'I understand how uncomfortable that can be, especially during warm weather. I can schedule one of our HVAC technicians to come out and diagnose the issue. What\'s your availability this week?'
    },
    {
      type: 'client',
      time: 20,  // Empieza a los 20 segundos
      text: 'I\'m available tomorrow afternoon, around 2 PM.'
    },
    {
      type: 'agent',
      time: 25,  // Empieza a los 25 segundos
      text: 'Perfect! I have an opening at 2:30 PM tomorrow. Would that work for you?'
    }
  ]
}
```

## 📝 Notas Importantes:

1. **Tiempo (time)**: Es el segundo exacto cuando **empieza** a hablar la persona
2. **Tipo (type)**: 
   - `'agent'` = Revo Agent (el asistente de IA)
   - `'client'` = Cliente (la persona que llama)
3. **Texto (text)**: Debe ser **exactamente** lo que se escucha, palabra por palabra
4. **Orden**: Los mensajes deben estar en orden cronológico (tiempos de menor a mayor)

## 🎯 Cómo Encontrar los Tiempos:

1. Abre el audio en un reproductor que muestre el tiempo (VLC, Windows Media Player, etc.)
2. Reproduce el audio y pausa cuando alguien empieza a hablar
3. Anota el tiempo que muestra el reproductor
4. Escribe ese número en el campo `time`

## ✅ Verificación:

Después de completar, verifica que:
- Los tiempos van en orden ascendente (0, 5, 12, 20, 25...)
- No hay saltos muy grandes entre mensajes (a menos que haya pausas en el audio)
- Los textos coinciden exactamente con lo que escuchas
- La duración total del último mensaje no excede la duración del audio


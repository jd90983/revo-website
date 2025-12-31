# Guía para Transcribir los Audios

Esta guía te ayudará a completar la configuración de los textos para que coincidan exactamente con los audios.

## 📋 Pasos para Completar la Configuración

### 1. Escucha el Audio
- Reproduce el archivo de audio (ej: `sample-home-services.mp3`)
- Toma notas mientras escuchas

### 2. Identifica los Diálogos
Para cada mensaje, anota:
- **¿Quién habla?** → `agent` (Revo) o `client` (Cliente)
- **¿Qué dice exactamente?** → Transcribe palabra por palabra
- **¿En qué segundo aparece?** → Marca el tiempo cuando empieza a hablar

### 3. Ejemplo de Transcripción

```
Audio: sample-home-services.mp3
Duración: 2:38 (158 segundos)

0:00 - Agent: "Thank you for calling Elite Home Services. How can I assist you today?"
0:05 - Client: "Hi, I need someone to come out and take a look at my HVAC system."
0:12 - Agent: "I understand. I can schedule one of our technicians. What's your availability?"
```

### 4. Actualiza el Archivo de Configuración

Abre `js/hear-sample-config.js` y actualiza:

```javascript
messages: [
  {
    type: 'agent',
    time: 0,        // ← Tiempo en segundos (0 = inicio)
    text: 'Thank you for calling Elite Home Services. How can I assist you today?' // ← Texto exacto
  },
  {
    type: 'client',
    time: 5,         // ← Tiempo en segundos (5 = a los 5 segundos)
    text: 'Hi, I need someone to come out and take a look at my HVAC system.' // ← Texto exacto
  }
]
```

## 🎯 Tips Importantes

1. **Textos Exactos**: Copia el texto palabra por palabra, tal como se escucha
2. **Tiempos Precisos**: Usa un reproductor que muestre el tiempo (segundos)
3. **Puntuación**: Incluye comas, puntos, signos de interrogación
4. **Mayúsculas**: Respeta las mayúsculas al inicio de frases
5. **Contracciones**: Incluye contracciones como "I'm", "don't", "can't", etc.

## 📝 Formato de Tiempo

- **Segundos**: Usa números enteros (0, 3, 8, 15, etc.)
- **Precisión**: No necesitas decimales, redondea al segundo más cercano
- **Inicio**: El primer mensaje generalmente empieza en `time: 0`

## ✅ Checklist

Antes de guardar, verifica:
- [ ] Todos los textos coinciden con el audio
- [ ] Los tiempos están en orden cronológico
- [ ] No hay mensajes faltantes
- [ ] Los tipos (`agent`/`client`) son correctos
- [ ] La ortografía y puntuación son correctas

## 🔧 Activar la Configuración

Una vez completada la configuración:

1. Abre `index.html`
2. Busca la línea comentada: `<!-- <script src="js/hear-sample-config.js"></script> -->`
3. Descoméntala: `<script src="js/hear-sample-config.js"></script>`
4. Guarda y prueba en el navegador

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
- Verifica que los tiempos estén en orden
- Asegúrate de que los textos coincidan exactamente
- Revisa la consola del navegador (F12) para ver errores


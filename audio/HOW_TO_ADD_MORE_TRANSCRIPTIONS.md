# Cómo Agregar Transcripciones de los Otros Audios

Esta guía te ayudará a agregar las transcripciones de los audios restantes.

## 📋 Audios Pendientes

1. **sample-wrench.mp3** - Repair Services (Icono de llave inglesa)
2. **sample-hammer.mp3** - Construction Services (Icono de martillo)
3. **sample-key.mp3** - Locksmith Services (Icono de llave)
4. **sample-shield.mp3** - Security Services (Icono de escudo)

## 📝 Pasos para Agregar una Transcripción

### Paso 1: Obtén la Transcripción

Necesitas dos archivos (como los que usaste para home-services):
- **Archivo .srt** (subtítulos con tiempos exactos)
- **Archivo .txt** (transcripción con quién habla)

### Paso 2: Convierte los Tiempos

El archivo SRT tiene tiempos en formato `00:00:00,219 --> 00:00:02,089`

**Conversión a segundos:**
- `00:00:00,219` = **0 segundos** (redondea)
- `00:00:03,970` = **4 segundos** (redondea)
- `00:00:08,530` = **9 segundos** (redondea)
- `00:00:10,750` = **11 segundos** (redondea)

**Fórmula rápida:**
- Minutos × 60 + Segundos (redondea los milisegundos)
- Ejemplo: `00:00:03,970` = 0×60 + 3.970 ≈ **4 segundos**

### Paso 3: Identifica Quién Habla

Del archivo de transcripción, identifica:
- **"Revo Agent:"** → `type: 'agent'`
- **"Client:"** → `type: 'client'`

### Paso 4: Actualiza el Archivo de Configuración

Abre `js/hear-sample-config.js` y busca la sección del audio que quieres actualizar.

**Ejemplo para "wrench" (Repair Services):**

```javascript
wrench: {
  audio: './audio/sample-wrench.mp3',
  image: './images/Placeholder Image.png',
  label: 'Repair Services',
  messages: [
    {
      type: 'agent',  // Del transcript: "Revo Agent:"
      time: 0,       // Del SRT: primer tiempo convertido a segundos
      text: 'Texto exacto del transcript'  // Del transcript
    },
    {
      type: 'client',  // Del transcript: "Client:"
      time: 4,         // Del SRT: segundo tiempo
      text: 'Texto exacto del transcript'
    }
    // Agrega más mensajes según el diálogo
  ]
}
```

## 🎯 Ejemplo Completo

**Archivo SRT:**
```
1
00:00:00,100 --> 00:00:02,500
Thank you for calling Repair Pro.

2
00:00:02,500 --> 00:00:05,200
How can I help you today?

3
00:00:05,300 --> 00:00:08,100
I have a leaky faucet.
```

**Archivo Transcript:**
```
Revo Agent: Thank you for calling Repair Pro. How can I help you today?

Client: I have a leaky faucet.
```

**Configuración resultante:**
```javascript
messages: [
  {
    type: 'agent',
    time: 0,  // 00:00:00,100 ≈ 0
    text: 'Thank you for calling Repair Pro. How can I help you today?'
  },
  {
    type: 'client',
    time: 5,  // 00:00:05,300 ≈ 5
    text: 'I have a leaky faucet.'
  }
]
```

## ✅ Checklist

Antes de guardar, verifica:
- [ ] Los tiempos están en orden cronológico
- [ ] Los textos coinciden exactamente con el transcript
- [ ] Los tipos (agent/client) son correctos
- [ ] No hay mensajes faltantes
- [ ] La ortografía es correcta

## 🚀 Una Vez Completado

1. Guarda el archivo `js/hear-sample-config.js`
2. Recarga la página en el navegador
3. Prueba el audio para verificar que los mensajes aparecen en el tiempo correcto

## 💡 Tips

- **Combina frases cortas**: Si el transcript tiene "Revo Agent: Hola. ¿Cómo estás?" y el SRT muestra dos líneas separadas, puedes combinarlas en un solo mensaje
- **Tiempos aproximados**: No necesitas precisión de milisegundos, redondea al segundo más cercano
- **Orden cronológico**: Los mensajes deben ir de menor a mayor tiempo

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que los tiempos estén en orden
2. Asegúrate de que los textos coincidan exactamente
3. Revisa la consola del navegador (F12) para ver errores


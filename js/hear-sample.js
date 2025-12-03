// Hear Sample Section - Interactive Audio Player with Chat Sync
(function() {
  'use strict';

  // Use configuration from external file if available, otherwise use default
  const sampleData = typeof HEAR_SAMPLE_CONFIG !== 'undefined' ? HEAR_SAMPLE_CONFIG : {
    home: {
      audio: './audio/sample-home-services.mp3',
      image: './images/Hear a Sample Call/sample-home-services_2.png',
      label: 'Home Services',
      messages: [
        {
          type: 'agent',
          time: 0,
          text: 'Thank you for calling Elite Home Services. How can I assist you today?'
        },
        {
          type: 'client',
          time: 3,
          text: 'Hi, I need someone to come out and take a look at my HVAC system. It\'s making a strange noise and not cooling properly.'
        },
        {
          type: 'agent',
          time: 8,
          text: 'I understand how uncomfortable that can be, especially during warm weather. I can schedule one of our HVAC technicians to come out and diagnose the issue. What\'s your availability this week?'
        }
      ]
    },
    wrench: {
      audio: './audio/sample-plumbing.mp3',
      image: './images/Hear a Sample Call/sample-home-services_2.png',
      label: 'Plumbing',
      messages: [
        {
          type: 'agent',
          time: 0,
          text: 'Thank you for calling Repair Pro. How can I help you today?'
        },
        {
          type: 'client',
          time: 3,
          text: 'I have a leaky faucet that needs fixing.'
        },
        {
          type: 'agent',
          time: 6,
          text: 'I can help you with that. Let me schedule a plumber for you. When would be a good time?'
        }
      ]
    },
    hammer: {
      audio: './audio/sample-law-firms.mp3',
      image: './images/Hear a Sample Call/sample-home-services_2.png',
      label: 'Law Firms',
      messages: [
        {
          type: 'agent',
          time: 0,
          text: 'Thank you for calling Construction Experts. How may I assist you?'
        },
        {
          type: 'client',
          time: 3,
          text: 'I need an estimate for a kitchen renovation.'
        },
        {
          type: 'agent',
          time: 6,
          text: 'I\'d be happy to help you with that. Let me connect you with one of our project managers to schedule a consultation.'
        }
      ]
    },
    key: {
      audio: './audio/sample-locksmith.mp3',
      image: './images/Hear a Sample Call/sample-home-services_2.png',
      label: 'Locksmith',
      messages: [
        {
          type: 'agent',
          time: 0,
          text: 'Thank you for calling Secure Locks. How can I help you today?'
        },
        {
          type: 'client',
          time: 3,
          text: 'I\'m locked out of my house. I need emergency service.'
        },
        {
          type: 'agent',
          time: 6,
          text: 'I understand this is urgent. I can dispatch a locksmith to your location right away. What\'s your address?'
        }
      ]
    },
    shield: {
      audio: './audio/sample-cyber-security.mp3',
      image: './images/Hear a Sample Call/sample-home-services_2.png',
      label: 'Cyber Security',
      messages: [
        {
          type: 'agent',
          time: 0,
          text: 'Thank you for calling Security Plus. How may I assist you?'
        },
        {
          type: 'client',
          time: 3,
          text: 'I\'m interested in installing a home security system.'
        },
        {
          type: 'agent',
          time: 6,
          text: 'Great! I can help you with that. Let me schedule a free consultation with one of our security specialists.'
        }
      ]
    }
  };

  let currentSample = 'home';
  let audio = null;
  let isPlaying = false;
  let currentTime = 0;
  let displayedMessages = [];
  let animationFrameId = null;

  // Initialize
  function init() {
    const playButton = document.querySelector('.hear-sample-play-button');
    const iconButtons = document.querySelectorAll('.hear-sample-icon-btn');
    const progressBar = document.querySelector('.hear-sample-progress-bar');
    const volumeSlider = document.querySelector('.hear-sample-volume-slider');

    if (!playButton) return;

    // Load initial sample
    loadSample('home');

    // Play/Pause button
    playButton.addEventListener('click', togglePlayPause);

    // Icon menu buttons
    iconButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const samples = ['home', 'wrench', 'hammer', 'key', 'shield'];
        if (samples[index]) {
          switchSample(samples[index], btn);
        }
      });
    });

    // Progress bar click
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        if (!audio) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * audio.duration;
        if (!isNaN(newTime) && isFinite(newTime)) {
          audio.currentTime = newTime;
          // Re-check messages for new time
          displayedMessages = [];
          checkMessages(newTime);
        }
      });
    }

    // Volume control
    if (volumeSlider) {
      volumeSlider.addEventListener('click', (e) => {
        if (!audio) return;
        const rect = volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = percent;
        updateVolumeFill(percent);
      });
    }
  }

  // Load sample
  function loadSample(sampleKey) {
    const sample = sampleData[sampleKey];
    if (!sample) return;

    currentSample = sampleKey;
    displayedMessages = [];
    isPlaying = false;

    // Update image
    const image = document.querySelector('.hear-sample-professional-image');
    if (image && sample.image) {
      image.src = sample.image;
    }

    // Update label
    const label = document.querySelector('.hear-sample-professional-label');
    if (label) {
      label.textContent = sample.label;
    }

    // Clear chat and show initial messages
    const chat = document.querySelector('.hear-sample-chat');
    if (chat) {
      chat.innerHTML = '';
      // Show first message immediately for better UX
      if (sample.messages && sample.messages.length > 0) {
        const firstMessage = sample.messages[0];
        displayMessage(firstMessage, false);
        displayedMessages.push(0);
        // Asegurar que el scroll esté al final (como WhatsApp) cuando se carga un nuevo sample
        setTimeout(() => {
          chat.scrollTop = chat.scrollHeight;
        }, 50);
      }
    }

    // Stop and remove old audio
    if (audio) {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio = null;
    }

    // Create new audio element
    audio = new Audio(sample.audio);
    
    // Handle audio loading
    audio.addEventListener('loadedmetadata', () => {
      updateTimeDisplay(0, audio.duration);
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio file not found:', sample.audio);
      // Show placeholder message in chat
      const chat = document.querySelector('.hear-sample-chat');
      if (chat && chat.children.length === 0) {
        chat.innerHTML = `
          <div class="hear-sample-message hear-sample-message-agent">
            <div class="hear-sample-message-header">
              <div class="hear-sample-avatar hear-sample-avatar-agent">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 12.43 6.67 11.2 10 11.2C13.33 11.2 15.97 12.43 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="#007AFF"/>
                </svg>
              </div>
              <span class="hear-sample-message-author">Revo Agent</span>
            </div>
            <div class="hear-sample-message-bubble hear-sample-message-bubble-agent">
              <p>Audio sample will be available soon. Please add the audio file to enable playback.</p>
            </div>
          </div>
        `;
      }
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      isPlaying = false;
      updatePlayButton();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    // Set initial volume
    audio.volume = 0.7;
    updateVolumeFill(0.7);

    // Reset UI
    updatePlayButton();
    updateProgressFill(0);
    updateTimeDisplay(0, 0);
  }

  // Switch sample
  function switchSample(sampleKey, button) {
    // Update active icon
    document.querySelectorAll('.hear-sample-icon-btn').forEach(btn => {
      btn.classList.remove('hear-sample-icon-btn-active');
    });
    if (button) {
      button.classList.add('hear-sample-icon-btn-active');
    }

    // Load new sample
    loadSample(sampleKey);
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    } else {
      audio.play().catch(err => {
        console.warn('Could not play audio:', err);
      });
      isPlaying = true;
      // Start animation loop for smooth updates
      animateProgress();
    }
    updatePlayButton();
  }

  // Animate progress for smooth updates
  function animateProgress() {
    if (!isPlaying || !audio) return;
    
    updateProgress();
    animationFrameId = requestAnimationFrame(animateProgress);
  }

  // Update play button icon
  function updatePlayButton() {
    const playButton = document.querySelector('.hear-sample-play-button');
    if (!playButton) return;

    if (isPlaying) {
      playButton.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="7.5" width="4" height="15" fill="#007AFF"/>
          <rect x="18" y="7.5" width="4" height="15" fill="#007AFF"/>
        </svg>
      `;
    } else {
      playButton.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 7.5L22.5 15L10 22.5V7.5Z" fill="#007AFF"/>
        </svg>
      `;
    }
  }

  // Update progress
  function updateProgress() {
    if (!audio) return;

    currentTime = audio.currentTime || 0;
    const duration = audio.duration || 0;
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

    updateProgressFill(percent);
    updateTimeDisplay(currentTime, duration);
    checkMessages(currentTime);
  }

  // Update progress fill
  function updateProgressFill(percent) {
    const progressFill = document.querySelector('.hear-sample-progress-fill');
    if (progressFill) {
      progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }
  }

  // Update time display
  function updateTimeDisplay(current, total) {
    const timeDisplays = document.querySelectorAll('.hear-sample-time');
    if (timeDisplays.length >= 2) {
      timeDisplays[0].textContent = formatTime(current);
      timeDisplays[1].textContent = formatTime(total);
    }
  }

  // Format time (seconds to MM:SS)
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Check and display messages based on time
  function checkMessages(currentTime) {
    const sample = sampleData[currentSample];
    if (!sample || !sample.messages) return;

    sample.messages.forEach((message, index) => {
      if (currentTime >= message.time && !displayedMessages.includes(index)) {
        displayMessage(message);
        displayedMessages.push(index);
      }
    });
  }

  // Display message in chat
  function displayMessage(message, animate = true) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `hear-sample-message hear-sample-message-${message.type}`;

    const isAgent = message.type === 'agent';
    const headerClass = isAgent ? 'hear-sample-message-header' : 'hear-sample-message-header hear-sample-message-header-right';

    messageDiv.innerHTML = `
      <div class="${headerClass}">
        ${isAgent ? `
          <div class="hear-sample-avatar hear-sample-avatar-agent">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 12.43 6.67 11.2 10 11.2C13.33 11.2 15.97 12.43 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="#007AFF"/>
            </svg>
          </div>
          <span class="hear-sample-message-author">Revo Agent</span>
        ` : `
          <span class="hear-sample-message-author">Client</span>
          <div class="hear-sample-avatar hear-sample-avatar-client">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 12.43 6.67 11.2 10 11.2C13.33 11.2 15.97 12.43 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="#94A3B8"/>
            </svg>
          </div>
        `}
      </div>
      <div class="hear-sample-message-bubble hear-sample-message-bubble-${message.type}">
        <p>${message.text}</p>
      </div>
    `;

    if (animate) {
      // Add animation
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateY(10px)';
      chat.appendChild(messageDiv);

      // Animate in
      requestAnimationFrame(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
      });
    } else {
      // No animation for initial message
      chat.appendChild(messageDiv);
    }

    // Scroll to bottom (como WhatsApp - siempre al final)
    setTimeout(() => {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
      });
    }, animate ? 100 : 0);
  }

  // Update volume fill
  function updateVolumeFill(percent) {
    const volumeFill = document.querySelector('.hear-sample-volume-fill');
    if (volumeFill) {
      volumeFill.style.width = (Math.max(0, Math.min(1, percent)) * 100) + '%';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// Hear Sample Section - Interactive Audio Player with Chat Sync
(function() {
  'use strict';

  // Use configuration from external file (required)
  // Make sure hear-sample-config.js is loaded before this file
  if (typeof HEAR_SAMPLE_CONFIG === 'undefined') {
    console.error('HEAR_SAMPLE_CONFIG is not defined. Please make sure hear-sample-config.js is loaded before hear-sample.js');
  }
  const sampleData = HEAR_SAMPLE_CONFIG || {};

  let currentSample = 'home';
  let audio = null;
  let isPlaying = false;
  let currentTime = 0;
  let displayedMessages = [];
  let animationFrameId = null;
  let hasStartedPlaying = false; // Track if user has pressed play for the first time
  let typingTimeouts = []; // Store typing animation timeouts to pause/resume
  let isTypingPaused = false; // Track if typing animation is paused

  // Initialize
  function init() {
    const playButton = document.querySelector('.hear-sample-play-button');
    const iconButtons = document.querySelectorAll('.hear-sample-icon-btn');
    const progressBar = document.querySelector('.hear-sample-progress-bar');
    const volumeSlider = document.querySelector('.hear-sample-volume-slider');
    const chat = document.querySelector('.hear-sample-chat');

    if (!playButton) return;

    // Prevent page scroll when scrolling inside chat container
    if (chat) {
      chat.addEventListener('wheel', (e) => {
        // Check if chat is at top or bottom
        const isAtTop = chat.scrollTop === 0;
        const isAtBottom = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 1;
        
        // If scrolling up at top or down at bottom, prevent default to avoid page scroll
        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
          e.preventDefault();
        }
      }, { passive: false });
    }

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

    // Progress bar click and drag
    const progressHandle = document.querySelector('.hear-sample-progress-handle');
    
    if (progressBar) {
      let isDragging = false;
      
      // Click on progress bar
      progressBar.addEventListener('click', (e) => {
        if (isDragging || !audio) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        
        // Wait for audio to be loaded
        if (!audio.duration || isNaN(audio.duration)) {
          audio.addEventListener('loadedmetadata', () => {
            const newTime = percent * audio.duration;
            if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
              seekToTime(newTime, isPlaying); // Preserve playing state
            }
          }, { once: true });
          return;
        }
        
        const newTime = percent * audio.duration;
        if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
          seekToTime(newTime, isPlaying); // Preserve playing state
        }
      });
      
      // Drag handle
      if (progressHandle) {
        progressHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          isDragging = true;
          if (!audio) {
            isDragging = false;
            return;
          }
          
          const rect = progressBar.getBoundingClientRect();
          const wasPlaying = isPlaying;
          
          // Update visual position only during drag (no seeking)
          const updateVisualPosition = (e) => {
            if (!audio || !audio.duration || isNaN(audio.duration)) return;
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = percent * audio.duration;
            if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
              // Only update visual progress, don't seek yet
              updateProgressFill((newTime / audio.duration) * 100);
              updateTimeDisplay(newTime, audio.duration);
            }
          };
          
          const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent page scroll during drag
            updateVisualPosition(e);
          };
          
          const onMouseUp = (e) => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Now seek to the final position
            if (!audio || !audio.duration || isNaN(audio.duration)) {
              const onLoadedMetadata = () => {
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = percent * audio.duration;
                if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
                  seekToTime(newTime, wasPlaying); // Preserve playing state
                }
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
              };
              audio.addEventListener('loadedmetadata', onLoadedMetadata);
            } else {
              const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const newTime = percent * audio.duration;
              if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
                seekToTime(newTime, wasPlaying); // Preserve playing state
              }
            }
          };
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Volume control
    const volumeHandle = document.querySelector('.hear-sample-volume-handle');
    
    if (volumeSlider) {
      let isDraggingVolume = false;
      
      // Click on volume slider
      volumeSlider.addEventListener('click', (e) => {
        if (isDraggingVolume || !audio) return;
        const rect = volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = percent;
        updateVolumeFill(percent);
        updateVolumeIcon(percent);
      });
      
      // Drag volume handle
      if (volumeHandle) {
        volumeHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          e.preventDefault(); // Prevent default behavior
          isDraggingVolume = true;
          if (!audio) return;
          
          const rect = volumeSlider.getBoundingClientRect();
          
          const updateVolumePosition = (e) => {
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audio.volume = percent;
            updateVolumeFill(percent);
            updateVolumeIcon(percent);
          };
          
          updateVolumePosition(e);
          
          const onMouseMove = (e) => {
            if (!isDraggingVolume) return;
            e.preventDefault(); // Prevent page scroll during drag
            updateVolumePosition(e);
          };
          
          const onMouseUp = () => {
            isDraggingVolume = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }
    }
  }

  // Load sample
  function loadSample(sampleKey) {
    const sample = sampleData[sampleKey];
    if (!sample) return;

    currentSample = sampleKey;
    displayedMessages = [];
    isPlaying = false;
    hasStartedPlaying = false; // Reset flag when loading new sample
    
    // Clear typing animation timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    typingTimeouts = [];
    isTypingPaused = false;

    // Update image
    const image = document.querySelector('.hear-sample-professional-image');
    if (image && sample.image) {
      image.src = sample.image;
    }

    // Update title
    const title = document.querySelector('.hear-sample-professional-label');
    if (title && sample.title) {
      title.textContent = sample.title;
    }

    // Show summary card - don't show messages until user presses play
    const chat = document.querySelector('.hear-sample-chat');
    if (chat) {
      updateSummaryCard(sample);
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
                <img src="./images/Hear a Sample Call/revo_profile.png" alt="Revo Agent" />
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
    updateVolumeIcon(0.7);

    // Reset UI
    updatePlayButton();
    updateProgressFill(0);
    updateTimeDisplay(0, 0);
    
    // Initialize handle positions
    const progressHandle = document.querySelector('.hear-sample-progress-handle');
    if (progressHandle) {
      progressHandle.style.left = '0%';
    }
    
    const volumeHandle = document.querySelector('.hear-sample-volume-handle');
    if (volumeHandle) {
      volumeHandle.style.left = '70%';
    }
  }

  // Update summary card with sample data
  function updateSummaryCard(sample) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;

    // Default values if not provided
    const cardTitle = sample.cardTitle || sample.title || 'Sample Call';
    const cardIcon = sample.cardIcon || './images/icons/fa7-solid_home-lg.svg';
    const customerIssue = sample.customerIssue || 'Customer issue description';
    const revoActions = sample.revoActions || [
      'Greets professionally',
      'Shows empathy',
      'Collects job details',
      'Schedules service'
    ];
    const whyItMatters = sample.whyItMatters || 'Revo handles calls with clarity and confidence.';

    chat.innerHTML = `
      <div class="hear-sample-summary-card">
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Customer Issue:</p>
          <p class="hear-sample-summary-issue">${customerIssue}</p>
        </div>
        
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Revo Action:</p>
          <ul class="hear-sample-summary-actions">
            ${revoActions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Why it matters:</p>
          <p class="hear-sample-summary-why">${whyItMatters}</p>
        </div>
      </div>
    `;
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
      
      // Pause typing animation
      isTypingPaused = true;
      
      // Pause Lottie animation
      if (lottieElementRef) {
        // Try different methods to pause the animation
        if (typeof lottieElementRef.pause === 'function') {
          lottieElementRef.pause();
        } else if (lottieElementRef.setAttribute) {
          lottieElementRef.removeAttribute('autoplay');
        }
      }
    } else {
      // Check if this is the first time playing
      if (!hasStartedPlaying) {
        hasStartedPlaying = true;
        
        // Clear chat and start from beginning
        const chat = document.querySelector('.hear-sample-chat');
        if (chat) {
          chat.innerHTML = '';
        }
        
        // Reset displayed messages
        displayedMessages = [];
        currentTime = 0;
        audio.currentTime = 0;
        
        // Reset progress display
        updateProgressFill(0);
        updateTimeDisplay(0, audio.duration);
        
        // Reset handle position
        const progressHandle = document.querySelector('.hear-sample-progress-handle');
        if (progressHandle) {
          progressHandle.style.left = '0%';
        }
      } else {
        // Check if audio has ended - if so, restart from beginning
        if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.1)) {
          // Reset audio and chat to beginning
          audio.currentTime = 0;
          currentTime = 0;
          
          // Clear chat and rebuild it from the beginning
          const chat = document.querySelector('.hear-sample-chat');
          if (chat) {
            chat.innerHTML = '';
          }
          
          // Reset displayed messages
          displayedMessages = [];
          // Keep hasStartedPlaying as true - user has already started playing
          
          // Reset progress display
          updateProgressFill(0);
          updateTimeDisplay(0, audio.duration);
          
          // Reset handle position
          const progressHandle = document.querySelector('.hear-sample-progress-handle');
          if (progressHandle) {
            progressHandle.style.left = '0%';
          }
        }
      }
      
      audio.play().catch(err => {
        console.warn('Could not play audio:', err);
      });
      isPlaying = true;
      
      // Resume typing animation
      isTypingPaused = false;
      
      // Resume Lottie animation
      if (lottieElementRef) {
        // Try different methods to play the animation
        if (typeof lottieElementRef.play === 'function') {
          lottieElementRef.play();
        } else if (lottieElementRef.setAttribute) {
          lottieElementRef.setAttribute('autoplay', '');
        }
      }
      
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
      // Pause icon
      playButton.innerHTML = `
        <img src="./images/icons/pause.svg" alt="Pause" class="hear-sample-play-icon">
      `;
    } else {
      // Play icon
      playButton.innerHTML = `
        <img src="./images/icons/play.svg" alt="Play" class="hear-sample-play-icon">
      `;
    }
  }

  // Update volume icon based on volume level
  function updateVolumeIcon(volume) {
    const volumeIcon = document.querySelector('.hear-sample-volume-icon');
    if (!volumeIcon) return;

    if (volume === 0) {
      volumeIcon.src = './images/icons/volume_mute.svg';
    } else if (volume < 0.33) {
      volumeIcon.src = './images/icons/volume_low.svg';
    } else if (volume < 0.66) {
      volumeIcon.src = './images/icons/volume_medium.svg';
    } else {
      volumeIcon.src = './images/icons/volume_high.svg';
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
    const progressHandle = document.querySelector('.hear-sample-progress-handle');
    const progressBar = document.querySelector('.hear-sample-progress-bar');
    
    if (progressFill) {
      progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }
    
    if (progressHandle && progressBar) {
      progressHandle.style.left = Math.max(0, Math.min(100, percent)) + '%';
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

  // Seek to specific time and update chat accordingly
  function seekToTime(newTime, preservePlayingState = false) {
    if (!audio) return;
    
    // Ensure audio duration is valid
    if (!audio.duration || isNaN(audio.duration)) {
      // Wait for audio to be ready
      const onLoadedMetadata = () => {
        seekToTime(newTime, preservePlayingState);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      };
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      return;
    }
    
    // Clamp newTime to valid range
    newTime = Math.max(0, Math.min(audio.duration, newTime));
    
    // Preserve playing state
    const wasPlaying = isPlaying;
    
    // Set audio time - ensure it's set correctly
    try {
      // Set the audio time
      audio.currentTime = newTime;
      // Immediately update our currentTime variable to keep it in sync
      currentTime = newTime;
      
      // Use the 'seeked' event to ensure the seek actually completed
      const onSeeked = () => {
        // Verify the seek worked correctly
        const actualTime = audio.currentTime || 0;
        const timeDiff = Math.abs(actualTime - newTime);
        if (timeDiff > 0.1) {
          // Seek didn't work as expected, try once more
          audio.currentTime = newTime;
          currentTime = newTime;
        } else {
          // Seek was successful, update currentTime to match actual audio time
          currentTime = actualTime;
        }
        audio.removeEventListener('seeked', onSeeked);
      };
      audio.addEventListener('seeked', onSeeked, { once: true });
    } catch (err) {
      console.warn('Error seeking audio:', err);
      currentTime = newTime;
    }
    
    // Clear chat and rebuild it with messages up to the new time
    const chat = document.querySelector('.hear-sample-chat');
    if (chat) {
      chat.innerHTML = '';
    }
    
    // Mark as started if user is seeking (interacting with the player)
    hasStartedPlaying = true;
    
    // Reset displayed messages and rebuild based on new time
    // When seeking, show all messages immediately without animation
    displayedMessages = [];
    const sample = sampleData[currentSample];
    if (sample && sample.messages) {
      sample.messages.forEach((message, index) => {
        if (newTime >= message.time) {
          // When seeking, show messages immediately without typing animation
          displayMessage(message, false, index);
          displayedMessages.push(index);
        }
      });
    }
    
    // Update progress display
    updateProgressFill((newTime / audio.duration) * 100);
    updateTimeDisplay(newTime, audio.duration);
    
    // Update active message indicator
    updateActiveMessage(newTime);
    
    // Scroll to active message or bottom (within chat container only)
    if (chat) {
      requestAnimationFrame(() => {
        const activeMessage = chat.querySelector('.hear-sample-message.active');
        if (activeMessage) {
          // Scroll within chat container, not the page
          const chatRect = chat.getBoundingClientRect();
          const messageRect = activeMessage.getBoundingClientRect();
          const messageTopRelativeToChat = messageRect.top - chatRect.top + chat.scrollTop;
          const targetScroll = messageTopRelativeToChat - (chat.clientHeight / 2) + (messageRect.height / 2);
          // Use scrollTop directly instead of scrollTo to avoid page scroll
          chat.scrollTop = Math.max(0, targetScroll);
        } else {
          chat.scrollTop = chat.scrollHeight;
        }
      });
    }
    
    // Restore playing state if it was playing
    if (wasPlaying && preservePlayingState) {
      audio.play().catch(err => {
        console.warn('Could not resume audio after seek:', err);
        isPlaying = false;
        updatePlayButton();
      });
    }
  }

  // Check and display messages based on time
  function checkMessages(currentTime) {
    // Only check messages if user has started playing
    if (!hasStartedPlaying) return;
    
    const sample = sampleData[currentSample];
    if (!sample || !sample.messages) return;

    sample.messages.forEach((message, index) => {
      if (currentTime >= message.time && !displayedMessages.includes(index)) {
        displayMessage(message, true, index);
        displayedMessages.push(index);
      }
    });
    
    // Update active message indicator
    updateActiveMessage(currentTime);
  }

  // Show listening indicator (Lottie animation) when client is speaking
  let listeningIndicatorElement = null; // Store reference to prevent recreation
  let lottieElementRef = null; // Store reference to Lottie element for pause/play control
  function showListeningIndicator() {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return null;

    // If indicator already exists, do nothing
    if (listeningIndicatorElement && chat.contains(listeningIndicatorElement)) {
      return listeningIndicatorElement;
    }

    // Create listening indicator message
    const listeningDiv = document.createElement('div');
    listeningDiv.className = 'hear-sample-message hear-sample-message-agent hear-sample-listening-indicator';
    listeningDiv.innerHTML = `
      <div class="hear-sample-message-bubble hear-sample-message-bubble-agent">
        <dotlottie-wc 
          src="https://lottie.host/071a23b7-df8a-46c3-b3d1-b3137a45bedc/z56G1f9QJh.lottie" 
          class="hear-sample-lottie-animation"
          autoplay 
          loop>
        </dotlottie-wc>
        <span class="hear-sample-message-author">Revo agent is listening</span>
      </div>
    `;

    chat.appendChild(listeningDiv);
    listeningIndicatorElement = listeningDiv; // Store reference
    
    // Get reference to Lottie element after it's added to DOM
    requestAnimationFrame(() => {
      lottieElementRef = listeningDiv.querySelector('dotlottie-wc');
      chat.scrollTop = chat.scrollHeight;
    });

    return listeningDiv;
  }

  // Remove listening indicator
  function removeListeningIndicator() {
    if (listeningIndicatorElement) {
      listeningIndicatorElement.remove();
      listeningIndicatorElement = null;
      lottieElementRef = null;
    }
  }

  // Update active message indicator based on current time
  function updateActiveMessage(currentTime) {
    const sample = sampleData[currentSample];
    if (!sample || !sample.messages) return;

    // Remove active class from all messages
    const chat = document.querySelector('.hear-sample-chat');
    if (chat) {
      chat.querySelectorAll('.hear-sample-message').forEach(msg => {
        msg.classList.remove('active');
      });
    }

    // Find the current active message (the last message whose time has passed)
    let activeIndex = -1;
    for (let i = sample.messages.length - 1; i >= 0; i--) {
      if (currentTime >= sample.messages[i].time) {
        activeIndex = i;
        break;
      }
    }

    // Add active class to current message
    if (activeIndex >= 0) {
      const activeMessage = chat?.querySelector(`[data-message-index="${activeIndex}"]`);
      const activeMessageData = sample.messages[activeIndex];
      
      if (activeMessage) {
        activeMessage.classList.add('active');
        
        // Check if active message is from client - show listening indicator
        if (activeMessageData.type === 'client') {
          // Only show listening indicator if there's a next message (agent will respond)
          const nextMessage = sample.messages[activeIndex + 1];
          if (nextMessage) {
            // Show listening indicator while client is speaking and agent will respond
            showListeningIndicator();
          } else {
            // Client is the last message - no need to show listening indicator
            removeListeningIndicator();
          }
        } else {
          // Remove listening indicator when agent starts speaking
          removeListeningIndicator();
        }
        
        // Scroll to active message within chat container only (not the page)
        // Use requestAnimationFrame to prevent page scroll interference
        requestAnimationFrame(() => {
          const chatRect = chat.getBoundingClientRect();
          const messageRect = activeMessage.getBoundingClientRect();
          
          // Check if message is not fully visible within chat container
          const messageTopRelativeToChat = messageRect.top - chatRect.top + chat.scrollTop;
          const messageBottomRelativeToChat = messageRect.bottom - chatRect.top + chat.scrollTop;
          const chatViewportTop = chat.scrollTop;
          const chatViewportBottom = chat.scrollTop + chat.clientHeight;
          
          // Only scroll if message is outside viewport
          if (messageTopRelativeToChat < chatViewportTop || messageBottomRelativeToChat > chatViewportBottom) {
            // Calculate center position within chat container
            const targetScroll = messageTopRelativeToChat - (chat.clientHeight / 2) + (messageRect.height / 2);
            // Use scrollTop directly instead of scrollTo to avoid page scroll
            chat.scrollTop = Math.max(0, targetScroll);
          }
        });
      }
    } else {
      // No active message - remove listening indicator
      removeListeningIndicator();
    }
  }

  // Display thinking indicator for agent messages
  function showThinkingIndicator(callback) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) {
      callback();
      return;
    }

    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'hear-sample-message hear-sample-message-agent hear-sample-thinking';
    thinkingDiv.innerHTML = `
      <div class="hear-sample-message-header">
        <div class="hear-sample-avatar hear-sample-avatar-agent">
          <img src="./images/Hear a Sample Call/revo_profile.png" alt="Revo Agent" />
        </div>
        <span class="hear-sample-message-author">Revo Agent</span>
      </div>
      <div class="hear-sample-message-bubble hear-sample-message-bubble-agent">
        <div class="hear-sample-thinking-dots">
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    chat.appendChild(thinkingDiv);
    
    // Scroll to show thinking indicator
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
    });

    // Show thinking indicator for a short time (500-800ms)
    setTimeout(() => {
      thinkingDiv.remove();
      callback();
    }, 600);
  }

  // Type message letter by letter with opacity transition
  // durationMs: duration in milliseconds that the typing animation should take
  function typeMessage(text, element, onComplete, durationMs = null) {
    const textArray = text.split('');
    let currentIndex = 0;
    let currentTimeout = null;
    
    // Clear element first
    element.innerHTML = '';
    
    // Clear any existing typing timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    typingTimeouts = [];
    
    // Calculate delay per character based on duration
    let delayPerChar = 30; // Default delay
    if (durationMs && textArray.length > 0) {
      // Calculate delay to match audio duration
      delayPerChar = Math.max(10, durationMs / textArray.length);
    }
    
    function typeNextLetter() {
      if (isTypingPaused) {
        // If paused, wait and check again
        currentTimeout = setTimeout(typeNextLetter, 50);
        typingTimeouts.push(currentTimeout);
        return;
      }
      
      if (currentIndex < textArray.length) {
        const span = document.createElement('span');
        span.textContent = textArray[currentIndex];
        span.style.opacity = '0';
        element.appendChild(span);
        
        // Animate opacity
        requestAnimationFrame(() => {
          span.style.transition = 'opacity 0.1s ease';
          span.style.opacity = '1';
        });
        
        currentIndex++;
        
        // Use calculated delay to match audio duration
        currentTimeout = setTimeout(typeNextLetter, delayPerChar);
        typingTimeouts.push(currentTimeout);
      } else {
        if (onComplete) onComplete();
      }
    }
    
    typeNextLetter();
  }

  // Display message in chat
  function displayMessage(message, animate = true, messageIndex = null) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `hear-sample-message hear-sample-message-${message.type}`;
    
    // Add data attribute to identify message by index
    if (messageIndex !== null) {
      messageDiv.setAttribute('data-message-index', messageIndex);
    }

    const isAgent = message.type === 'agent';
    const headerClass = isAgent ? 'hear-sample-message-header' : 'hear-sample-message-header hear-sample-message-header-right';
    
    // Calculate message duration for agent messages
    // Make animation finish slightly before audio ends (85% of duration)
    let messageDuration = null;
    if (isAgent && messageIndex !== null) {
      const sample = sampleData[currentSample];
      if (sample && sample.messages) {
        const currentMessage = sample.messages[messageIndex];
        const nextMessage = sample.messages[messageIndex + 1];
        
        let rawDuration = null;
        if (nextMessage) {
          // Duration is from current message time to next message time
          rawDuration = (nextMessage.time - currentMessage.time) * 1000; // Convert to milliseconds
        } else if (audio && audio.duration) {
          // Last message: duration is from message time to end of audio
          rawDuration = (audio.duration - currentMessage.time) * 1000; // Convert to milliseconds
        }
        
        // Make animation finish 15% earlier (85% of original duration)
        if (rawDuration) {
          messageDuration = rawDuration * 0.50;
        }
      }
    }

    // For agent messages, show header immediately but delay bubble content
    messageDiv.innerHTML = `
      <div class="${headerClass}">
        ${isAgent ? `
          <div class="hear-sample-avatar hear-sample-avatar-agent">
            <img src="./images/Hear a Sample Call/revo_profile.png" alt="Revo Agent" />
          </div>
          <span class="hear-sample-message-author">Revo Agent</span>
        ` : `
          <span class="hear-sample-message-author">Client</span>
          <div class="hear-sample-avatar hear-sample-avatar-client">
            <img src="./images/Hear a Sample Call/client_profile.png" alt="Client" />
          </div>
        `}
      </div>
      <div class="hear-sample-message-bubble hear-sample-message-bubble-${message.type}">
        <p></p>
      </div>
    `;

    if (animate) {
      // Add animation for message container
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateY(10px)';
      chat.appendChild(messageDiv);

      // Animate in container
      requestAnimationFrame(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
      });

      // For agent messages, type message directly without thinking indicator
      if (isAgent) {
        const textElement = messageDiv.querySelector('.hear-sample-message-bubble p');
        typeMessage(message.text, textElement, () => {
          // Scroll after typing completes
          requestAnimationFrame(() => {
            chat.scrollTop = chat.scrollHeight;
          });
        }, messageDuration);
      } else {
        // For client messages, show immediately
        const textElement = messageDiv.querySelector('.hear-sample-message-bubble p');
        textElement.textContent = message.text;
        requestAnimationFrame(() => {
          chat.scrollTop = chat.scrollHeight;
        });
      }
    } else {
      // No animation - show messages immediately (used when seeking)
      chat.appendChild(messageDiv);
      const textElement = messageDiv.querySelector('.hear-sample-message-bubble p');
      // Show text immediately without typing animation when seeking
      textElement.textContent = message.text;
      requestAnimationFrame(() => {
        chat.scrollTop = chat.scrollHeight;
      });
    }
  }

  // Update volume fill
  function updateVolumeFill(percent) {
    const volumeFill = document.querySelector('.hear-sample-volume-fill');
    const volumeHandle = document.querySelector('.hear-sample-volume-handle');
    const volumeSlider = document.querySelector('.hear-sample-volume-slider');
    
    if (volumeFill) {
      volumeFill.style.width = (Math.max(0, Math.min(1, percent)) * 100) + '%';
    }
    
    if (volumeHandle && volumeSlider) {
      volumeHandle.style.left = (Math.max(0, Math.min(1, percent)) * 100) + '%';
    }
    
    // Update volume icon
    updateVolumeIcon(percent);
  }

  // Handle keyboard shortcuts
  function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts if user is typing in an input, textarea, or contenteditable
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );

    if (isInputFocused) return;

    // Check if audio player section is visible
    const audioPlayer = document.querySelector('.hear-sample-audio-player');
    if (!audioPlayer || !audio) return;

    // Check if the section is in viewport (optional - can be removed if you want shortcuts to work globally)
    const section = audioPlayer.closest('.hear-sample-section');
    if (section) {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;
    }

    switch(e.key) {
      case ' ':
      case 'Spacebar':
        e.preventDefault();
        togglePlayPause();
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        if (audio && audio.duration && !isNaN(audio.duration)) {
          const newTime = Math.max(0, (audio.currentTime || 0) - 5);
          seekToTime(newTime, isPlaying); // Preserve playing state
        }
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        if (audio && audio.duration && !isNaN(audio.duration)) {
          const newTime = Math.min(audio.duration, (audio.currentTime || 0) + 5);
          seekToTime(newTime, isPlaying); // Preserve playing state
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        const currentVolume = audio.volume;
        const newVolumeUp = Math.min(1, currentVolume + 0.1);
        audio.volume = newVolumeUp;
        updateVolumeFill(newVolumeUp);
        updateVolumeIcon(newVolumeUp);
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        const currentVol = audio.volume;
        const newVolumeDown = Math.max(0, currentVol - 0.1);
        audio.volume = newVolumeDown;
        updateVolumeFill(newVolumeDown);
        updateVolumeIcon(newVolumeDown);
        break;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// Hear Sample Section - Interactive Audio Player with Chat Sync
(function() {
  'use strict';

  // Use configuration from external file (required)
  // Make sure hear-sample-config.js is loaded before this file
  if (typeof HEAR_SAMPLE_CONFIG === 'undefined') {
    console.error('HEAR_SAMPLE_CONFIG is not defined. Please make sure hear-sample-config.js is loaded before hear-sample.js');
  }
  const sampleData = HEAR_SAMPLE_CONFIG || {};

  // Map industry names to sample keys
  const industryToSampleKey = {
    'Home Services': 'home',
    'Plumbing': 'wrench',
    'Legal': 'hammer',
    'Legal Services': 'hammer',
    'Locksmith': 'key',
    'Cybersecurity': 'shield',
    'IT, Technology & Communications': 'shield',
    'Air Duct Cleaning': 'air-duct-cleaning',
    'HVAC': 'hvac',
    'Chimney Sweep': 'chimney-sweep',
    'Lawn Care': 'lawn-care',
    'Restoration': 'restoration',
    'Junk Removal': 'junk-removal',
    'Pressure Washing': 'pressure-washing',
    'Carpet Cleaning': 'carpet-cleaning',
    'Computer Repair': 'computer-repair',
    'Pest Control': 'pest-control',
    'Snow Removal': 'snow-removal',
    'Roofing': 'roofing',
    'Landscape': 'landscape',
    'Construction': 'construction',
    'Maid & Cleaning': 'maid-cleaning',
    'Electrical': 'electrical',
    'Property Maintenance': 'property-maintenance',
    'General Contracting': 'general-contracting',
    'Towing': 'towing',
    'Moving': 'moving',
    'Handyman': 'handyman',
    'Alarm & Security': 'alarm-security',
    'Pool Services': 'pool-services',
    'Appliance Repair': 'appliance-repair',
    'Solar Installation': 'solar-installation',
    'Garage Door': 'garage-door',
    'Painting': 'painting',
    'Tilling': 'tilling',
    'Window Cleaning': 'window-cleaning',
    'Healthcare & Medical': 'healthcare-medical',
    'Financial Service': 'financial-service',
    'Real Estate & Property Management': 'real-estate-property-management',
    'Small Business': 'small-business',
    'Corporate & Government': 'corporate-government',
    'Retail & eCommerce': 'retail-ecommerce',
    'Marketing, Media & Advertising': 'marketing-media-advertising',
    'Franchises': 'franchises',
    'Tourism, Travel & Hospitality': 'tourism-travel-hospitality',
    'Building, Construction & Trades': 'building-construction-trades'
  };

  let currentSample = 'key'; // Locksmith Pros (has audio); home is placeholder until sample-home-services.mp3 is added
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

    // Load initial sample (Locksmith has audio; home is placeholder)
    loadSample('key');

    // Play/Pause button
    playButton.addEventListener('click', togglePlayPause);

    // Icon menu buttons - handle both desktop and mobile menus
    const desktopIconButtons = document.querySelectorAll('.hear-sample-service-icons-menu .hear-sample-icon-btn');
    const mobileIconButtons = document.querySelectorAll('.hear-sample-mobile-icons .hear-sample-icon-btn');
    const samples = ['home', 'key'];

    // Desktop menu buttons
    desktopIconButtons.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (samples[index]) {
          // Update active state for both menus
          desktopIconButtons.forEach(b => b.classList.remove('hear-sample-icon-btn-active'));
          mobileIconButtons.forEach(b => b.classList.remove('hear-sample-icon-btn-active'));
          btn.classList.add('hear-sample-icon-btn-active');
          if (mobileIconButtons[index]) {
            mobileIconButtons[index].classList.add('hear-sample-icon-btn-active');
          }
          switchSample(samples[index], btn);
        }
      });
    });

    // Mobile menu buttons
    mobileIconButtons.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (samples[index]) {
          // Update active state for both menus
          desktopIconButtons.forEach(b => b.classList.remove('hear-sample-icon-btn-active'));
          mobileIconButtons.forEach(b => b.classList.remove('hear-sample-icon-btn-active'));
          btn.classList.add('hear-sample-icon-btn-active');
          if (desktopIconButtons[index]) {
            desktopIconButtons[index].classList.add('hear-sample-icon-btn-active');
          }
          switchSample(samples[index], btn);
        }
      });
    });

    // Progress bar click and drag
    const progressHandle = document.querySelector('.hear-sample-progress-handle');
    const progressContainer = document.querySelector('.hear-sample-progress-container');
    
    // Helper function to handle seeking
    const handleSeek = (e, preservePlaying = true) => {
      if (!audio || !progressBar) return;
      
      const rect = progressBar.getBoundingClientRect();
      let clientX = 0;
      if (e.clientX !== undefined) {
        clientX = e.clientX;
      } else if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
      }
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      
      // Wait for audio to be loaded
      if (!audio.duration || isNaN(audio.duration)) {
        audio.addEventListener('loadedmetadata', () => {
          const newTime = percent * audio.duration;
          if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
            seekToTime(newTime, preservePlaying ? isPlaying : false);
          }
        }, { once: true });
        return;
      }
      
      const newTime = percent * audio.duration;
      if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
        seekToTime(newTime, preservePlaying ? isPlaying : false);
      }
    };
    
    if (progressBar) {
      let isDragging = false;
      
      // Click on progress bar (mouse)
      progressBar.addEventListener('click', (e) => {
        if (isDragging || !audio) return;
        // Don't seek if clicking directly on the handle
        if (progressHandle && progressHandle.contains(e.target)) {
          return;
        }
        e.stopPropagation();
        handleSeek(e, true);
      });
      
      // Touch support for mobile
      progressBar.addEventListener('touchend', (e) => {
        if (isDragging || !audio) return;
        // Don't seek if clicking directly on the handle
        if (progressHandle && progressHandle.contains(e.target)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        handleSeek(e, true);
      });
      
      // Drag handle (mouse)
      if (progressHandle) {
        const startDrag = (e) => {
          e.stopPropagation();
          e.preventDefault();
          isDragging = true;
          if (!audio || !progressBar) {
            isDragging = false;
            return;
          }
          
          const rect = progressBar.getBoundingClientRect();
          const wasPlaying = isPlaying;
          const getClientX = (e) => {
            if (e.clientX !== undefined) return e.clientX;
            if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
            if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
            return 0;
          };
          
          // Update visual position only during drag (no seeking)
          const updateVisualPosition = (e) => {
            if (!audio || !audio.duration || isNaN(audio.duration)) return;
            const clientX = getClientX(e);
            const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newTime = percent * audio.duration;
            if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
              // Only update visual progress, don't seek yet
              updateProgressFill((newTime / audio.duration) * 100);
              updateTimeDisplay(newTime, audio.duration);
            }
          };
          
          const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateVisualPosition(e);
          };
          
          const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
            
            // Now seek to the final position
            if (!audio || !audio.duration || isNaN(audio.duration)) {
              const onLoadedMetadata = () => {
                const clientX = getClientX(e);
                const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                const newTime = percent * audio.duration;
                if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
                  seekToTime(newTime, wasPlaying);
                }
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
              };
              audio.addEventListener('loadedmetadata', onLoadedMetadata);
            } else {
              const clientX = getClientX(e);
              const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
              const newTime = percent * audio.duration;
              if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
                seekToTime(newTime, wasPlaying);
              }
            }
          };
          
          // Add both mouse and touch event listeners
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onEnd);
          document.addEventListener('touchmove', onMove, { passive: false });
          document.addEventListener('touchend', onEnd);
        };
        
        progressHandle.addEventListener('mousedown', startDrag);
        progressHandle.addEventListener('touchstart', startDrag, { passive: false });
      }
      
      // Also allow clicking on the progress container
      if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
          // Only handle if clicking on the container itself, not on child elements that have their own handlers
          if (e.target === progressContainer || e.target.classList.contains('hear-sample-time')) {
            if (isDragging || !audio) return;
            handleSeek(e, true);
          }
        });
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Listen for industry sample change from new dropdown
    document.addEventListener('industrySampleChange', function(e) {
      const sampleKey = e.detail.sampleKey;
      const selectedOption = e.detail.selectedOption;
      if (sampleKey) {
        switchSample(sampleKey, null, selectedOption);
      }
    });

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
  function loadSample(sampleKey, selectedOption) {
    // Get industry name from selected option if available
    let industryName = null;
    if (selectedOption) {
      industryName = selectedOption.getAttribute('data-industry') || selectedOption.textContent.trim();
    }
    
    // Try to find the correct sample key based on industry name
    let actualSampleKey = sampleKey;
    if (industryName && industryToSampleKey[industryName]) {
      actualSampleKey = industryToSampleKey[industryName];
    }
    
    // Get sample data
    const sample = sampleData[actualSampleKey];
    if (!sample) {
      // If sample doesn't exist, try to use the original sampleKey as fallback
      const fallbackSample = sampleData[sampleKey];
      if (fallbackSample) {
        actualSampleKey = sampleKey;
      } else {
        return; // No sample found
      }
    }
    
    const finalSample = sampleData[actualSampleKey];
    if (!finalSample) return;

    currentSample = actualSampleKey;
    displayedMessages = [];
    isPlaying = false;
    hasStartedPlaying = false; // Reset flag when loading new sample
    
    // Clear typing animation timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    typingTimeouts = [];
    isTypingPaused = false;

    // Check if we're in hear-sample-call-page (only once)
    const pageSection = document.querySelector('.hear-sample-call-page');
    
    // Update image - check if we're in hear-sample-call-page first
    const image = pageSection 
      ? pageSection.querySelector('.hear-sample-professional-image')
      : document.querySelector('.hear-sample-professional-image');
    
    // Only update image if not in hear-sample-call-page (that page uses example_call.png)
    if (image && finalSample.image && !pageSection) {
      const normalizedImagePath = finalSample.image.replace(
        '/Hear a Sample Call/',
        '/hear-a-sample-call/'
      );
      // Defensive fallback so bad config paths do not render a broken panel image.
      image.onerror = () => {
        image.onerror = null;
        image.src = './images/hear-a-sample-call/sample-home-services_pros_2.webp';
      };
      image.src = normalizedImagePath;
    }

    // Update title - check context first
    // Don't update title in hear-sample-call-page, it should stay as "Choose your industry"
    if (!pageSection) {
      const title = document.querySelector('.hear-sample-professional-label');
      if (title && finalSample.title) {
        title.textContent = finalSample.title;
      }
    }

    // Update industry button text if it exists - only in hear-sample-call-page
    if (pageSection) {
      const industryButton = document.getElementById('hearSampleIndustryButton');
      const industryButtonText = industryButton?.querySelector('.hear-sample-industry-button-text');
      const industryButtonIcon = industryButton?.querySelector('img');
      
      if (industryButtonText && finalSample.title) {
        industryButtonText.textContent = finalSample.title;
      }
      
      // Update button icon based on sample key
      if (industryButtonIcon) {
        // Update button icon from selected option if available
        if (selectedOption && selectedOption.querySelector('img')) {
          industryButtonIcon.src = selectedOption.querySelector('img').src;
        } else {
          // Fallback to icon map
          const iconMap = {
            'home': 'images/icons/fa7-solid_home-lg.svg',
            'wrench': 'images/icons/fa6-solid_wrench.svg',
            'hammer': 'images/icons/fa6-solid_hammer.svg',
            'key': 'images/icons/fa7-solid_key_.svg',
            'shield': 'images/icons/fa6-solid_shield-halved.svg'
          };
          if (iconMap[actualSampleKey]) {
            industryButtonIcon.src = iconMap[actualSampleKey];
          }
        }
      }
      
      // Update active state in dropdown - only mark the specific selected option
      // Don't mark all options with the same data-sample, only the one that was actually selected
      const industryOptions = pageSection.querySelectorAll('.hear-sample-industry-option');
      industryOptions.forEach(opt => {
        opt.classList.remove('hear-sample-industry-option-active');
      });
      
      // Only mark as active if we have a specific selected option passed as parameter
      // Otherwise, find the first option with matching sampleKey (for backward compatibility)
      if (selectedOption) {
        selectedOption.classList.add('hear-sample-industry-option-active');
      } else {
        // Fallback: find first option with matching sampleKey (for cases where selectedOption is not provided)
        const firstMatchingOption = Array.from(industryOptions).find(opt => 
          opt.getAttribute('data-sample') === sampleKey
        );
        if (firstMatchingOption) {
          firstMatchingOption.classList.add('hear-sample-industry-option-active');
        }
      }
    }

    // Show messages or summary card
    // Always search globally for chat, as it should work in both pages
    const chat = document.querySelector('.hear-sample-chat');
    if (chat) {
      // Remove notification if it exists
      const existingNotification = chat.querySelector('.hear-sample-revo-notification');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      // Always show summary card initially - messages will appear when user presses play
      updateSummaryCard(finalSample);
    }

    // Stop and remove old audio
    if (audio) {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio = null;
    }

    // Create new audio element
    audio = new Audio(finalSample.audio);
    
    // Handle audio loading
    audio.addEventListener('loadedmetadata', () => {
      updateTimeDisplay(0, audio.duration);
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio file not found:', finalSample.audio);
      // Show placeholder message in chat - always search globally
      const chat = document.querySelector('.hear-sample-chat');
      if (chat && chat.children.length === 0) {
        chat.innerHTML = `
          <div class="hear-sample-message hear-sample-message-agent">
            <div class="hear-sample-message-header">
              <div class="hear-sample-avatar hear-sample-avatar-agent">
                <img src="./images/hear-a-sample-call/revo_profile.webp" alt="Revo Agent" />
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
      // Show notification asking if user wants to start using Revo
      showRevoStartNotification();
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

  // Show preconfigured messages from sample config in chat (for industries with messages but no audio yet)
  function showPreconfiguredMessages(messages, chat) {
    // Clear chat and display messages immediately
    chat.innerHTML = '';
    messages.forEach((message, index) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `hear-sample-message hear-sample-message-${message.type}`;
      
      const messageHeader = document.createElement('div');
      messageHeader.className = 'hear-sample-message-header';
      
      const avatar = document.createElement('div');
      avatar.className = message.type === 'agent' 
        ? 'hear-sample-avatar hear-sample-avatar-agent'
        : 'hear-sample-avatar hear-sample-avatar-client';
      
      if (message.type === 'agent') {
        avatar.innerHTML = '<img src="./images/hear-a-sample-call/revo_profile.webp" alt="Revo Agent" />';
      } else {
        avatar.innerHTML = '<img src="./images/hear-a-sample-call/customer_profile.webp" alt="Customer" />';
      }
      
      const author = document.createElement('span');
      author.className = 'hear-sample-message-author';
      author.textContent = message.type === 'agent' ? 'Revo Agent' : 'Customer';
      
      if (message.type === 'agent') {
        messageHeader.appendChild(avatar);
        messageHeader.appendChild(author);
      } else {
        messageHeader.appendChild(author);
        messageHeader.appendChild(avatar);
      }
      
      const bubble = document.createElement('div');
      bubble.className = `hear-sample-message-bubble hear-sample-message-bubble-${message.type}`;
      const text = document.createElement('p');
      text.textContent = message.text;
      bubble.appendChild(text);
      
      messageDiv.appendChild(messageHeader);
      messageDiv.appendChild(bubble);
      
      chat.appendChild(messageDiv);
    });
  }

  // Update summary card with sample data
  function updateSummaryCard(sample) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;

    // Summary content: concise title, how Revo helped, why it matters
    const customerIssue = sample.customerIssue || 'Customer issue description';
    const revoAction = sample.revoAction; // narrative paragraph
    const revoActions = sample.revoActions || [
      'Greets professionally',
      'Shows empathy',
      'Collects job details',
      'Schedules service'
    ];
    const whyItMatters = sample.whyItMatters || 'Revo handles calls with clarity and confidence.';

    const revoActionHtml = revoAction
      ? `<p class="hear-sample-summary-action">${revoAction}</p>`
      : `<ul class="hear-sample-summary-actions">${revoActions.map(a => `<li>${a}</li>`).join('')}</ul>`;

    chat.innerHTML = `
      <div class="hear-sample-summary-card">
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Customer Issue</p>
          <p class="hear-sample-summary-issue">${customerIssue}</p>
        </div>
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Revo Action</p>
          ${revoActionHtml}
        </div>
        <div class="hear-sample-summary-section">
          <p class="hear-sample-summary-label">Why It Matters</p>
          <p class="hear-sample-summary-why">${whyItMatters}</p>
        </div>
      </div>
    `;
  }

  // Switch sample
  function switchSample(sampleKey, button, selectedOption) {
    // Update active icon
    document.querySelectorAll('.hear-sample-icon-btn').forEach(btn => {
      btn.classList.remove('hear-sample-icon-btn-active');
    });
    if (button) {
      button.classList.add('hear-sample-icon-btn-active');
    }

    // Load new sample
    loadSample(sampleKey, selectedOption);
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
        
        // Reset displayed messages - they will appear progressively as audio plays
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
            // Remove notification if it exists
            const existingNotification = chat.querySelector('.hear-sample-revo-notification');
            if (existingNotification) {
              existingNotification.remove();
            }
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
    syncAgentMessageToAudio(currentTime);
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

  // Listening indicator disabled (was "Revo agent is listening" when client speaks)
  let listeningIndicatorElement = null;
  let lottieElementRef = null;
  function showListeningIndicator() {
    return null; // Indicator removed per design
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
          <img src="./images/hear-a-sample-call/revo_profile.webp" alt="Revo Agent" />
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

  // Build agent message paragraph with word spans (for sync with audio; no timer).
  function buildAgentMessageWordSpans(text, paragraphElement) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    paragraphElement.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'hear-sample-typing-word';
      span.textContent = word;
      span.style.transition = 'opacity 0.25s ease';
      span.style.opacity = '0.45';
      paragraphElement.appendChild(span);
      if (i < words.length - 1) paragraphElement.appendChild(document.createTextNode(' '));
    });
  }

  // Sync active agent message word opacities to audio time: first word full at segment start,
  // last word full at segment end. Also finalize past agent messages (all words full).
  function syncAgentMessageToAudio(currentTime) {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;
    // Finalize past agent messages (all words full, header visible, no generating)
    chat.querySelectorAll('.hear-sample-message-agent').forEach((msg) => {
      if (msg.classList.contains('active')) return;
      const end = parseFloat(msg.dataset.messageEnd);
      if (isNaN(end) || end > currentTime) return;
      const spans = msg.querySelectorAll('.hear-sample-typing-word');
      spans.forEach((s) => { s.style.opacity = '1'; });
      const gen = msg.querySelector('.hear-sample-generating-conversation');
      if (gen) gen.style.display = 'none';
      const h = msg.querySelector('.hear-sample-message-header');
      if (h) h.style.opacity = '1';
    });
    const messageDiv = chat.querySelector('.hear-sample-message.active.hear-sample-message-agent');
    if (!messageDiv) return;
    const start = parseFloat(messageDiv.dataset.messageStart);
    const end = parseFloat(messageDiv.dataset.messageEnd);
    if (isNaN(start) || isNaN(end) || end <= start) return;
    const wordSpans = messageDiv.querySelectorAll('.hear-sample-typing-word');
    const wordCount = wordSpans.length;
    if (wordCount === 0) return;

    // Last word full 1 second before segment end
    const effectiveEnd = Math.max(start + 0.01, end - 1);
    const progress = Math.max(0, Math.min(1, (currentTime - start) / (effectiveEnd - start)));
    // First word full at progress 0, last word full at progress 1 (by effectiveEnd).
    const currentWordIndex = wordCount <= 1
      ? wordCount
      : Math.min(wordCount, 1 + Math.floor(progress * (wordCount - 1)));

    const bubbleEl = messageDiv.querySelector('.hear-sample-message-bubble');
    const generatingEl = messageDiv.querySelector('.hear-sample-generating-conversation');
    const headerEl = messageDiv.querySelector('.hear-sample-message-header');

    function measureLines() {
      const tops = Array.from(wordSpans).map(span => span.getBoundingClientRect().top);
      const result = [];
      let currentLine = [];
      let lastTop = null;
      for (let i = 0; i < tops.length; i++) {
        const top = tops[i];
        if (lastTop !== null && Math.abs(top - lastTop) > 2) {
          result.push(currentLine);
          currentLine = [];
        }
        currentLine.push(i);
        lastTop = top;
      }
      if (currentLine.length) result.push(currentLine);
      return result;
    }
    const lines = measureLines();
    let currentLineIndex = 0;
    for (let L = 0; L < lines.length; L++) {
      if (lines[L].indexOf(currentWordIndex) >= 0) {
        currentLineIndex = L;
        break;
      }
    }
    if (currentWordIndex >= wordCount && lines.length > 0) currentLineIndex = lines.length - 1;
    for (let i = 0; i < wordSpans.length; i++) {
      let lineIndex = 0;
      for (let L = 0; L < lines.length; L++) {
        if (lines[L].indexOf(i) >= 0) {
          lineIndex = L;
          break;
        }
      }
      if (lineIndex < currentLineIndex) {
        wordSpans[i].style.opacity = '1';
      } else if (lineIndex === currentLineIndex) {
        wordSpans[i].style.opacity = i < currentWordIndex ? '1' : '0.45';
      } else if (lineIndex === currentLineIndex + 1) {
        wordSpans[i].style.opacity = '0.45';
      } else {
        wordSpans[i].style.opacity = '0';
      }
    }

    if (generatingEl) {
      generatingEl.style.display = progress >= 0.99 ? 'none' : '';
      if (progress < 0.99 && bubbleEl && lines.length > 0) {
        const lastVisibleLineIndex = Math.min(currentLineIndex + 1, lines.length - 1);
        const lineWordIndices = lines[lastVisibleLineIndex];
        if (lineWordIndices && lineWordIndices.length > 0) {
          const lastWordIdx = lineWordIndices[lineWordIndices.length - 1];
          const span = wordSpans[lastWordIdx];
          const bubbleRect = bubbleEl.getBoundingClientRect();
          const spanRect = span.getBoundingClientRect();
          generatingEl.style.position = 'absolute';
          generatingEl.style.left = '0';
          generatingEl.style.top = (spanRect.bottom - bubbleRect.top + 6) + 'px';
        }
      }
    }
    if (headerEl) {
      headerEl.style.opacity = progress >= 0.99 ? '1' : '0';
    }
  }

  // Type message line-by-line: first line = agent actively speaking (word-by-word);
  // second line appears below at lower opacity; when dialogue reaches second line,
  // third line appears with smooth animation at lower opacity.
  function typeMessage(text, element, onComplete, durationMs = null, messageDiv = null) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const generatingEl = messageDiv ? messageDiv.querySelector('.hear-sample-generating-conversation') : null;
    if (generatingEl) {
      generatingEl.style.display = '';
      generatingEl.style.position = 'absolute';
      generatingEl.style.left = '0';
      generatingEl.style.top = '0';
    }

    let currentWordIndex = 0;
    let currentTimeout = null;
    let lines = null; // array of arrays of word indices per visual line

    element.innerHTML = '';
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    typingTimeouts = [];

    let delayPerWord = 80;
    if (durationMs && words.length > 0) {
      delayPerWord = Math.max(40, durationMs / words.length);
    }

    const wordSpans = [];
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'hear-sample-typing-word';
      span.textContent = word;
      span.style.transition = 'opacity 0.25s ease';
      span.style.opacity = '0';
      wordSpans.push(span);
      element.appendChild(span);
      if (i < words.length - 1) element.appendChild(document.createTextNode(' '));
    });

    const bubbleEl = element.closest('.hear-sample-message-bubble');

    // Measure which words sit on which visual line (after layout)
    function measureLines() {
      const tops = wordSpans.map(span => span.getBoundingClientRect().top);
      const result = [];
      let currentLine = [];
      let lastTop = null;
      for (let i = 0; i < tops.length; i++) {
        const top = tops[i];
        if (lastTop !== null && Math.abs(top - lastTop) > 2) {
          result.push(currentLine);
          currentLine = [];
        }
        currentLine.push(i);
        lastTop = top;
      }
      if (currentLine.length) result.push(currentLine);
      return result;
    }

    function getCurrentLineIndex() {
      if (!lines || lines.length === 0) return 0;
      for (let L = 0; L < lines.length; L++) {
        if (lines[L].indexOf(currentWordIndex) >= 0) return L;
      }
      return Math.min(currentWordIndex >= words.length ? lines.length - 1 : 0, lines.length - 1);
    }

    function getLineIndexForWord(wordIndex) {
      if (!lines) return 0;
      for (let L = 0; L < lines.length; L++) {
        if (lines[L].indexOf(wordIndex) >= 0) return L;
      }
      return 0;
    }

    function updateGeneratingPosition() {
      if (!generatingEl || !bubbleEl || !lines || lines.length === 0) return;
      const currentLineIndex = getCurrentLineIndex();
      // Position below the last visible line (next line / preview) so we don't overlap text
      const lastVisibleLineIndex = Math.min(currentLineIndex + 1, lines.length - 1);
      const lineWordIndices = lines[lastVisibleLineIndex];
      if (!lineWordIndices || lineWordIndices.length === 0) return;
      const lastWordIdx = lineWordIndices[lineWordIndices.length - 1];
      const span = wordSpans[lastWordIdx];
      const bubbleRect = bubbleEl.getBoundingClientRect();
      const spanRect = span.getBoundingClientRect();
      const topPx = spanRect.bottom - bubbleRect.top + 6;
      generatingEl.style.top = topPx + 'px';
    }

    function updateOpacity() {
      if (!lines || lines.length === 0) {
        for (let i = 0; i < wordSpans.length; i++) {
          wordSpans[i].style.opacity = i < currentWordIndex ? '1' : '0.45';
        }
        if (generatingEl) updateGeneratingPosition();
        return;
      }
      const currentLineIndex = getCurrentLineIndex();
      for (let i = 0; i < wordSpans.length; i++) {
        const lineIndex = getLineIndexForWord(i);
        if (lineIndex < currentLineIndex) {
          wordSpans[i].style.opacity = '1';
        } else if (lineIndex === currentLineIndex) {
          wordSpans[i].style.opacity = i < currentWordIndex ? '1' : '0.45';
        } else if (lineIndex === currentLineIndex + 1) {
          wordSpans[i].style.opacity = '0.45';
        } else {
          wordSpans[i].style.opacity = '0';
        }
      }
      updateGeneratingPosition();
    }

    function typeNextWord() {
      if (isTypingPaused) {
        currentTimeout = setTimeout(typeNextWord, 50);
        typingTimeouts.push(currentTimeout);
        return;
      }

      if (currentWordIndex < words.length) {
        currentWordIndex++;
        updateOpacity();
        currentTimeout = setTimeout(typeNextWord, delayPerWord);
        typingTimeouts.push(currentTimeout);
      } else {
        for (let i = 0; i < wordSpans.length; i++) wordSpans[i].style.opacity = '1';
        if (generatingEl) generatingEl.style.display = 'none';
        if (onComplete) onComplete();
      }
    }

    function startTyping() {
      lines = measureLines();
      updateOpacity();
      typeNextWord();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(startTyping);
    });
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
    const headerClass = 'hear-sample-message-header';
    
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
        
        if (rawDuration) {
          messageDuration = rawDuration;
        }
      }
    }

    // Store segment times on agent messages for audio sync (word fill from start to end)
    let messageStart = null;
    let messageEnd = null;
    if (isAgent && messageIndex !== null) {
      const sample = sampleData[currentSample];
      if (sample && sample.messages) {
        const currentMessage = sample.messages[messageIndex];
        const nextMessage = sample.messages[messageIndex + 1];
        messageStart = currentMessage.time;
        messageEnd = nextMessage ? nextMessage.time : (audio && audio.duration ? audio.duration : currentMessage.time + 10);
      }
    }

    // For agent messages, show header immediately but delay bubble content
    messageDiv.innerHTML = `
      <div class="${headerClass}">
        ${isAgent ? `
          <div class="hear-sample-avatar hear-sample-avatar-agent">
            <img src="./images/hear-a-sample-call/revo_profile.webp" alt="Revo Agent" />
          </div>
          <span class="hear-sample-message-author">Revo Agent</span>
        ` : `
          <span class="hear-sample-message-author">Customer</span>
          <div class="hear-sample-avatar hear-sample-avatar-client">
            <img src="./images/hear-a-sample-call/customer_profile.webp" alt="Customer" />
          </div>
        `}
      </div>
      <div class="hear-sample-message-bubble hear-sample-message-bubble-${message.type}">
        <p></p>
        ${isAgent ? `<div class="hear-sample-generating-conversation" style="display: none;"><span class="hear-sample-generating-text">Generating conversation</span><span class="hear-sample-generating-spinner" aria-hidden="true"></span></div>` : ''}
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

      // For agent messages: build word spans and sync to audio (no timer)
      if (isAgent) {
        const headerEl = messageDiv.querySelector('.hear-sample-message-header');
        if (headerEl) {
          headerEl.style.opacity = '0';
          headerEl.style.transition = 'opacity 0.25s ease';
        }
        if (messageStart != null && messageEnd != null) {
          messageDiv.dataset.messageStart = messageStart;
          messageDiv.dataset.messageEnd = messageEnd;
        }
        const textElement = messageDiv.querySelector('.hear-sample-message-bubble p');
        buildAgentMessageWordSpans(message.text, textElement);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            syncAgentMessageToAudio(audio ? audio.currentTime : 0);
            chat.scrollTop = chat.scrollHeight;
          });
        });
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
      if (isAgent && messageStart != null && messageEnd != null) {
        messageDiv.dataset.messageStart = messageStart;
        messageDiv.dataset.messageEnd = messageEnd;
        buildAgentMessageWordSpans(message.text, textElement);
        requestAnimationFrame(() => {
          syncAgentMessageToAudio(audio ? audio.currentTime : 0);
          chat.scrollTop = chat.scrollHeight;
        });
      } else {
        textElement.textContent = message.text;
        requestAnimationFrame(() => {
          chat.scrollTop = chat.scrollHeight;
        });
      }
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

  // Show notification asking if user wants to start using Revo
  function showRevoStartNotification() {
    const chat = document.querySelector('.hear-sample-chat');
    if (!chat) return;

    // Check if notification already exists
    if (chat.querySelector('.hear-sample-revo-notification')) {
      return;
    }

    // Create notification message
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'hear-sample-message hear-sample-revo-notification';
    notificationDiv.innerHTML = `
      <div class="hear-sample-message-bubble hear-sample-message-bubble-notification">
        <button class="hear-sample-notification-close" aria-label="Close notification">×</button>
        <div class="hear-sample-notification-header">
          <div class="hear-sample-notification-icon"><img src="./images/hear-a-sample-call/revo_profile.webp" alt="Revo Agent"></div>
          <div class="hear-sample-notification-header-text">
            <h3 class="hear-sample-notification-title">Want to start using Revo?</h3>
            <p class="hear-sample-notification-description">Experience AI-powered receptionists that never miss a call.</p>
          </div>
        </div>
        <div class="hear-sample-notification-actions">
          <button class="hear-sample-notification-btn hear-sample-notification-btn-primary">Yes, start now</button>
          <button class="hear-sample-notification-btn hear-sample-notification-btn-secondary">Maybe later</button>
        </div>
      </div>
    `;

    // Animate in
    notificationDiv.style.opacity = '0';
    notificationDiv.style.transform = 'translateY(20px)';
    chat.appendChild(notificationDiv);

    requestAnimationFrame(() => {
      notificationDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      notificationDiv.style.opacity = '1';
      notificationDiv.style.transform = 'translateY(0)';
    });

    // Scroll to show notification
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
    });

    // Handle button clicks
    const primaryBtn = notificationDiv.querySelector('.hear-sample-notification-btn-primary');
    const secondaryBtn = notificationDiv.querySelector('.hear-sample-notification-btn-secondary');
    const closeBtn = notificationDiv.querySelector('.hear-sample-notification-close');

    const closeNotification = () => {
      notificationDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      notificationDiv.style.opacity = '0';
      notificationDiv.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        notificationDiv.remove();
      }, 300);
    };

    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        // Redirect to get started or trigger action
        // You can change this to your desired action (e.g., scroll to section, open form, etc.)
        const getStartedSection = document.querySelector('#get-started') || document.querySelector('.hero-actions');
        if (getStartedSection) {
          getStartedSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', closeNotification);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeNotification);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


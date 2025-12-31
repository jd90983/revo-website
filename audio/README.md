# Audio Files for Hear a Sample Section

This directory should contain the audio sample files for the "Hear a Sample" section.

## Required Audio Files

Place the following MP3 files in this directory:

1. **sample-home-services.mp3** - Audio sample for Home Services industry
2. **sample-wrench.mp3** - Audio sample for Repair Services industry
3. **sample-hammer.mp3** - Audio sample for Construction Services industry
4. **sample-key.mp3** - Audio sample for Locksmith Services industry
5. **sample-shield.mp3** - Audio sample for Security Services industry

## File Format

- **Format**: MP3
- **Recommended**: 128kbps or higher quality
- **Duration**: Should match the conversation length (typically 1-3 minutes)

## How It Works

The JavaScript in `js/hear-sample.js` will automatically:
- Load the appropriate audio file when a user clicks on an industry icon
- Synchronize the chat messages with the audio playback
- Display messages at the correct timestamps during playback

## Testing Without Audio Files

If audio files are not available, the section will still work but will show a placeholder message indicating that audio files need to be added.


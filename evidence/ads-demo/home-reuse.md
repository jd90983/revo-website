# HOME image and player reuse

Product commitc757722 on feat/ads-ai-receptionist, descendant of d09f52e. Existing published HOME and its shared player scripts/configuration/media are unchanged.

Both supplied Library screenshots were read and visually inspected: libfile_0c9bb7fb41a48191ad5ed854623b6d51 shows the prior angled phone image; libfile_6093ce05b1448191bb16647c30aec632 shows the prior native audio substitute. No access blocker.

Hero now uses existing HOME image images/hear-a-sample-call/home_service_pros_sample_call.webp, showing a home service professional in work overalls. The original image bytes are unchanged. Its existing cutout shape is preserved; no new image was generated.

The native audio substitute is replaced by HOME's actual Hear a Sample component: professional panel, Home Services/Locksmith selector, summary/chat, play/pause, time/progress and volume controls. HTML is reused from index.html; HOME's CSS block and responsive rules are scoped to this landing in css/home-sample-player.css. Existing js/hear-sample-config.js and js/hear-sample.js load unchanged. Existing home-services and locksmith MP3s are reused. The published HOME scripts and images were not edited.

Landing-only adaptations: static fallback summary matches the existing real sample configuration rather than placeholder copy; play button accessible name follows its existing play/pause icon; existing end-of-sample prompt uses truthful home-services copy and Book a demo to the authorized reservation section. The existing calendar, five-UTM forwarding and click-to-load behavior remain unchanged.

## Verified
Exact git archivec757722 served locally in isolated Chromium headless with fresh nonpersistent contexts. No personal Chrome profile or CUA session used. HTML/CSS/controller/config hashes match the exact git source. Source photo/controller/config also match approved HOME base9ccbb5a.

All320/390/768/1440: fonts loaded, correct home-services H1, no page overflow, image visible, no audio autoplay, Home Services play/pause, Locksmith selection and play/pause, progress seek while paused, and end-of-sample demo prompt. Both actual audio durations loaded:90.644s and77.54s. Calendar opened after visitor action and displayed authorized Jorge session and10min. No dates selected, personal data entered or reservation submitted. Zero page errors. POST requests were blocked in the test fixture; only existing analytics hosts attempted them.

Full project build and18tests pass. Screenshots and report in home-reuse-qa/. The isolated test server supports audio byte ranges as the deployment does. Earlier fixture retries resolved MIME/range and asynchronous end-of-audio test timing; no production controller modifications were made.

Remote preview will retain existing Vercel authentication and noindex. Protected HTTP verification follows deployment; provider-side booking attribution and actual submitted reservation are intentionally not tested.

Scoped responsive corrections preserve the complete initial summary (without a clipped centered scroll region) and keep the portrait face visible on tablets. During playback, the original HOME scrolling chat behavior remains. The additional summary visibility guard passed all four sizes.

# -*- coding: utf-8 -*-
from pathlib import Path

FEATURES_BLOCK = """    <!-- Features Tabs Section -->
    <section class="ser-features-section" style="background: #0A0B0C !important; color: #FFFFFF !important; display: block !important; visibility: visible !important;">
      <div class="padding-global relative" style="background: #0A0B0C !important; color: #FFFFFF !important;">
        <div class="container-large">
          <div class="ser-benefits-header ser-benefits-header--tabs">
            <div class="ser-benefits-title-wrapper">
              <p class="ser-tagline">Features</p>
              <div class="ser-benefits-heading-content">
                <h2 class="ser-section-title">Intelligent Communication Built for<br /><span class="text-primary">Real Businesses</span></h2>
                <div class="ser-section-description">
                  <p>Revo handles calls with precision, consistency, and full alignment to your business.<br />From first contact to scheduling, every interaction follows your rules.<br />No missed details. No guesswork. Just reliable execution.</p>
                </div>
              </div>
              <div class="benefits-modern-actions ser-benefits-tabs-header-actions">
                <button class="benefits-modern-btn-primary" type="button">Get Started</button>
                <a class="benefits-modern-btn-secondary benefits-modern-btn-link" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">
                  Download for iPhone
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="products_wr products_wr--tabs">
            <div class="products-content products-content--tabs">
              <div class="products-left">
                <div class="products-tabs" role="tablist" aria-label="Features">
                  <div class="products-item active" data-product="detailed-call-reports" data-image="images/services/detailed_call_reports.webp" data-alt="Detailed Call Reports">
                    <div class="products-item-header">
                      <span class="products-item-indicator" aria-hidden="true"></span>
                      <h3 class="products-title">Detailed Call Reports</h3>
                    </div>
                    <div class="products-description">
                      <p>Know exactly what happened on every call.<br />Revo organizes each conversation into clear summaries,<br />helping you spot customer needs and missed opportunities faster.</p>
                    </div>
                    <div class="products-actions">
                      <a class="benefits-modern-btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">Download for iPhone</a>
                    </div>
                    <div class="products-item-media">
                      <img src="images/services/detailed_call_reports.webp" alt="Detailed Call Reports" width="600" height="600" loading="lazy" />
                    </div>
                  </div>
                  <div class="products-item" data-product="smart-response-timing" data-image="images/services/smart_response_timing.webp" data-alt="Smart Response Timing">
                    <div class="products-item-header">
                      <span class="products-item-indicator" aria-hidden="true"></span>
                      <h3 class="products-title">Smart Response Timing</h3>
                    </div>
                    <div class="products-description">
                      <p>You decide how and when calls get answered. Whether it's right away, after a few rings, or only during certain hours—Revo follows your rules. Your customers always get a smooth, professional response, no matter what.</p>
                    </div>
                    <div class="products-actions">
                      <a class="benefits-modern-btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">Download for iPhone</a>
                    </div>
                    <div class="products-item-media">
                      <img src="images/services/smart_response_timing.webp" alt="Smart Response Timing" width="600" height="600" loading="lazy" />
                    </div>
                  </div>
                  <div class="products-item" data-product="blocked-numbers" data-image="images/services/blocked_numbers.webp" data-alt="Blocked numbers">
                    <div class="products-item-header">
                      <span class="products-item-indicator" aria-hidden="true"></span>
                      <h3 class="products-title">Blocked numbers</h3>
                    </div>
                    <div class="products-description">
                      <p>Not every call deserves your attention. Revo filters out spam and unwanted calls automatically, so your line stays open for real customers. Less noise, more meaningful conversations.</p>
                    </div>
                    <div class="products-actions">
                      <a class="benefits-modern-btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">Download for iPhone</a>
                    </div>
                    <div class="products-item-media">
                      <img src="images/services/blocked_numbers.webp" alt="Blocked numbers" width="600" height="600" loading="lazy" />
                    </div>
                  </div>
                </div>
                <div class="products-panel-actions benefits-modern-actions">
                  <button class="benefits-modern-btn-primary" type="button">Get Started</button>
                  <a class="benefits-modern-btn-secondary benefits-modern-btn-link" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">
                  Download for iPhone
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="products-right">
                <div class="products-image-container">
                  <img id="__IMAGE_ID__" src="images/services/detailed_call_reports.webp" alt="Detailed Call Reports" class="products-image" width="600" height="600" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
"""

FEATURES_BLOCK = (
    FEATURES_BLOCK.replace("<div ", "<div ")
    .replace("</div>", "</div>")
)
FEATURES_BLOCK = FEATURES_BLOCK.replace("</div>", "</div>")

ROOT = Path(__file__).resolve().parents[1]

MARKERS = {
    "services.html": (
        "    <!-- Features Section with Dark Theme",
        "    <!-- Humanize AI Receptionists Section",
        "features-image",
    ),
    "industries.html": (
        "    <!-- Features Section with Dark Theme",
        "    <!-- Intelligent Banner Section",
        "industry-features-image",
    ),
}

for filename, (start_marker, end_marker, image_id) in MARKERS.items():
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")
    start = text.index(start_marker)
    end = text.index(end_marker, start)
    block = FEATURES_BLOCK.replace("__IMAGE_ID__", image_id)
    path.write_text(text[:start] + block + "\n\n" + text[end:], encoding="utf-8")
    print("patched", filename)

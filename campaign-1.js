/**
 * Campaign 1 landing — voice player (from download-copy) + lead form → same API as Get Started.
 */
(function () {
  "use strict";

  // ---------- Voice player (download-copy markup/behavior) ----------
  function initVoicePlayer() {
    var root = document.getElementById("lp_rvt");
    if (!root) return;
    var aG = root.querySelector('[data-audio="generic"]');
    var aR = root.querySelector('[data-audio="revo"]');
    var playBtn = root.querySelector("[data-play]");
    var track = root.querySelector("[data-progress]");
    var fill = root.querySelector("[data-fill]");
    var elCur = root.querySelector("[data-current]");
    var elDur = root.querySelector("[data-duration]");
    var toggle = root.querySelector("[data-switch]");
    var labG = root.querySelector("[data-label-generic]");
    var labR = root.querySelector("[data-label-revo]");
    if (!aG || !aR || !playBtn || !track || !fill || !elCur || !elDur || !toggle) return;

    aG.src = root.getAttribute("data-src-generic") || "";
    aR.src = root.getAttribute("data-src-revo") || "";
    var key = "generic";
    var playing = false;
    var raf = 0;

    function active() {
      return key === "revo" ? aR : aG;
    }
    function fmt(sec) {
      if (!isFinite(sec) || sec < 0) return "0:00";
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return m + ":" + (s < 10 ? "0" : "") + s;
    }
    function dur() {
      var g = aG.duration,
        r = aR.duration;
      var gOk = isFinite(g) && g > 0,
        rOk = isFinite(r) && r > 0;
      if (gOk && rOk) return Math.min(g, r);
      return rOk ? r : gOk ? g : 0;
    }
    function route() {
      aG.muted = key !== "generic";
      aR.muted = key !== "revo";
    }
    function uiToggle() {
      var isRevo = key === "revo";
      root.classList.toggle("is-revo", isRevo);
      toggle.setAttribute("aria-checked", String(isRevo));
      if (labG) labG.classList.toggle("is-active", !isRevo);
      if (labR) labR.classList.toggle("is-active", isRevo);
    }
    function uiProgress() {
      var master = active();
      var d = dur();
      var t = isFinite(master.currentTime) ? master.currentTime : 0;
      var end = d > 0 ? d : 0;
      var shown = end > 0 ? Math.min(t, end) : t;
      elCur.textContent = fmt(shown);
      if (end > 0) elDur.textContent = fmt(end);
      var pct = end > 0 ? Math.min(100, (shown / end) * 100) : 0;
      fill.style.width = pct + "%";
      track.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
    function setPlaying(v) {
      playing = v;
      root.classList.toggle("is-playing", v);
      playBtn.setAttribute(
        "aria-label",
        v ? "Pause audio comparison" : "Play audio comparison"
      );
      cancelAnimationFrame(raf);
      if (v) raf = requestAnimationFrame(tick);
    }
    function tick() {
      if (!playing) return;
      var d = dur();
      var master = active();
      if (d > 0 && master.currentTime >= d - 0.06) {
        aG.pause();
        aR.pause();
        setPlaying(false);
        uiProgress();
        return;
      }
      uiProgress();
      raf = requestAnimationFrame(tick);
    }
    function seek(clientX) {
      var rect = track.getBoundingClientRect();
      if (!(rect.width > 0)) return;
      var ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      var d = dur();
      if (!(d > 0)) return;
      var t = ratio * d;
      try {
        aG.currentTime = t;
        aR.currentTime = t;
      } catch (e) {}
      uiProgress();
    }

    playBtn.addEventListener("click", function () {
      if (playing) {
        aG.pause();
        aR.pause();
        setPlaying(false);
        return;
      }
      route();
      Promise.allSettled([aG.play(), aR.play()]).then(function (res) {
        if (
          res.some(function (r) {
            return r.status === "rejected";
          })
        ) {
          setPlaying(false);
          return;
        }
        setPlaying(true);
      });
    });
    toggle.addEventListener("click", function () {
      key = key === "revo" ? "generic" : "revo";
      route();
      uiToggle();
    });
    track.addEventListener("pointerdown", function (e) {
      if (e.button && e.button !== 0) return;
      seek(e.clientX);
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!track.hasPointerCapture(e.pointerId)) return;
      seek(e.clientX);
    });
    aG.addEventListener("loadedmetadata", uiProgress);
    aR.addEventListener("loadedmetadata", uiProgress);
    route();
    uiToggle();
    uiProgress();
  }

  // ---------- Stats counters (homepage numbers: 95 / 80 / 60) ----------
  function initStatCounters() {
    var els = document.querySelectorAll(".performance-stat-number[data-target]");
    if (!els.length) return;

    var duration = 2000;
    var frameDuration = 1000 / 60;
    var totalFrames = Math.round(duration / frameDuration);
    var easeOutQuad = function (t) {
      return t * (2 - t);
    };

    function animateCounter(element) {
      var target = parseInt(element.dataset.target, 10);
      var frame = 0;
      var counter = setInterval(function () {
        frame++;
        var progress = easeOutQuad(frame / totalFrames);
        var currentValue = Math.round(target * progress);
        element.textContent = currentValue + "%";
        if (frame === totalFrames) {
          clearInterval(counter);
          element.textContent = target + "%";
        }
      }, frameDuration);
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(animateCounter);
      return;
    }

    var row =
      document.querySelector(".c1-stats") ||
      document.querySelector(".performance-stats-row");
    if (!row) {
      els.forEach(animateCounter);
      return;
    }

    var animated = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || animated) return;
          animated = true;
          var stats = entry.target.querySelectorAll(
            ".performance-stat-number[data-target]"
          );
          stats.forEach(function (el, i) {
            setTimeout(function () {
              animateCounter(el);
            }, i * 150);
          });
          io.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(row);
  }

  // ---------- Lead form → same /api/submit-form as Get Started ----------
  function showFormMessage(form, message, type) {
    var existing = form.querySelector(".c1-form-message");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "c1-form-message c1-form-message-" + type;
    el.textContent = message;
    var btn = form.querySelector('[type="submit"]');
    form.insertBefore(el, btn);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (type === "success") {
      setTimeout(function () {
        if (el.parentNode) el.remove();
      }, 5000);
    }
  }

  function splitName(full) {
    var parts = full.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  }

  function initLeadForm() {
    var form = document.getElementById("lead-form");
    if (!form || form.hasAttribute("data-c1-bound")) return;
    form.setAttribute("data-c1-bound", "true");

    var phone = form.querySelector("#lf-phone");
    if (phone) {
      phone.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/[^0-9\s()\-+]/g, "");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (form.querySelector("#lf-name") || {}).value || "";
      var business = (form.querySelector("#lf-business") || {}).value || "";
      var phoneVal = (form.querySelector("#lf-phone") || {}).value || "";
      var email = (form.querySelector("#lf-email") || {}).value || "";
      var industry = (form.querySelector("#lf-industry") || {}).value || "";

      name = name.trim();
      business = business.trim();
      phoneVal = phoneVal.trim();
      email = email.trim();

      if (!name || !business || !phoneVal || !email || !industry) {
        showFormMessage(
          form,
          "Please fill in all required fields correctly.",
          "error"
        );
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFormMessage(form, "Please enter a valid email address.", "error");
        return;
      }

      var digits = phoneVal.replace(/\D/g, "");
      if (digits.length < 10) {
        showFormMessage(form, "Please enter a valid phone number.", "error");
        return;
      }

      var names = splitName(name);
      var lastName = names.lastName
        ? names.lastName + " (" + business + ")"
        : business;
      if (lastName.length > 100) lastName = lastName.slice(0, 100);

      var formData = {
        firstName: names.firstName.slice(0, 100),
        lastName: lastName,
        email: email,
        contactNumber: phoneVal,
        industry: industry,
        callsPerWeek: "0-24",
      };

      var submitBtn = form.querySelector('[type="submit"]');
      var originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      try {
        var submissions = JSON.parse(
          localStorage.getItem("revoFormSubmissions") || "[]"
        );
        submissions.push(
          Object.assign({}, formData, {
            businessName: business,
            timestamp: new Date().toISOString(),
            source: "campaign-1",
          })
        );
        if (submissions.length > 100) submissions.shift();
        localStorage.setItem(
          "revoFormSubmissions",
          JSON.stringify(submissions)
        );
      } catch (err) {
        /* ignore */
      }

      var isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      var apiUrl = isLocalhost
        ? "https://revoapp.ai/api/submit-form"
        : "/api/submit-form";

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(function (response) {
          return response.json().then(function (result) {
            return { response: response, result: result };
          });
        })
        .then(function (_ref) {
          var response = _ref.response;
          var result = _ref.result;
          if (!response.ok) {
            throw new Error(result.error || "Submission failed");
          }
          showFormMessage(
            form,
            "Thank you! Your information has been received. We'll contact you soon.",
            "success"
          );
          form.reset();
          setTimeout(function () {
            window.location.href = "thank-you.html";
          }, 1500);
        })
        .catch(function (error) {
          showFormMessage(
            form,
            "Error: " +
              (error.message || "Failed to submit") +
              ". Data saved locally as backup.",
            "error"
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        });
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initVoicePlayer();
    initStatCounters();
    initLeadForm();
  });
})();

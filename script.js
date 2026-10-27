/**
 * Jainika's Portfolio - Cute Pink, Butterfly & Floral Interactive Engine
 * Specialization: Computer Science & Engineering (AI & ML)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME SWITCHER (Pink Blossom Default / Midnight Rose)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to cute pink light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (typeof updateCanvasTheme === 'function') {
        updateCanvasTheme(newTheme);
      }
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. TYPEWRITER EFFECT IN HERO (WITH CUTE ICONS)
     ========================================================================== */
  const typedTextEl = document.getElementById('typed-text');
  const phrases = [
    'Intelligent AI Models 🌸',
    'Deep Neural Architectures 🦋',
    'Computer Vision Systems ✨',
    'NLP & Transformers 🌷',
    'Delightful Scalable ML 💖'
  ];
  let phraseIdx = 0;
  let letterIdx = 0;
  let isDeleting = false;
  const typeSpeed = 85;
  const deleteSpeed = 40;
  const pauseTime = 1600;

  function typeEffect() {
    if (!typedTextEl) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, letterIdx - 1);
      letterIdx--;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, letterIdx + 1);
      letterIdx++;
    }

    if (!isDeleting && letterIdx === currentPhrase.length) {
      setTimeout(() => { isDeleting = true; typeEffect(); }, pauseTime);
      return;
    } else if (isDeleting && letterIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeEffect, 300);
      return;
    }

    setTimeout(typeEffect, isDeleting ? deleteSpeed : typeSpeed);
  }
  typeEffect();

  /* ==========================================================================
     4. SAKURA FLOWER PETALS & BUTTERFLIES CANVAS (HERO BACKGROUND)
     ========================================================================== */
  const canvas = document.getElementById('neural-canvas');
  let updateCanvasTheme = null;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let petals = [];
    let canvasButterflies = [];
    const petalCount = 38;
    const butterflyCount = 4;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initElements();
    }

    // Sakura / Flower Petal Class
    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 8 + 8; // Petal size
        this.speedY = Math.random() * 0.9 + 0.6;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.45 + 0.35;
        
        // Soft petal shades: pink, rose, peach
        const shades = [
          '244, 114, 182', // Blush pink
          '236, 72, 153',  // Vibrant rose
          '251, 207, 232', // Light pastel sakura
          '216, 180, 254'  // Soft lavender
        ];
        this.color = shades[Math.floor(Math.random() * shades.length)];
      }

      update() {
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * 0.8 + this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Mouse scatter interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();

        // Draw organic curved sakura petal
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();

        // Gentle petal center line
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, this.size * 0.75);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Mini Butterfly in Canvas
    class CanvasButterfly {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.4;
        this.vy = (Math.random() - 0.5) * 1.4;
        this.wingAngle = 0;
        this.wingSpeed = 0.22;
        this.scale = Math.random() * 0.4 + 0.6;
        this.color = Math.random() > 0.5 ? '#ec4899' : '#c084fc';
      }

      update() {
        this.wingAngle += this.wingSpeed;
        this.x += this.vx;
        this.y += this.vy;

        // Soft target tracking towards mouse if near
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260 && dist > 50) {
            this.vx += (dx / dist) * 0.04;
            this.vy += (dy / dist) * 0.04;
          }
        }

        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.8) {
          this.vx = (this.vx / speed) * 1.8;
          this.vy = (this.vy / speed) * 1.8;
        }

        if (this.x < 30 || this.x > width - 30) this.vx *= -1;
        if (this.y < 30 || this.y > height - 30) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        const heading = Math.atan2(this.vy, this.vx);
        ctx.rotate(heading + Math.PI / 2);
        ctx.scale(this.scale, this.scale);

        const wingSpread = Math.abs(Math.sin(this.wingAngle));

        // Draw left wing
        ctx.save();
        ctx.scale(wingSpread, 1);
        ctx.beginPath();
        ctx.ellipse(-9, -2, 10, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-7, 6, 7, 4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6';
        ctx.fill();
        ctx.restore();

        // Draw right wing
        ctx.save();
        ctx.scale(-wingSpread, 1);
        ctx.beginPath();
        ctx.ellipse(-9, -2, 10, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-7, 6, 7, 4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6';
        ctx.fill();
        ctx.restore();

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.8, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#831843';
        ctx.fill();

        ctx.restore();
      }
    }

    function initElements() {
      petals = [];
      canvasButterflies = [];
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
      for (let i = 0; i < butterflyCount; i++) {
        canvasButterflies.push(new CanvasButterfly());
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw and update falling petals
      petals.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw and update fluttering mini butterflies
      canvasButterflies.forEach(b => {
        b.update();
        b.draw();
      });

      requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateCanvas();

    updateCanvasTheme = () => {};
  }

  /* ==========================================================================
     5. CUTE CLICK SPARKLE & FLOWER BURST EFFECT
     ========================================================================== */
  const cuteIcons = ['🌸', '✨', '🦋', '💖', '🌷', '💮'];
  document.addEventListener('click', (e) => {
    // Avoid triggering on inputs or form buttons to keep forms responsive
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    for (let i = 0; i < 4; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'click-sparkle';
      sparkle.textContent = cuteIcons[Math.floor(Math.random() * cuteIcons.length)];

      const x = e.clientX + (Math.random() - 0.5) * 45;
      const y = e.clientY + (Math.random() - 0.5) * 45;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.fontSize = `${Math.random() * 10 + 16}px`;

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 950);
    }
  });

  // Inject sparkle CSS animation dynamically
  const sparkleStyle = document.createElement('style');
  sparkleStyle.textContent = `
    .click-sparkle {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%) scale(0.6);
      animation: float-sparkle 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      filter: drop-shadow(0 2px 5px rgba(236, 72, 153, 0.35));
    }
    @keyframes float-sparkle {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -100px) scale(1.4) rotate(${Math.random() > 0.5 ? 40 : -40}deg);
      }
    }
  `;
  document.head.appendChild(sparkleStyle);

  /* ==========================================================================
     6. STATS COUNTER ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  let statsCounted = false;

  function runStatsCounter() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * target;

        if (isDecimal) {
          stat.textContent = currentVal.toFixed(1) + '%';
        } else {
          stat.textContent = Math.floor(currentVal) + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          runStatsCounter();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(heroSection);
  }

  /* ==========================================================================
     7. INTERACTIVE LIVE AI MODEL PLAYGROUND (EMOTION GARDEN)
     ========================================================================== */
  const aiInput = document.getElementById('ai-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const presetChips = document.querySelectorAll('.preset-chip');

  const verdictBanner = document.getElementById('verdict-banner');
  const verdictIcon = document.getElementById('verdict-icon');
  const verdictValue = document.getElementById('verdict-value');
  const confidenceScore = document.getElementById('confidence-score');
  const inferenceTime = document.getElementById('inference-time');

  const posFill = document.getElementById('pos-fill');
  const posPercent = document.getElementById('pos-percent');
  const neuFill = document.getElementById('neu-fill');
  const neuPercent = document.getElementById('neu-percent');
  const negFill = document.getElementById('neg-fill');
  const negPercent = document.getElementById('neg-percent');
  const tokenTags = document.getElementById('token-tags');

  const positiveWords = [
    'remarkable', 'accuracy', 'instantaneous', 'excellent', 'state-of-the-art', 'superior',
    'efficient', 'breakthrough', 'innovative', 'smooth', 'impressive', 'robust', 'clean',
    'fast', 'optimized', 'high', 'delightful', 'perfect', 'successful', 'great', 'good', 'love', 'cute', 'beautiful'
  ];

  const negativeWords = [
    'diverged', 'exploding', 'instability', 'catastrophic', 'error', 'failed', 'slow',
    'bug', 'latency', 'poor', 'degraded', 'bad', 'loss', 'terrible', 'worst', 'underfitting',
    'overfitting', 'crash', 'bottleneck', 'unstable'
  ];

  function runModelInference() {
    if (!aiInput) return;
    const text = aiInput.value.trim().toLowerCase();

    const simLatency = Math.floor(Math.random() * 8) + 12;
    if (inferenceTime) inferenceTime.innerHTML = `Latency: <strong>${simLatency}ms</strong>`;

    if (!text) {
      setPlaygroundOutput('Balanced & Neutral', '🌷', 50.0, 25.0, 50.0, 25.0, []);
      return;
    }

    const words = text.match(/\b[a-z]{3,}\b/g) || [];
    let posScore = 0;
    let negScore = 0;
    const foundTokens = [];

    words.forEach(w => {
      if (positiveWords.includes(w)) {
        posScore += 2.2;
        foundTokens.push({ word: w, type: 'pos', weight: '+0.' + (Math.floor(Math.random() * 20) + 70) });
      } else if (negativeWords.includes(w)) {
        negScore += 2.5;
        foundTokens.push({ word: w, type: 'neg', weight: '-0.' + (Math.floor(Math.random() * 20) + 70) });
      }
    });

    let pPos, pNeu, pNeg;
    let verdict, icon;

    if (posScore > negScore) {
      pPos = Math.min(98.4, 75 + posScore * 6);
      pNeg = Math.max(0.6, (100 - pPos) * 0.25);
      pNeu = 100 - pPos - pNeg;
      verdict = pPos > 85 ? 'Strongly Positive 🌸' : 'Positive ✨';
      icon = '🌸';
    } else if (negScore > posScore) {
      pNeg = Math.min(97.8, 70 + negScore * 7);
      pPos = Math.max(0.8, (100 - pNeg) * 0.2);
      pNeu = 100 - pNeg - pPos;
      verdict = pNeg > 85 ? 'Negative / Error 🥀' : 'Negative 🥀';
      icon = '🥀';
    } else {
      pNeu = 72.0;
      pPos = 14.5;
      pNeg = 13.5;
      verdict = 'Neutral & Balanced 🌷';
      icon = '🌷';
    }

    const primaryConfidence = Math.max(pPos, pNeu, pNeg);
    setPlaygroundOutput(verdict, icon, primaryConfidence, pPos, pNeu, pNeg, foundTokens);
  }

  function setPlaygroundOutput(verdict, icon, conf, pos, neu, neg, tokens) {
    if (verdictValue) verdictValue.textContent = verdict;
    if (verdictIcon) verdictIcon.textContent = icon;
    if (confidenceScore) confidenceScore.textContent = conf.toFixed(1) + '%';

    if (posPercent) posPercent.textContent = pos.toFixed(1) + '%';
    if (posFill) posFill.style.width = pos.toFixed(1) + '%';

    if (neuPercent) neuPercent.textContent = neu.toFixed(1) + '%';
    if (neuFill) neuFill.style.width = neu.toFixed(1) + '%';

    if (negPercent) negPercent.textContent = neg.toFixed(1) + '%';
    if (negFill) negFill.style.width = neg.toFixed(1) + '%';

    if (tokenTags) {
      if (tokens.length === 0) {
        tokenTags.innerHTML = '<span class="token-badge tag-neu">standard vocabulary (balanced weights)</span>';
      } else {
        tokenTags.innerHTML = tokens.map(t =>
          `<span class="token-badge tag-${t.type}">${t.word} (${t.weight})</span>`
        ).join('');
      }
    }
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runModelInference);
  }

  if (clearInputBtn && aiInput) {
    clearInputBtn.addEventListener('click', () => {
      aiInput.value = '';
      runModelInference();
    });
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (aiInput) {
        aiInput.value = chip.getAttribute('data-text');
        runModelInference();
      }
    });
  });

  runModelInference();

  /* ==========================================================================
     8. SKILLS FILTERING
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     9. PROJECTS FILTERING
     ========================================================================== */
  const projFilters = document.querySelectorAll('.proj-filter');
  const projCards = document.querySelectorAll('.project-card');

  projFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      projFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const selectedCat = filter.getAttribute('data-filter');

      projCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     10. PROJECT CASE STUDY DYNAMIC MODAL
     ========================================================================== */
  const caseStudyModal = document.getElementById('case-study-modal');
  const csTitle = document.getElementById('cs-title');
  const csPill = document.getElementById('cs-pill');
  const csBody = document.getElementById('cs-body');
  const closeCsModalBtn = document.getElementById('close-cs-modal');
  const viewCsBtns = document.querySelectorAll('.view-case-study');

  const caseStudiesData = {
    neurovision: {
      title: 'NeuroVision: Automated Radiology & Brain MRI Classifier 🌸',
      pill: 'Deep Learning &bull; Computer Vision &bull; PyTorch',
      content: `
        <div class="cs-modal-content">
          <p class="cs-intro"><strong>Overview:</strong> Medical imaging scans require meticulous evaluation by expert radiologists where timely diagnosis is critical. NeuroVision provides an AI-assisted diagnostic pipeline capable of classifying abnormalities with 98.4% validation accuracy across 15,000+ public and synthesized radiological scans.</p>

          <h4 class="resume-sec-title">🌸 1. ARCHITECTURE & PIPELINE</h4>
          <p>The network leverages a dual-backbone ensemble featuring <strong>ResNet-50</strong> for feature representation and <strong>DenseNet-121</strong> for cross-layer gradient propagation. Data augmentation includes affine transformations, random elastic deformation, and contrast-limited adaptive histogram equalization (CLAHE).</p>

          <h4 class="resume-sec-title">🌸 2. EXPLAINABILITY WITH GRAD-CAM</h4>
          <p>To eliminate "black-box" concerns in clinical workflows, the model produces visual Grad-CAM activation heatmaps highlighting the exact anatomical regions responsible for the model's classification decision.</p>

          <h4 class="resume-sec-title">🌸 3. KEY METRICS & BENCHMARKS</h4>
          <ul style="margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.7;">
            <li><strong>Accuracy:</strong> 98.4% on holdout test set</li>
            <li><strong>Sensitivity (Recall):</strong> 99.1% (minimizing false negatives)</li>
            <li><strong>Inference Latency:</strong> 28ms on GPU / 120ms on CPU</li>
            <li><strong>Deployment:</strong> Containerized Docker image serving FastAPI REST endpoints</li>
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://github.com" target="_blank" class="btn btn-primary btn-sm">GitHub Repository 🌸</a>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('case-study-modal').classList.remove('active')">Close</button>
          </div>
        </div>
      `
    },
    omnisense: {
      title: 'OmniSense: Multilingual Sentiment & Emotion Classifier 🦋',
      pill: 'NLP &bull; Transformers &bull; DistilBERT',
      content: `
        <div class="cs-modal-content">
          <p class="cs-intro"><strong>Overview:</strong> OmniSense is an end-to-end natural language processing pipeline designed to classify nuanced human emotions (joy, frustration, confusion, sarcasm, urgency) across customer queries and conversational logs.</p>

          <h4 class="resume-sec-title">🦋 1. FINE-TUNING TRANSFORMERS</h4>
          <p>Fine-tuned a pretrained <strong>DistilBERT</strong> base uncased model using PyTorch and the Hugging Face Transformers library. Implemented AdamW optimizer with cosine learning rate decay and linear warmup over 8 epochs.</p>

          <h4 class="resume-sec-title">🦋 2. MULTILINGUAL HANDLING & SARCASM</h4>
          <p>Implemented subword tokenization with byte-pair encoding (BPE) and attention masking to prevent padding bias. Sarcasm detection was modeled using contextual attention layer projections.</p>

          <h4 class="resume-sec-title">🦋 3. PERFORMANCE</h4>
          <ul style="margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.7;">
            <li><strong>Macro F1-Score:</strong> 0.93 across 6 distinct emotion categories</li>
            <li><strong>Speedup:</strong> 40% smaller model footprint and 60% faster inference compared to standard BERT-base</li>
            <li><strong>Interactive API:</strong> Served via lightweight Flask microservice with live Chart.js radar visualizer</li>
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://github.com" target="_blank" class="btn btn-primary btn-sm">GitHub Repository 🦋</a>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('case-study-modal').classList.remove('active')">Close</button>
          </div>
        </div>
      `
    },
    aerotrack: {
      title: 'AeroTrack: Multi-Target Detection & Trajectory Tracking 🌸',
      pill: 'Computer Vision &bull; YOLOv8 &bull; ByteTrack',
      content: `
        <div class="cs-modal-content">
          <p class="cs-intro"><strong>Overview:</strong> Autonomous aerial drones and intelligent surveillance systems require continuous identity preservation of moving vehicles and pedestrians even during severe occlusion and camera jitter.</p>

          <h4 class="resume-sec-title">🌸 1. REAL-TIME OBJECT DETECTION</h4>
          <p>Employs <strong>YOLOv8</strong> optimized with TensorRT float16 precision, running at 62 frames per second on 1080p surveillance video feeds.</p>

          <h4 class="resume-sec-title">🌸 2. BYTETRACK DATA ASSOCIATION</h4>
          <p>Combines high-confidence and low-confidence detection boxes through a two-stage Kalman filter tracking association algorithm, eliminating identity switches when objects briefly pass behind obstacles.</p>

          <h4 class="resume-sec-title">🌸 3. BENCHMARK RESULTS</h4>
          <ul style="margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.7;">
            <li><strong>MOTA:</strong> 76.4% on VisDrone benchmark</li>
            <li><strong>Processing Rate:</strong> 62 FPS on desktop GPU / 26 FPS on edge Jetson</li>
            <li><strong>Zero ID Switches:</strong> Maintained continuous ID through 95% of brief occlusions</li>
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://github.com" target="_blank" class="btn btn-primary btn-sm">GitHub Repository 🌸</a>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('case-study-modal').classList.remove('active')">Close</button>
          </div>
        </div>
      `
    },
    stockpulse: {
      title: 'StockPulse: Quantitative Forecasting & Sentiment Engine 🌷',
      pill: 'Machine Learning &bull; LSTM &bull; Scikit-Learn',
      content: `
        <div class="cs-modal-content">
          <p class="cs-intro"><strong>Overview:</strong> Financial markets are influenced both by quantitative historical metrics and qualitative news headlines. StockPulse brings both data sources together in an interactive dashboard.</p>

          <h4 class="resume-sec-title">🌷 1. TIME-SERIES LSTM ARCHITECTURE</h4>
          <p>Constructed a stacked Long Short-Term Memory (LSTM) network with dropout layers to predict moving average trends while preventing overfitting on volatile financial time series.</p>

          <h4 class="resume-sec-title">🌷 2. NEWS FEED SENTIMENT FUSION</h4>
          <p>Aggregated real-time headlines via financial RSS feeds, passed them through FinBERT sentiment classification, and created an unified confidence score for asset price volatility.</p>

          <h4 class="resume-sec-title">🌷 3. DASHBOARD IMPLEMENTATION</h4>
          <ul style="margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.7;">
            <li><strong>Evaluation:</strong> Mean Squared Error (MSE) of 0.0031 on rolling 30-day forecast</li>
            <li><strong>Frontend:</strong> Streamlit interactive web application with dynamic Plotly charts</li>
            <li><strong>Tech:</strong> Pandas, NumPy, Scikit-Learn, PyTorch, Plotly, Streamlit</li>
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a href="https://github.com" target="_blank" class="btn btn-primary btn-sm">GitHub Repository 🌷</a>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('case-study-modal').classList.remove('active')">Close</button>
          </div>
        </div>
      `
    }
  };

  viewCsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = caseStudiesData[projKey];
      if (data && caseStudyModal) {
        csTitle.textContent = data.title;
        csPill.innerHTML = data.pill;
        csBody.innerHTML = data.content;
        caseStudyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeCsModalBtn && caseStudyModal) {
    closeCsModalBtn.addEventListener('click', () => {
      caseStudyModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) {
        caseStudyModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     11. RESUME MODAL HANDLER
     ========================================================================== */
  const resumeBtn = document.getElementById('resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Close any modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (caseStudyModal) caseStudyModal.classList.remove('active');
      if (resumeModal) resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ==========================================================================
     12. ONE-CLICK EMAIL COPY & TOAST NOTIFICATION
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'jainika.csemil@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('🌸 Email address copied to clipboard!');
        const copyText = document.getElementById('copy-text');
        if (copyText) {
          copyText.textContent = 'Copied! 🌸';
          setTimeout(() => { copyText.textContent = 'Copy'; }, 2000);
        }
      }).catch(() => {
        showToast('Direct email: ' + email);
      });
    });
  }

  /* ==========================================================================
     13. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      if (!subjectInput.value.trim()) {
        subjectInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.closest('.form-group').classList.remove('has-error');
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message... 🌸</span>`;

        setTimeout(() => {
          submitBtn.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'flex';
          showToast('🌸 Message sent! Jainika will reply soon.');
          contactForm.reset();
        }, 1200);
      }
    });

    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }

  /* ==========================================================================
     14. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     15. ACTIVE NAVIGATION LINK ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  });

});

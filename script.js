/**
 * SATYAM CHABBA PORTFOLIO - CORE ENGINE
 * Interactive Neural Canvas, Web Audio Synthesizer,
 * Real-time ML Simulators, Terminal CLI, Certificate Modal & Responsive Dynamics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year Update
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // =========================================================================
  // 2. SYNTHESIZED CYBER AUDIO FX (Web Audio API - Zero External Dependencies)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = false;

  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundToast = document.getElementById('soundToast');

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function showToast(msg) {
    if (!soundToast) return;
    soundToast.textContent = msg;
    soundToast.classList.add('show');
    setTimeout(() => soundToast.classList.remove('show'), 2400);
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggle.classList.add('active');
        if (soundIcon) {
          soundIcon.className = 'fa-solid fa-volume-high';
        }
        playTone(880, 'sine', 0.1, 0.08);
        showToast('🔊 Cyber Sound FX: ACTIVE');
      } else {
        soundToggle.classList.remove('active');
        if (soundIcon) {
          soundIcon.className = 'fa-solid fa-volume-xmark';
        }
        showToast('🔇 Cyber Sound FX: MUTED');
      }
    });
  }

  // Generic sound triggers for cyber feedback
  function playClickSound() { playTone(1200, 'triangle', 0.04, 0.03); }
  function playHoverSound() { playTone(540, 'sine', 0.03, 0.015); }
  function playSuccessSound() {
    playTone(600, 'sine', 0.06, 0.04);
    setTimeout(() => playTone(900, 'sine', 0.08, 0.04), 70);
  }

  document.querySelectorAll('a, button, input[type="range"], .sim-select-pill').forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSound());
    el.addEventListener('click', () => playClickSound());
  });

  // =========================================================================
  // 3. INTERACTIVE NEURAL CONSTELLATION CANVAS
  // =========================================================================
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 85;
    const maxDistance = 140;

    const mouse = {
      x: null,
      y: null,
      radius: 160
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
        this.color = Math.random() > 0.35 ? '#00f5d4' : '#9d4edd';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateNeuralGraph() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Connect to mouse pointer
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(157, 78, 221, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateNeuralGraph);
    }

    initParticles();
    animateNeuralGraph();
  }

  // =========================================================================
  // 4. CUSTOM CYBER CURSOR FOLLOWER
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .sim-select-pill').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // =========================================================================
  // 5. HERO TYPING ANIMATION
  // =========================================================================
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const roles = [
      'CSE (Artificial Intelligence) @ Shoolini University',
      'Microsoft Certified: Azure AI Fundamentals',
      'Microsoft Certified: Azure Fundamentals',
      'Machine Learning & Predictive Modeling Specialist',
      'Data Analytics Intern (Thiranex Alumni)',
      '18 y/o Data Intelligence & Algorithmic Innovator'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 70;
    const backSpeed = 35;
    const delayBetween = 1800;

    function handleTyping() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? backSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = delayBetween;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(handleTyping, timeout);
    }
    handleTyping();
  }

  // =========================================================================
  // 6. 3D PERSPECTIVE TILT (Holo Card, Project Cards & Cert Cards)
  // =========================================================================
  const holoCard = document.getElementById('holoCard');
  if (holoCard) {
    holoCard.addEventListener('mousemove', (e) => {
      const rect = holoCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // =========================================================================
  // 7. STATS NUMBER COUNTER ANIMATION
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsCounted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.quick-stats-strip');
  if (statsStrip) countObserver.observe(statsStrip);

  // =========================================================================
  // 8. INTERACTIVE ML SIMULATORS
  // =========================================================================
  
  // Tab Switcher
  const simTabBtns = document.querySelectorAll('.sim-tab-btn');
  const simPanels = document.querySelectorAll('.sim-panel');

  simTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simTabBtns.forEach(b => b.classList.remove('active'));
      simPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-sim');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // --- SIMULATOR 1: CAR SALE PRICE PREDICTION (REGRESSION MODEL) ---
  const carYear = document.getElementById('carYear');
  const carKm = document.getElementById('carKm');
  const carEngine = document.getElementById('carEngine');
  const carYearVal = document.getElementById('carYearVal');
  const carKmVal = document.getElementById('carKmVal');
  const carEngineVal = document.getElementById('carEngineVal');
  const carPredictedPrice = document.getElementById('carPredictedPrice');

  const weightDepr = document.getElementById('weightDepr');
  const weightMileage = document.getElementById('weightMileage');
  const weightEngine = document.getElementById('weightEngine');
  const weightSegment = document.getElementById('weightSegment');

  let selectedSegmentMult = 1.0;
  let selectedFuelMult = 1.0;

  // Segment Pill Group
  const segmentBtns = document.querySelectorAll('#carSegmentGroup .sim-select-pill');
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSegmentMult = parseFloat(btn.getAttribute('data-segment')) || 1.0;
      updateCarPrice();
    });
  });

  // Fuel Pill Group
  const fuelBtns = document.querySelectorAll('#carFuelGroup .sim-select-pill');
  fuelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fuelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const fuel = btn.getAttribute('data-fuel');
      if (fuel === 'diesel') selectedFuelMult = 1.08;
      else if (fuel === 'cng') selectedFuelMult = 0.94;
      else if (fuel === 'ev') selectedFuelMult = 1.25;
      else selectedFuelMult = 1.0; // petrol
      updateCarPrice();
    });
  });

  function formatIndianCurrency(num) {
    const rounded = Math.round(num);
    return rounded.toLocaleString('en-IN');
  }

  function updateCarPrice() {
    if (!carYear || !carKm || !carEngine) return;

    const year = parseInt(carYear.value, 10);
    const km = parseInt(carKm.value, 10);
    const engine = parseInt(carEngine.value, 10);

    carYearVal.textContent = year;
    carKmVal.textContent = km.toLocaleString('en-IN') + ' km';
    carEngineVal.textContent = engine + ' cc';

    // Regression Simulation Formula
    const baseNewPrice = 850000 * selectedSegmentMult;
    const age = 2024 - year;
    const deprRate = Math.pow(0.915, age);
    const mileageFactor = Math.max(0.55, 1 - (km / 250000));
    const engineFactor = 1 + ((engine - 1500) / 4500);

    let estimatedPrice = baseNewPrice * deprRate * mileageFactor * engineFactor * selectedFuelMult;
    if (estimatedPrice < 120000) estimatedPrice = 120000;

    if (carPredictedPrice) {
      carPredictedPrice.textContent = formatIndianCurrency(estimatedPrice);
    }

    // Update weights breakdown
    if (weightDepr) {
      const deprLoss = ((1 - deprRate) * 100).toFixed(1);
      weightDepr.textContent = `-${deprLoss}%`;
    }
    if (weightMileage) {
      const kmLoss = ((1 - mileageFactor) * 100).toFixed(1);
      weightMileage.textContent = `-${kmLoss}%`;
    }
    if (weightEngine) {
      const engGain = ((engineFactor - 1) * 100).toFixed(1);
      weightEngine.textContent = (engGain >= 0 ? '+' : '') + `${engGain}%`;
    }
    if (weightSegment) {
      weightSegment.textContent = `${selectedSegmentMult.toFixed(2)}x`;
    }
  }

  if (carYear) carYear.addEventListener('input', updateCarPrice);
  if (carKm) carKm.addEventListener('input', updateCarPrice);
  if (carEngine) carEngine.addEventListener('input', updateCarPrice);
  updateCarPrice();

  // --- SIMULATOR 2: HEART DISEASE RISK CLASSIFIER ---
  const heartAge = document.getElementById('heartAge');
  const heartBp = document.getElementById('heartBp');
  const heartChol = document.getElementById('heartChol');
  const heartMaxRate = document.getElementById('heartMaxRate');

  const heartAgeVal = document.getElementById('heartAgeVal');
  const heartBpVal = document.getElementById('heartBpVal');
  const heartCholVal = document.getElementById('heartCholVal');
  const heartMaxRateVal = document.getElementById('heartMaxRateVal');

  const heartRiskPercent = document.getElementById('heartRiskPercent');
  const heartRiskLevel = document.getElementById('heartRiskLevel');
  const gaugeBar = document.getElementById('gaugeBar');
  const heartDiagnosisAdvice = document.getElementById('heartDiagnosisAdvice');

  const coefBp = document.getElementById('coefBp');
  const coefChol = document.getElementById('coefChol');
  const coefHr = document.getElementById('coefHr');

  let selectedChestPain = 0;

  const chestPainBtns = document.querySelectorAll('#heartPainGroup .sim-select-pill');
  chestPainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chestPainBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedChestPain = parseInt(btn.getAttribute('data-pain'), 10) || 0;
      updateHeartRisk();
    });
  });

  function updateHeartRisk() {
    if (!heartAge || !heartBp || !heartChol || !heartMaxRate) return;

    const age = parseInt(heartAge.value, 10);
    const bp = parseInt(heartBp.value, 10);
    const chol = parseInt(heartChol.value, 10);
    const maxRate = parseInt(heartMaxRate.value, 10);

    heartAgeVal.textContent = `${age} yrs`;
    heartBpVal.textContent = `${bp} mm Hg`;
    heartCholVal.textContent = `${chol} mg/dl`;
    heartMaxRateVal.textContent = `${maxRate} bpm`;

    let z = -4.5;
    z += (age - 25) * 0.045;
    z += (bp - 110) * 0.035;
    z += (chol - 180) * 0.015;
    z -= (maxRate - 120) * 0.032;
    z += selectedChestPain * 0.75;

    const prob = 1 / (1 + Math.exp(-z));
    const riskPercentage = Math.min(98, Math.max(4, Math.round(prob * 100)));

    if (heartRiskPercent) heartRiskPercent.textContent = `${riskPercentage}%`;

    const circumference = 264;
    const offset = circumference - (circumference * riskPercentage / 100);
    if (gaugeBar) {
      gaugeBar.style.strokeDashoffset = offset;
    }

    if (heartRiskLevel && gaugeBar && heartDiagnosisAdvice) {
      if (riskPercentage < 35) {
        heartRiskLevel.textContent = 'LOW RISK';
        heartRiskLevel.style.color = 'var(--green)';
        gaugeBar.style.stroke = 'var(--green)';
        heartDiagnosisAdvice.innerHTML = `
          <i class="fa-solid fa-notes-medical" style="color: var(--green);"></i>
          <span>Clinical indicators within normal statistical boundaries. Low likelihood of coronary obstruction.</span>
        `;
      } else if (riskPercentage < 65) {
        heartRiskLevel.textContent = 'MODERATE RISK';
        heartRiskLevel.style.color = 'var(--amber)';
        gaugeBar.style.stroke = 'var(--amber)';
        heartDiagnosisAdvice.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation" style="color: var(--amber);"></i>
          <span>Borderline cardiovascular parameters detected. Recommend dietary moderation, stress ECG, and lipid monitoring.</span>
        `;
      } else {
        heartRiskLevel.textContent = 'HIGH RISK';
        heartRiskLevel.style.color = 'var(--red)';
        gaugeBar.style.stroke = 'var(--red)';
        heartDiagnosisAdvice.innerHTML = `
          <i class="fa-solid fa-circle-exclamation" style="color: var(--red);"></i>
          <span>High predictive clinical hazard index. Urgent clinical cardiology review, angiogram, and therapeutic intervention suggested.</span>
        `;
      }
    }

    if (coefBp) coefBp.textContent = bp > 135 ? `+${Math.round((bp - 110) * 0.35)}%` : 'Optimal';
    if (coefChol) coefChol.textContent = chol > 220 ? `+${Math.round((chol - 180) * 0.15)}%` : 'Controlled';
    if (coefHr) coefHr.textContent = maxRate > 150 ? `-${Math.round((maxRate - 120) * 0.32)}% (Protective)` : '+5% (Fatigue)';
  }

  if (heartAge) heartAge.addEventListener('input', updateHeartRisk);
  if (heartBp) heartBp.addEventListener('input', updateHeartRisk);
  if (heartChol) heartChol.addEventListener('input', updateHeartRisk);
  if (heartMaxRate) heartMaxRate.addEventListener('input', updateHeartRisk);
  updateHeartRisk();

  // =========================================================================
  // 9. CERTIFICATE MODAL PREVIEW
  // =========================================================================
  window.openCertModal = function(imgSrc, title) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalCertImage');
    const modalTitle = document.getElementById('modalCertTitle');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');

    if (modal && modalImg && modalTitle) {
      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      if (modalDownloadBtn) modalDownloadBtn.href = imgSrc;
      modal.classList.add('active');
      playTone(720, 'sine', 0.08, 0.03);
    }
  };

  window.closeCertModal = function() {
    const modal = document.getElementById('certModal');
    if (modal) {
      modal.classList.remove('active');
      playTone(400, 'sine', 0.06, 0.02);
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeCertModal();
    }
  });

  // =========================================================================
  // 10. INTERACTIVE TERMINAL ("SATYAM OS CLI")
  // =========================================================================
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  const commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: () => `
<div class="text-cyan font-bold">SYSTEM UTILITIES & COMMANDS:</div>
  <span class="text-green">certs</span>       - Display verified Microsoft & Industry certifications
  <span class="text-green">about</span>       - Print Satyam's background, vision & Shoolini affiliation
  <span class="text-green">projects</span>    - List Machine Learning & Data Intelligence repositories
  <span class="text-green">skills</span>      - Display technical proficiency & model tooling matrix
  <span class="text-green">shoolini</span>    - Details about B.Tech CSE (AI) curriculum & research
  <span class="text-green">predict</span>     - Run instant demo ML inference cycle
  <span class="text-green">contact</span>     - View direct communication vectors & email
  <span class="text-green">socials</span>     - Print direct GitHub & LinkedIn URLs
  <span class="text-green">quote</span>       - AI engineering philosophy axiom
  <span class="text-green">clear</span>       - Wipe terminal screen buffer
    `,
    certs: () => `
<div class="text-cyan font-bold">VERIFIED INDUSTRY ACCREDITATIONS:</div>
1. <span class="text-green">[Microsoft Certified: Azure AI Fundamentals]</span>
   • Verification Code: <span class="text-cyan">w6m7B-46DB</span>
   • Issuer: Microsoft / Certiport
   • Scope: Machine Learning, Computer Vision, NLP & Conversational AI on Azure

2. <span class="text-green">[Microsoft Certified: Azure Fundamentals]</span>
   • Verification Code: <span class="text-cyan">nFDL-Dw8X</span>
   • Date Issued: Sept 16, 2026
   • Scope: Cloud Architecture, Security, Governance & Management Services

3. <span class="text-green">[Data Analytics Internship - Thiranex]</span>
   • Credential ID: <span class="text-cyan">THX-JUN1126-460</span>
   • Tenure: 11 Jun 2026 – 10 Jul 2026
   • Scope: Exploratory Data Analysis, Feature Engineering & Statistical Modeling
    `,
    certificates: () => terminalCommands.certs(),
    about: () => `
<div class="text-cyan font-bold">Satyam Chabba [Profile Telemetry]</div>
• Age: 18 years old
• Degree: B.Tech Computer Science & Engineering (Artificial Intelligence)
• Campus: Shoolini University (Solan, Himachal Pradesh)
• Accreditations: Microsoft Certified (Azure & Azure AI), Thiranex Data Analytics
• Email: satyamgarg132008@gmail.com
• Core Objective: Building high-precision predictive models, automated feature engineering, and robust neural architectures.
    `,
    projects: () => `
<div class="text-cyan font-bold">Engineered ML Repositories:</div>
1. <span class="text-green">[Car Sale Price Prediction Engine]</span> - Random Forest & Gradient Boosted Regression for second-hand automotive asset pricing.
2. <span class="text-green">[Heart Disease Risk Classifier]</span> - Biomedical classification assessing cardiac risk from clinical biomarkers with 95.4% sensitivity.
3. <span class="text-green">[Automated EDA & Preprocessing Pipeline]</span> - Modular Python pipeline for outlier removal, KNN imputation & PCA reduction.
Type 'predict' to test inference live!
    `,
    skills: () => `
<div class="text-cyan font-bold">Tech Stack & Competencies:</div>
• <span class="text-purple">Cloud & AI:</span> Microsoft Azure Cloud, Azure Cognitive Services, Cloud Architecture
• <span class="text-purple">Languages:</span> Python, C++, SQL, Modern HTML5/CSS3/JavaScript
• <span class="text-purple">AI / ML:</span> Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering
• <span class="text-purple">Architectures:</span> Regression, Random Forest, SVM, Logistic Classifiers, Neural Networks
• <span class="text-purple">Tools:</span> Git, GitHub, Jupyter Notebooks, Google Colab, Linux CLI
    `,
    shoolini: () => `
<div class="text-cyan font-bold">Academic Base: Shoolini University</div>
• Specialization: B.Tech Computer Science & Engineering (AI)
• Known for top research citations, biotechnology & artificial intelligence incubators.
• Collaborative research and algorithm implementation center.
    `,
    predict: () => `
<span class="text-cyan">Executing client-side Random Forest model inference...</span>
[✓] Ingesting 2021 model vector: 35,000 km, 1500 cc Petrol
[✓] Evaluating decision tree ensemble...
<span class="text-green font-bold">Result: ₹ 7,85,000 (Confidence: 93.8%)</span>
Scroll to the 'ML Lab' section above to tweak sliders in real time!
    `,
    contact: () => `
<div class="text-cyan font-bold">Communication Channels:</div>
• Direct Email: <a href="mailto:satyamgarg132008@gmail.com" class="text-green">satyamgarg132008@gmail.com</a>
• GitHub: <a href="https://github.com/satyamgarg132008-cyber" target="_blank" class="text-green">github.com/satyamgarg132008-cyber</a>
• LinkedIn: <a href="https://www.linkedin.com/in/satyam-chabba-8b3787396" target="_blank" class="text-green">linkedin.com/in/satyam-chabba-8b3787396</a>
    `,
    socials: () => `
• GitHub: https://github.com/satyamgarg132008-cyber
• LinkedIn: https://www.linkedin.com/in/satyam-chabba-8b3787396
• Email: satyamgarg132008@gmail.com
    `,
    quote: () => `
<span class="text-purple font-bold">"Data is just noise until mathematical modeling extracts its soul."</span>
    `,
    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeTerminalCommand(cmdText) {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Append command entry
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line term-cmd-entry';
    cmdLine.innerHTML = `<span class="term-prompt">satyam@ai:~$</span> <span>${cmdText}</span>`;
    terminalOutput.appendChild(cmdLine);

    // Run command
    if (terminalCommands[trimmed]) {
      const output = terminalCommands[trimmed]();
      if (output) {
        const outDiv = document.createElement('div');
        outDiv.className = 'term-output-block';
        outDiv.innerHTML = output;
        terminalOutput.appendChild(outDiv);
      }
    } else {
      const errDiv = document.createElement('div');
      errDiv.className = 'term-output-block text-red';
      errDiv.innerHTML = `command not found: ${trimmed}. Type <span class="text-green">'help'</span> for valid commands.`;
      terminalOutput.appendChild(errDiv);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    playSuccessSound();
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        executeTerminalCommand(val);
        terminalInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (terminalInput) terminalInput.value = cmd;
      executeTerminalCommand(cmd);
      if (terminalInput) terminalInput.value = '';
    });
  });

  // =========================================================================
  // 11. COPY EMAIL CLIPBOARD & MESSAGE FORM
  // =========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'satyamgarg132008@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copied to clipboard: ' + email);
        playSuccessSound();
      }).catch(() => {
        showToast('Direct Email: ' + email);
      });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('messageSubject').value;
      const body = document.getElementById('messageBody').value;

      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - From ${name}`);
      const fullBody = encodeURIComponent(`Hello Satyam,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${body}\n\n---\nTransmitted via Portfolio Terminal`);
      
      showToast('🚀 Launching your email client...');
      playSuccessSound();

      setTimeout(() => {
        window.location.href = `mailto:satyamgarg132008@gmail.com?subject=${fullSubject}&body=${fullBody}`;
      }, 600);
    });
  }

  // =========================================================================
  // 12. NAVBAR SCROLL EFFECT & MOBILE MENU
  // =========================================================================
  const navbar = document.querySelector('.navbar-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
});

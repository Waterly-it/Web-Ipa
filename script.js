/* ═══════════════════════════════════════════════════════════
   Digital Human Body Explorer — JavaScript
   Interactive features: particles, reveal, quiz, diagrams
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navigation ── */
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 2. Hero particles ── */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 4 + Math.random() * 10;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = Math.random() * 100 + '%';
      p.style.top    = Math.random() * 100 + '%';
      p.style.animationDelay    = (Math.random() * 4) + 's';
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      heroParticles.appendChild(p);
    }
  }

  /* ── 3. Scroll reveal ── */
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObs.observe(el));

  /* ── 4. Function flow (Sistem Saraf) ── */
  document.querySelectorAll('.function-step').forEach(step => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.function-step').forEach(s =>
        s.classList.remove('function-step--active')
      );
      step.classList.add('function-step--active');
    });
  });

  /* ── 5. Arm collab demo (Sistem Gerak) ── */
  const collabBtn    = document.getElementById('collabBtn');
  const armDiagram   = document.querySelector('.arm-diagram');
  const collabSteps  = document.querySelectorAll('.collab-step');
  let armBent = false;

  if (collabBtn && armDiagram) {
    collabBtn.addEventListener('click', () => {
      armBent = !armBent;
      armDiagram.classList.toggle('bent', armBent);
      collabBtn.classList.toggle('active', armBent);

      const btnText = collabBtn.querySelector('.collab-demo__btn-text');
      btnText.textContent = armBent
        ? 'Klik lagi untuk meluruskan lengan'
        : 'Klik untuk simulasi menekuk lengan';

      // Animate steps one by one
      if (armBent) {
        collabSteps.forEach((s, i) => {
          setTimeout(() => s.classList.add('collab-step--active'), i * 300);
        });
      } else {
        collabSteps.forEach(s => s.classList.remove('collab-step--active'));
        setTimeout(() => collabSteps[0].classList.add('collab-step--active'), 200);
      }
    });
  }

  /* ── 6. Scenario picker (Hubungan) ── */
  const scenarios = [
    {
      type: 'sadar',
      title: 'Mengambil Buku di Rak — Gerak Sadar',
      text: 'Mata melihat buku → sinyal dikirim ke otak → otak memproses dan memutuskan mengambil buku → perintah dikirim melalui saraf motorik → otot lengan berkontraksi → tangan mengambil buku. Proses ini melibatkan kesadaran penuh dan keputusan dari otak besar (serebrum).'
    },
    {
      type: 'refleks',
      title: 'Menyentuh Wajan Panas — Gerak Refleks',
      text: 'Kulit tangan menyentuh wajan panas → reseptor rasa nyeri di kulit mengirim sinyal → sinyal langsung diproses di sumsum tulang belakang → perintah segera dikirim ke otot → tangan ditarik dengan cepat. Otak baru "tahu" setelah tangan sudah ditarik. Ini adalah mekanisme perlindungan tubuh yang sangat cepat.'
    },
    {
      type: 'sadar',
      title: 'Menendang Bola — Gerak Sadar',
      text: 'Mata melihat bola mendekat → sinyal visual dikirim ke otak → otak menghitung waktu dan arah tendangan → perintah dikirim melalui saraf motorik → otot paha dan betis berkontraksi secara terkoordinasi → kaki menendang bola. Seluruh proses dikendalikan secara sadar oleh otak.'
    },
    {
      type: 'refleks',
      title: 'Pupil Mengecil di Cahaya Terang — Gerak Refleks',
      text: 'Cahaya terang masuk ke mata → reseptor cahaya di retina mengirim sinyal → sinyal diproses di batang otak (bukan serebrum) → perintah dikirim ke otot iris → pupil mengecil otomatis. Kita tidak bisa mengontrol ini secara sadar — ini adalah refleks pupil yang melindungi retina dari kerusakan.'
    }
  ];

  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const idx = parseInt(btn.dataset.scenario);
      const s = scenarios[idx];
      const resultEl = document.getElementById('scenarioResult');

      resultEl.innerHTML = `
        <span class="scenario-result__type scenario-result__type--${s.type}">
          ${s.type === 'sadar' ? '🧠 Gerak Sadar' : '⚡ Gerak Refleks'}
        </span>
        <h4 class="scenario-result__title">${s.title}</h4>
        <p class="scenario-result__text">${s.text}</p>
      `;
      resultEl.style.animation = 'none';
      resultEl.offsetHeight; // reflow
      resultEl.style.animation = 'fadeSlide .35s ease';
    });
  });

  /* ── 7. Flow diagram ── */
  const flowData = [
    {
      title: 'Rangsangan (Stimulus)',
      text: 'Perubahan di lingkungan yang dapat dideteksi oleh tubuh. Contoh: cahaya matahari, suara bel, sentuhan benda panas, bau makanan, rasa manis. Rangsangan bisa berasal dari luar tubuh (eksternal) maupun dari dalam tubuh (internal seperti rasa lapar).'
    },
    {
      title: 'Reseptor (Penerima Rangsangan)',
      text: 'Ujung saraf khusus di organ indra yang menangkap rangsangan dan mengubahnya menjadi impuls saraf (sinyal listrik). Contoh: sel kerucut di mata (cahaya), sel rambut di telinga (suara), ujung saraf bebas di kulit (nyeri dan suhu).'
    },
    {
      title: 'Saraf Sensorik (Aferen)',
      text: 'Neuron yang membawa impuls dari reseptor menuju sistem saraf pusat (otak atau sumsum tulang belakang). Sinyal bergerak sebagai impuls listrik yang merambat sepanjang serabut saraf dengan kecepatan hingga 120 m/detik.'
    },
    {
      title: 'Pusat Saraf (Otak / Sumsum Tulang Belakang)',
      text: 'Tempat pemrosesan informasi. Otak memproses rangsangan untuk gerak sadar — menganalisis situasi dan memutuskan respons. Sumsum tulang belakang memproses gerak refleks — memberikan respons cepat tanpa menunggu analisis otak.'
    },
    {
      title: 'Saraf Motorik (Eferen)',
      text: 'Neuron yang membawa perintah dari pusat saraf menuju efektor (organ pelaksana). Saraf motorik menerjemahkan "keputusan" menjadi instruksi konkret bagi otot atau kelenjar untuk melakukan tindakan.'
    },
    {
      title: 'Efektor (Pelaksana Respons)',
      text: 'Organ yang melaksanakan respons berdasarkan perintah dari pusat saraf. Efektor utama adalah otot (menghasilkan gerakan) dan kelenjar (menghasilkan sekresi). Contoh: otot bisep berkontraksi untuk menekuk lengan, kelenjar keringat menghasilkan keringat saat panas.'
    }
  ];

  document.querySelectorAll('.flow-node').forEach(node => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('flow-node--active'));
      node.classList.add('flow-node--active');

      const idx = parseInt(node.dataset.flow);
      const d = flowData[idx];
      document.getElementById('flowTitle').textContent = d.title;
      document.getElementById('flowText').textContent  = d.text;

      const card = document.querySelector('.flow-detail__card');
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = 'fadeSlide .3s ease';
    });
  });

  /* ── 8. Quiz ── */
  const quizQuestions = [
    {
      question: 'Bagian sistem saraf yang berfungsi sebagai pusat pengolahan informasi dan koordinasi seluruh tubuh adalah…',
      options: ['Saraf tepi', 'Sumsum tulang belakang', 'Otak', 'Saraf motorik'],
      correct: 2,
      explanation: 'Otak merupakan pusat pengolahan informasi utama. Otak menerima rangsangan dari seluruh tubuh, memprosesnya, dan mengkoordinasikan respons yang tepat.'
    },
    {
      question: 'Pada gerak refleks, sinyal diproses di bagian…',
      options: ['Otak besar (serebrum)', 'Otak kecil (serebelum)', 'Sumsum tulang belakang', 'Saraf tepi'],
      correct: 2,
      explanation: 'Gerak refleks diproses di sumsum tulang belakang untuk menghasilkan respons yang sangat cepat tanpa menunggu perintah dari otak. Ini adalah mekanisme perlindungan tubuh.'
    },
    {
      question: 'Urutan yang benar pada mekanisme gerak sadar adalah…',
      options: [
        'Rangsangan → efektor → otak → saraf motorik → reseptor',
        'Rangsangan → reseptor → saraf sensorik → otak → saraf motorik → efektor',
        'Reseptor → rangsangan → sumsum tulang belakang → otot',
        'Otot → saraf → otak → reseptor → rangsangan'
      ],
      correct: 1,
      explanation: 'Gerak sadar dimulai dari rangsangan yang ditangkap reseptor, dikirim melalui saraf sensorik ke otak untuk diproses, lalu perintah dikirim melalui saraf motorik ke efektor (otot).'
    },
    {
      question: 'Otot bisep dan trisep bekerja secara berlawanan (antagonis). Saat lengan ditekuk, yang terjadi adalah…',
      options: [
        'Bisep dan trisep sama-sama berkontraksi',
        'Bisep relaksasi, trisep berkontraksi',
        'Bisep berkontraksi, trisep relaksasi',
        'Bisep dan trisep sama-sama relaksasi'
      ],
      correct: 2,
      explanation: 'Saat menekuk lengan, otot bisep berkontraksi (memendek) untuk menarik tulang lengan bawah, sementara otot trisep relaksasi (memanjang) untuk memungkinkan gerakan tersebut.'
    },
    {
      question: 'Manakah contoh gerak refleks dalam kehidupan sehari-hari?',
      options: [
        'Menulis catatan di buku tulis',
        'Menarik tangan saat menyentuh benda panas',
        'Berjalan menuju kantin saat istirahat',
        'Mengangkat tangan untuk bertanya di kelas'
      ],
      correct: 1,
      explanation: 'Menarik tangan saat menyentuh benda panas adalah gerak refleks — terjadi secara otomatis dan sangat cepat, diproses di sumsum tulang belakang tanpa menunggu perintah otak, untuk melindungi tubuh dari cedera.'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const quizEl        = document.getElementById('quiz');
  const questionEl    = document.getElementById('quizQuestion');
  const optionsEl     = document.getElementById('quizOptions');
  const feedbackEl    = document.getElementById('quizFeedback');
  const nextBtn       = document.getElementById('quizNext');
  const progressBar   = document.getElementById('quizProgress');
  const currentSpan   = document.getElementById('quizCurrent');
  const resultEl      = document.getElementById('quizResult');

  function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    answered = false;
    nextBtn.disabled = true;
    feedbackEl.className = 'quiz__feedback';
    feedbackEl.textContent = '';

    questionEl.textContent = q.question;
    currentSpan.textContent = currentQuestion + 1;
    progressBar.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';

    optionsEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz__option';
      btn.innerHTML = `<span class="quiz__option-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => selectAnswer(i, btn));
      optionsEl.appendChild(btn);
    });
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQuestion];
    const allBtns = optionsEl.querySelectorAll('.quiz__option');
    allBtns.forEach(b => b.disabled = true);

    if (idx === q.correct) {
      btn.classList.add('correct');
      score++;
      feedbackEl.className = 'quiz__feedback quiz__feedback--correct';
      feedbackEl.innerHTML = `<strong>✓ Benar!</strong> ${q.explanation}`;
    } else {
      btn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
      feedbackEl.className = 'quiz__feedback quiz__feedback--wrong';
      feedbackEl.innerHTML = `<strong>✗ Kurang tepat.</strong> ${q.explanation}`;
    }

    nextBtn.disabled = false;
    nextBtn.textContent = currentQuestion < quizQuestions.length - 1
      ? 'Soal Berikutnya'
      : 'Lihat Hasil';
  }

  nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    questionEl.style.display = 'none';
    optionsEl.style.display  = 'none';
    feedbackEl.style.display = 'none';
    nextBtn.style.display    = 'none';
    document.querySelector('.quiz__counter').style.display = 'none';

    const iconEl  = document.getElementById('resultIcon');
    const titleEl = document.getElementById('resultTitle');
    const textEl  = document.getElementById('resultText');
    const scoreEl = document.getElementById('resultScore');

    scoreEl.textContent = score;
    resultEl.hidden = false;

    if (score === 5) {
      iconEl.textContent  = '🏆';
      titleEl.textContent = 'Sempurna!';
      textEl.textContent  = 'Luar biasa! Kamu memahami hubungan sistem saraf dan gerak manusia dengan sangat baik.';
    } else if (score >= 3) {
      iconEl.textContent  = '🌟';
      titleEl.textContent = 'Bagus!';
      textEl.textContent  = 'Pemahamanmu sudah cukup baik. Coba pelajari lagi materi yang kurang tepat.';
    } else {
      iconEl.textContent  = '📚';
      titleEl.textContent = 'Tetap Semangat!';
      textEl.textContent  = 'Yuk pelajari kembali materi di atas lalu coba lagi kuisnya.';
    }
  }

  document.getElementById('quizRetry').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    resultEl.hidden = true;
    questionEl.style.display = '';
    optionsEl.style.display  = '';
    feedbackEl.style.display = '';
    nextBtn.style.display    = '';
    document.querySelector('.quiz__counter').style.display = '';
    renderQuestion();
  });

  // Start quiz
  renderQuestion();

});


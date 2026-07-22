// =========================================================
// マーダーミステリー体験サイト — script.js
// 全ページ共通。要素が存在しないページでは各処理は自動でスキップされます。
// =========================================================

/* ---------------------------------------------------------
   用語データ（index.html の用語カード / words.html の詳細ページで共用）
--------------------------------------------------------- */
const TERMS = [
  {
    id: 'alibi',
    label: 'アリバイ',
    title: 'アリバイ',
    desc: '事件が起きた時間に、どこで何をしていたかを示す証言。'
  },
  {
    id: 'ending',
    label: 'エンディングフェイズ',
    title: 'エンディングフェイズ',
    desc: '投票結果と事件の真相が公開され、各キャラクターの秘密や目的が明かされる最終フェイズ。'
  },
  {
    id: 'character-sheet',
    label: 'キャラクターシート',
    title: 'キャラクターシート',
    desc: 'プレイヤーごとに配られる、演じる人物の設定・目的・秘密がまとめられた資料。'
  },
  {
    id: 'discussion',
    label: '議論フェイズ',
    title: '議論フェイズ',
    desc: '参加者同士で情報を交換し、質問や証言をもとに事件の真相を推理する時間。'
  },
  {
    id: 'public-info',
    label: '公開情報',
    title: '公開情報',
    desc: '全プレイヤーが共通して知っている、誰に話しても構わない情報。'
  },
  {
    id: 'private-info',
    label: '個別情報',
    title: '個別情報',
    desc: '特定のキャラクターだけが知っている情報。話すか隠すかで展開が変わる。'
  },
  {
    id: 'gm',
    label: 'GM（ゲームマスター）',
    title: 'GM（ゲームマスター）',
    desc: '進行役としてゲーム全体を管理し、ルール説明や進行のサポートを行う人。'
  },
  {
    id: 'handout',
    label: 'ハンドアウト',
    title: 'ハンドアウト',
    desc: 'キャラクターシートの一部として渡される、個別の設定資料や証拠品。'
  },
  {
    id: 'voting',
    label: '投票フェイズ',
    title: '投票フェイズ',
    desc: '議論で集めた情報をもとに、犯人だと思う人物へ投票するフェイズ。一票が結末を左右する。'
  }
];

document.addEventListener('DOMContentLoaded', () => {

  setActiveNavLink();
  setupScrollReveal();
  setupSmoothAnchors();
  setupMoreTerms();
  setupCaseFileCarousel();
  setupHomeStoryCarousel();
  setupWordDetailCarousel();
  setupStoryTabs();
  setupTypeQuiz();
  setupHomeTypeResult();
  setupNavOverlay();
  setupStickyNav();

});

/* ---------------------------------------------------------
   共通ナビ：現在ページのタブをハイライト
--------------------------------------------------------- */
function setActiveNavLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('?')[0];
    link.classList.toggle('is-current', href === path);
  });
}

/* ---------------------------------------------------------
   共通：スクロールで要素をふわっと表示（.reveal クラス）
--------------------------------------------------------- */
function setupScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   共通：下にスクロールしたらナビを小さく追従表示
--------------------------------------------------------- */
function setupStickyNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const THRESHOLD = 64;
  let ticking = false;

  function update() {
    document.body.classList.toggle('nav-compact', window.scrollY > THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ---------------------------------------------------------
   共通：検索アイコンから開くオーバーレイメニュー
--------------------------------------------------------- */
function setupNavOverlay() {
  const overlay = document.getElementById('navOverlay');
  const openBtn = document.querySelector('.navbar__search');
  const closeBtn = document.getElementById('navOverlayClose');
  if (!overlay || !openBtn) return;

  function openMenu() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMenu();
  });
}

/* ---------------------------------------------------------
   共通：ページ内アンカー（#top など）のスムーススクロール
--------------------------------------------------------- */
function setupSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------------------------------------------------------
   index.html: WORDS「もっと見る」
--------------------------------------------------------- */
function setupMoreTerms() {
  const btnMore = document.getElementById('btnMore');
  if (!btnMore) return;
  const hiddenCards = document.querySelectorAll('.term-card.is-hidden');

  btnMore.addEventListener('click', () => {
    hiddenCards.forEach((card, i) => {
      setTimeout(() => card.classList.remove('is-hidden'), i * 70);
    });
    btnMore.classList.add('is-done');
  });
}

/* ---------------------------------------------------------
   index.html: CASE FILE カルーセル
--------------------------------------------------------- */
function setupCaseFileCarousel() {
  const track = document.getElementById('casefileTrack');
  if (!track) return;
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('casePrev');
  const nextBtn = document.getElementById('caseNext');
  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current < 0) current = 0;

  function render() {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  render();
  nextBtn?.addEventListener('click', () => { current = (current + 1) % slides.length; render(); });
  prevBtn?.addEventListener('click', () => { current = (current - 1 + slides.length) % slides.length; render(); });
}

/* ---------------------------------------------------------
   words.html: 用語詳細カルーセル（左右プレビュー付き）
--------------------------------------------------------- */
function setupWordDetailCarousel() {
  const stage = document.getElementById('wordStage');
  if (!stage) return;

  const titleEl = document.getElementById('wordTitle');
  const descEl = document.getElementById('wordDesc');
  const peekPrevEl = document.getElementById('wordPeekPrev');
  const peekNextEl = document.getElementById('wordPeekNext');
  const prevBtn = document.getElementById('wordPrev');
  const nextBtn = document.getElementById('wordNext');
  const counterEl = document.getElementById('wordCounter');

  const params = new URLSearchParams(location.search);
  const requested = params.get('term');
  let index = TERMS.findIndex(t => t.id === requested);
  if (index < 0) index = 0;

  function render(direction) {
    const term = TERMS[index];
    const prevTerm = TERMS[(index - 1 + TERMS.length) % TERMS.length];
    const nextTerm = TERMS[(index + 1) % TERMS.length];

    const activeCard = document.getElementById('wordCurrent');
    activeCard.classList.remove('is-anim-left', 'is-anim-right');
    void activeCard.offsetWidth; // reflow でアニメーションを再トリガー
    if (direction === 'next') activeCard.classList.add('is-anim-right');
    if (direction === 'prev') activeCard.classList.add('is-anim-left');

    titleEl.textContent = term.title;
    descEl.textContent = term.desc;
    peekPrevEl.textContent = prevTerm.label;
    peekNextEl.textContent = nextTerm.label;
    if (counterEl) counterEl.textContent = `${index + 1} / ${TERMS.length}`;

    const newUrl = `${location.pathname}?term=${term.id}`;
    history.replaceState(null, '', newUrl);
  }

  render();

  nextBtn?.addEventListener('click', () => { index = (index + 1) % TERMS.length; render('next'); });
  prevBtn?.addEventListener('click', () => { index = (index - 1 + TERMS.length) % TERMS.length; render('prev'); });
  peekNextEl?.addEventListener('click', () => { index = (index + 1) % TERMS.length; render('next'); });
  peekPrevEl?.addEventListener('click', () => { index = (index - 1 + TERMS.length) % TERMS.length; render('prev'); });

  // スワイプ操作（タッチ）にも対応
  let touchStartX = null;
  stage.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) { index = (index + 1) % TERMS.length; render('next'); }
      else { index = (index - 1 + TERMS.length) % TERMS.length; render('prev'); }
    }
    touchStartX = null;
  });
}

/* ---------------------------------------------------------
   index.html: STORY キャラクターセレクター（矢印でスクロール）
--------------------------------------------------------- */
function setupHomeStoryCarousel() {
  const track = document.getElementById('homeStoryTrack');
  if (!track) return;

  const prevBtn = document.getElementById('homeStoryPrev');
  const nextBtn = document.getElementById('homeStoryNext');
  const thumbs = Array.from(track.children);

  function scrollByThumb(dir) {
    const thumbWidth = thumbs[0]?.getBoundingClientRect().width || 60;
    const gap = 12;
    track.scrollBy({ left: dir * (thumbWidth + gap) * 2, behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByThumb(-1));
  nextBtn?.addEventListener('click', () => scrollByThumb(1));

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  makeDragScrollable(track);
}

/* ---------------------------------------------------------
   共通：横スクロール要素をマウスドラッグでも操作できるようにする
   （スクロールバーを隠しているため、PCではドラッグが唯一の操作手段になる）
--------------------------------------------------------- */
function makeDragScrollable(container) {
  if (!container) return;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  container.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return; // タッチ／ペンは標準のスクロールに任せる
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = container.scrollLeft;
    container.classList.add('is-dragging');
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    container.scrollLeft = startScroll - dx;
  });

  function endDrag() {
    isDown = false;
    container.classList.remove('is-dragging');
  }
  container.addEventListener('pointerup', endDrag);
  container.addEventListener('pointerleave', endDrag);
  container.addEventListener('pointercancel', endDrag);

  // ドラッグ後にリンク／ボタンへ誤ってクリック判定されるのを防ぐ
  container.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);
}

/* ---------------------------------------------------------
   story.html: キャラタブ切り替え
--------------------------------------------------------- */
function setupStoryTabs() {
  const tabs = Array.from(document.querySelectorAll('.story-tab'));
  const image = document.getElementById('storyImage');
  const nameEl = document.getElementById('storyName');
  const metaEl = document.getElementById('storyMeta');
  const bioEl = document.getElementById('storyBio');
  const infoEl = document.getElementById('storyInfo');
  if (!tabs.length || !image) return;

  function selectTab(tab) {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const img = tab.dataset.image;
    image.classList.add('is-fading');
    infoEl?.classList.add('is-fading');
    setTimeout(() => {
      if (img) image.style.backgroundImage = `url('${img}')`;
      if (nameEl) nameEl.textContent = tab.dataset.name || '';
      if (metaEl) metaEl.textContent = tab.dataset.meta || '';
      if (bioEl) bioEl.textContent = tab.dataset.bio || '';
      image.classList.remove('is-fading');
      infoEl?.classList.remove('is-fading');
    }, 180);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectTab(tab));
  });

  // HOMEのキャラクターセレクターから ?char=N で遷移してきた場合、該当タブを初期選択
  const params = new URLSearchParams(location.search);
  const requestedChar = params.get('char');
  if (requestedChar !== null) {
    const targetTab = tabs.find(t => t.dataset.index === requestedChar);
    if (targetTab) selectTab(targetTab);
  }

  makeDragScrollable(document.getElementById('storyTabs'));
}

/* ---------------------------------------------------------
   共通：診断結果の保存キー
--------------------------------------------------------- */
const MM_TYPE_RESULT_KEY = 'mmTypeResult';

/* ---------------------------------------------------------
   type.html: マダミスタイプ診断（簡易デモ）
--------------------------------------------------------- */
function setupTypeQuiz() {
  const btnStart = document.getElementById('btnStart');
  if (!btnStart) return;

  const intro = document.getElementById('quizIntro');
  const quiz = document.getElementById('quizBody');
  const result = document.getElementById('quizResult');
  const questions = Array.from(document.querySelectorAll('.quiz-question'));
  const resultLabel = document.getElementById('resultLabel');
  const btnRestart = document.getElementById('btnRestart');
  const progress = document.getElementById('quizProgress');
  const progressFill = document.getElementById('quizProgressFill');

  let qIndex = 0;
  const scores = {};

  function showQuestion(i) {
    questions.forEach((q, idx) => q.classList.toggle('is-active', idx === i));
    if (progress) progress.textContent = `${i + 1} / ${questions.length}問`;
    if (progressFill) progressFill.style.width = `${((i + 1) / questions.length) * 100}%`;
  }

  btnStart.addEventListener('click', () => {
    intro.classList.add('is-leaving');
    setTimeout(() => {
      intro.classList.add('is-hidden');
      quiz.classList.remove('is-hidden');
      requestAnimationFrame(() => quiz.classList.add('is-visible'));
      showQuestion(0);
    }, 250);
  });

  questions.forEach((q) => {
    q.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        scores[type] = (scores[type] || 0) + 1;
        qIndex += 1;

        if (qIndex < questions.length) {
          showQuestion(qIndex);
        } else {
          const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
          quiz.classList.remove('is-visible');
          setTimeout(() => {
            quiz.classList.add('is-hidden');
            result.classList.remove('is-hidden');
            resultLabel.textContent = winner;
            requestAnimationFrame(() => result.classList.add('is-visible'));
          }, 250);

          try {
            localStorage.setItem(MM_TYPE_RESULT_KEY, winner);
          } catch (e) {
            /* localStorage が使えない環境では静かに無視 */
          }
        }
      });
    });
  });

  btnRestart?.addEventListener('click', () => {
    qIndex = 0;
    Object.keys(scores).forEach(k => delete scores[k]);
    result.classList.remove('is-visible');
    setTimeout(() => {
      result.classList.add('is-hidden');
      intro.classList.remove('is-hidden', 'is-leaving');
      quiz.classList.add('is-hidden');
    }, 250);
  });
}

/* ---------------------------------------------------------
   index.html: 診断結果バッジ（type.html で保存した結果を表示）
--------------------------------------------------------- */
function setupHomeTypeResult() {
  const badge = document.getElementById('typeResultBadge');
  const label = document.getElementById('typeResultLabel');
  const ctaLabel = document.getElementById('btnDiagnosisLabel');
  if (!badge || !label) return;

  let saved = null;
  try {
    saved = localStorage.getItem(MM_TYPE_RESULT_KEY);
  } catch (e) {
    saved = null;
  }

  if (saved) {
    label.textContent = saved;
    badge.classList.remove('is-hidden');
    if (ctaLabel) ctaLabel.textContent = 'もう一度診断する';
  }
}

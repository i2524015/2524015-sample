// =========================================================
// マーダーミステリー体験サイト — script.js
// =========================================================
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---- 「もっと見る」で用語カードを追加表示 ---- */
  const btnMore = document.getElementById('btnMore');
  const hiddenCards = document.querySelectorAll('.term-card.is-hidden');
 
  if (btnMore) {
    btnMore.addEventListener('click', () => {
      hiddenCards.forEach(card => card.classList.remove('is-hidden'));
      btnMore.classList.add('is-done');
    });
  }
 
  /* ---- タイプ診断ボタン（仮のアラート／将来的にページ遷移に差し替え可） ---- */
  const btnDiagnosis = document.getElementById('btnDiagnosis');
  if (btnDiagnosis) {
    btnDiagnosis.addEventListener('click', () => {
      alert('タイプ診断ページは準備中です。近日公開！');
    });
  }
 
  /* ---- CASE FILE カルーセル ---- */
  const track = document.getElementById('casefileTrack');
  const slides = track ? Array.from(track.children) : [];
  const prevBtn = document.getElementById('casePrev');
  const nextBtn = document.getElementById('caseNext');
  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current < 0) current = 0;
 
  function renderSlide() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    track.style.transform = `translateX(-${current * 100}%)`;
  }
 
  if (track && slides.length) {
    renderSlide();
 
    nextBtn?.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      renderSlide();
    });
 
    prevBtn?.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      renderSlide();
    });
  }
 
  /* ---- ナビゲーションのスムーススクロール（フォールバック） ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
 
});

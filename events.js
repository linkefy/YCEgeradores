(() => {
 const section = document.querySelector('.events');
 if (!section) return;
 section.classList.add('events-static');
 section.querySelectorAll('video').forEach(video => {
  video.addEventListener('contextmenu', event => event.preventDefault());
 });
 section.querySelectorAll('[data-photo-carousel]').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('[data-photo-slide]')];
  const count = carousel.querySelector('.event-photo-count');
  let active = 0;
  const show = index => {
   active = (index + slides.length) % slides.length;
   slides.forEach((slide, i) => { slide.hidden = i !== active; });
   count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  };
  carousel.querySelector('.event-photo-prev').addEventListener('click', () => show(active - 1));
  carousel.querySelector('.event-photo-next').addEventListener('click', () => show(active + 1));
  carousel.addEventListener('keydown', event => {
   if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
   if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
  });
 });
})();

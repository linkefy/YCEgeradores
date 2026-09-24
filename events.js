(() => {
 const section = document.querySelector('.events');
 if (!section) return;
 section.classList.add('events-static');
 section.querySelectorAll('video').forEach(video => {
  video.addEventListener('contextmenu', event => event.preventDefault());
 });
})();

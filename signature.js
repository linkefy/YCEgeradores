/* Extend the existing repeatable section reveal without changing scroll behavior. */
(() => {
  const groups = [
    ['.service-tabs button', 90],
    ['.service-panel', 100],
    ['.showroom-stage', 100]
  ];
  groups.forEach(([selector, step]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.setAttribute('data-motion', '');
      element.style.setProperty('--delay', `${Math.min(index * step, 270)}ms`);
    });
  });
  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-20% 0px -60% 0px', threshold:0});
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
})();

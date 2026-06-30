document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = document.querySelectorAll('.legal-toc a');
  const sections = document.querySelectorAll('.legal-section');

  if (!tocLinks.length || !sections.length) return;

  const setActive = (id) => {
    tocLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  if (sections[0]) {
    setActive(sections[0].id);
  }
});

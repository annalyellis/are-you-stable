// Highlight the active nav link based on the current page
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    const current = window.location.pathname;
  
    links.forEach(link => {
      if (current.endsWith(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });
  });
  
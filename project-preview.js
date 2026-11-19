(() => {
  const dialog = document.getElementById('project-preview');
  if (typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.preview-image');
  const title = dialog.querySelector('h2');

  document.querySelectorAll('.project-image-link').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const thumb = link.querySelector('img');
      image.src = link.href;
      image.alt = thumb.alt;
      title.textContent = link.closest('article').querySelector('h3')?.textContent || thumb.alt;
      dialog.showModal();
    });
  });

  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
})();

(() => {
  const preview = document.querySelector('.lab-console');
  const link = preview.querySelector('.console-screen');
  const image = link.querySelector('img');
  const buttons = preview.querySelectorAll('[data-view]');
  const descriptions = {
    overview: 'Sentinel Desk security monitoring dashboard',
    alerts: 'Sentinel Desk alert management screen',
    email: 'Sentinel Desk email threat analysis screen'
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    const path = 'assets/sentinel/' + view + '.webp';
    image.src = path;
    image.alt = descriptions[view];
    link.href = path;
    link.setAttribute('aria-label', 'Enlarge ' + descriptions[view]);
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
})();

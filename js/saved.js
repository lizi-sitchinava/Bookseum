import { getSaved, setSaved } from './api.js';

// redirect to login if no user
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

// show username in navbar
document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

// logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  localStorage.removeItem('favoriteGenre');
  localStorage.removeItem('bio');
  window.location.href = 'login.html';
});

let savedItems = getSaved();
let activeTab = 'all';

// tab buttons
document.querySelectorAll('.shelf-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.shelf-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    renderSaved();
  });
});

function renderSaved() {
  const grid = document.getElementById('saved-grid');
  const emptyMsg = document.getElementById('saved-empty');
  grid.innerHTML = '';

  // filter by tab
  const filtered = savedItems.filter(book => {
    if (activeTab === 'read') return book.read === true;
    if (activeTab === 'unread') return book.read === false;
    return true;
  });

  if (filtered.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  // closure in forEach
  filtered.forEach(book => {
    const card = document.createElement('article');
    card.className = 'book-card';

    const img = document.createElement('img');
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    img.alt = book.title;

    const body = document.createElement('div');
    body.className = 'book-card__body';

    const title = document.createElement('p');
    title.className = 'book-card__title';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'book-card__author';
    author.textContent = book.author_name ? book.author_name[0] : 'Unknown author';

    const meta = document.createElement('p');
    meta.className = 'book-card__meta';
    const year = book.first_publish_year || 'Unknown year';
    const pages = book.number_of_pages_median ? `${book.number_of_pages_median} pages` : '';
    meta.textContent = pages ? `${year} · ${pages}` : year;

    const actions = document.createElement('div');
    actions.className = 'book-card__actions';

    // read/unread button — closure
    const readBtn = document.createElement('button');
    readBtn.className = 'book-card__read-btn' + (book.read ? ' read' : '');
    readBtn.textContent = book.read ? '✓ Read' : 'Mark as Read';

    readBtn.addEventListener('click', () => {
      const index = savedItems.findIndex(item => item.key === book.key);
      if (index !== -1) {
        savedItems[index].read = !savedItems[index].read;
        setSaved(savedItems);
        renderSaved();
      }
    });

    // remove button — closure
    const removeBtn = document.createElement('button');
    removeBtn.className = 'book-card__remove-btn';
    removeBtn.textContent = '✕ Remove';

    removeBtn.addEventListener('click', () => {
      savedItems = savedItems.filter(item => item.key !== book.key);
      setSaved(savedItems);
      renderSaved();
    });

    actions.appendChild(readBtn);
    actions.appendChild(removeBtn);
    body.appendChild(title);
    body.appendChild(author);
    body.appendChild(meta);
    body.appendChild(actions);
    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

renderSaved();
import { fetchBooks, getSaved, setSaved } from './api.js';

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


// state
let savedItems = getSaved();



// loading functions
function showLoading() {
  document.getElementById('loading-msg').hidden = false;
  document.getElementById('error-msg').hidden = true;
  document.getElementById('results-grid').innerHTML = '';
}

function hideLoading() {
  document.getElementById('loading-msg').hidden = true;
}

function showError(message) {
  hideLoading();
  const errorEl = document.getElementById('error-msg');
  errorEl.textContent = message;
  errorEl.hidden = false;
}



// create one book card
function createCard(book) {
  const isSaved = savedItems.some(item => item.key === book.key);

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

  const saveBtn = document.createElement('button');
  saveBtn.className = 'book-card__save-btn' + (isSaved ? ' saved' : '');
  saveBtn.textContent = isSaved ? '✓ Saved' : '+ Save';



  // closure - each button remembers its own book
  saveBtn.addEventListener('click', () => {
    const index = savedItems.findIndex(item => item.key === book.key);
    if (index === -1) {
      savedItems.push({ ...book, read: false });
      saveBtn.textContent = '✓ Saved';
      saveBtn.classList.add('saved');
    } else {
      savedItems.splice(index, 1);
      saveBtn.textContent = '+ Save';
      saveBtn.classList.remove('saved');
    }
    setSaved(savedItems);
  });

  actions.appendChild(saveBtn);
  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(meta);
  body.appendChild(actions);
  card.appendChild(img);
  card.appendChild(body);

  return card;
}



// render results
function renderResults(books) {
  hideLoading();
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  if (books.length === 0) {
    showError('No books found — try a different search!');
    return;
  }

  books.forEach(book => {
    const card = createCard(book);
    grid.appendChild(card);
  });
}



// search function
async function search(query, language = '') {
  showLoading();
  try {
    const books = await fetchBooks(query, language);
    renderResults(books);
  } catch (err) {
    showError('Something went wrong. Please check your connection and try again.');
  }
}



// genre buttons
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const lang = document.getElementById('lang-filter').value;
    search(btn.dataset.mood, lang);
  });
});



// search form
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  const lang = document.getElementById('lang-filter').value;
  if (!query) return;
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  search(query, lang);
});



// debounce closure - kept for potential future use but not active
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}



// search only triggers on button click or Enter — not on every keystroke
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  const lang = document.getElementById('lang-filter').value;
  if (!query) return;
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  search(query, lang);
});



// auto load favorite genre on page load
const favoriteGenre = localStorage.getItem('favoriteGenre');
if (favoriteGenre) {
  search(favoriteGenre);
}
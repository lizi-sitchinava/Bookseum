const BASE_URL = 'https://openlibrary.org';

export async function fetchBooks(query, sort = '') {
  let url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject&limit=20`;

  if (sort) {
    url += `&sort=${sort}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch books');
  const data = await response.json();
  return data.docs.filter(book => book.cover_i);
}

export function getSaved() {
  const raw = localStorage.getItem('savedBooks');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedBooks', JSON.stringify(items));
}
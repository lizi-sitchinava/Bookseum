const BASE_URL = 'https://openlibrary.org';

export async function fetchBooks(query, sort = '', offset = 0) {
  const fuzzyQuery = query.length > 4 ? `${query}~` : query;
  const limit = sort ? 100 : 20;
  let url = `${BASE_URL}/search.json?q=${encodeURIComponent(fuzzyQuery)}&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject&limit=${limit}&offset=${offset}`;

  if (sort === 'new') url += '&sort=new';
  if (sort === 'old') url += '&sort=old';
  if (sort === 'rating') url += '&sort=rating';

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch books');
  const data = await response.json();
  const withCovers = data.docs.filter(book => book.cover_i);
  return withCovers.slice(0, 20);
}

export function getSaved() {
  const raw = localStorage.getItem('savedBooks');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedBooks', JSON.stringify(items));
}
document.addEventListener('DOMContentLoaded', () => {

const isLoggedIn = !!localStorage.getItem('user');



// show user and logout on profile page asw

if (isLoggedIn) {
  const navUser = document.getElementById('nav-user');
  const logoutBtn = document.getElementById('logout-btn');

  if (navUser) navUser.textContent = localStorage.getItem('user') || '';



  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('favoriteGenre');
      localStorage.removeItem('bio');
      window.location.href = 'login.html';
    });
  }



  // show profile info card
  const profileInfo = document.getElementById('profile-info');
  profileInfo.hidden = false;



  const name = localStorage.getItem('user') || '';
  const email = localStorage.getItem('email') || '';
  const genre = localStorage.getItem('favoriteGenre') || '';
  const bio = localStorage.getItem('bio') || '';



  document.getElementById('profile-name').textContent = `⋆˚࿔ ${name} 𝜗𝜚˚⋆`;
  document.getElementById('profile-email').textContent = '✮ ' + email;
  document.getElementById('profile-genre').textContent = genre ? `✮ Favorite genre: ${genre}` : '۶۟ৎ No genre preference';
  document.getElementById('profile-bio').textContent = bio ? `✮ ${bio}` : '✮ no bio has been set!';





  // fetching user info

  document.getElementById('name-input').value = name;
  document.getElementById('email-input').value = email;
  if (!genre) document.getElementById('era-input').value = '';
  document.getElementById('bio-input').value = bio;



  // change the login page to profile page

  document.getElementById('form-title').textContent = 'Edit your profile';
  document.getElementById('form-subtitle').textContent = 'Update your information below.';
  document.getElementById('form-btn').textContent = 'Save changes →';



  // hide terms checkbox for returning users
  document.getElementById('terms-wrapper').style.display = 'none';



  // make logo a link when logged in
    const logo = document.querySelector('.nav__logo');
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.className = 'nav__logo';
    logoLink.textContent = logo.textContent;
    logo.replaceWith(logoLink);

    // mobile logout button
    const mobileLogout = document.getElementById('mobile-logout-btn');
    if (mobileLogout) {
      mobileLogout.hidden = false;
      mobileLogout.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        localStorage.removeItem('favoriteGenre');
        localStorage.removeItem('bio');
        window.location.href = 'login.html';
      });
    }
}




// form submit
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const genre = document.getElementById('era-input').value;
  const bio = document.getElementById('bio-input').value.trim();
  const terms = document.getElementById('terms-input').checked;
  const errorEl = document.getElementById('login-error');
  const successEl = document.getElementById('login-success');



  if (!name) {
    errorEl.textContent = 'Please enter your name.';
    errorEl.hidden = false;
    return;
  }



  // only check terms for first time users
  if (!isLoggedIn && !terms) {
    errorEl.textContent = 'Please agree to the terms to continue.';
    errorEl.hidden = false;
    return;
  }

  errorEl.hidden = true;

  localStorage.setItem('user', name);
  localStorage.setItem('email', email);
  localStorage.setItem('favoriteGenre', genre);
  localStorage.setItem('bio', bio);

  if (isLoggedIn) {

    // update profile info card instantly
    document.getElementById('profile-name').textContent = `⋆˚࿔ ${name} 𝜗𝜚˚⋆`;
    document.getElementById('profile-email').textContent = '✮ ' + email;
    document.getElementById('profile-genre').textContent = genre ? `✮ Favorite genre: ${genre}` : '۶۟ৎ No genre preference';
    document.getElementById('profile-bio').textContent = bio ? `✮ ${bio}` : '✮ no bio has been set!';


    successEl.hidden = false;

    setTimeout(() => { successEl.hidden = true; }, 3000);
  } else {
    window.location.href = 'index.html';
  }


});

});
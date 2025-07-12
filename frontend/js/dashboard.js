function navigateTo(page) {
  window.location.href = page;
}

// already present function – retained
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

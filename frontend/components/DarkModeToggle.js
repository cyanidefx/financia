import React, { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) document.body.className = 'dark';
  }, []);

  const toggle = () => {
    localStorage.setItem('darkMode', !darkMode);
    setDarkMode(!darkMode);
    document.body.className = !darkMode ? 'dark' : '';
  };

  return (
    <button
      onClick={toggle}
      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: darkMode ? '#333' : '#ddd', color: darkMode ? 'white' : 'black' }}
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

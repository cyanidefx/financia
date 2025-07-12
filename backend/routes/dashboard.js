const express = require('express');
const router = express.Router();

router.get('/pages', (req, res) => {
  res.json([
    { name: 'Dashboard', path: '/dashboard.html' },
    { name: 'Budgets', path: '/budgets.html' },
    { name: 'Analytics', path: '/analytics.html' },
    { name: 'Export/Import', path: '/export-import.html' }
  ]);
});

module.exports = router;

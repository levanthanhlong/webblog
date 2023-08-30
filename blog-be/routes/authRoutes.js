const express = require('express');
const router = express.Router();
const { passport } = require('../controllers/authController');

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile'],
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

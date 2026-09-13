const express = require('express');
const router = express.Router();
const {
  getPublicSettings,
  initiate,
  handleWebhook,
  verify,
  reveal,
} = require('../controllers/contactAccessController');

// All public — browsing (and paying to unlock a contact) never requires an account.
router.get('/settings',            getPublicSettings);
router.post('/initiate',           initiate);
router.post('/webhook',            handleWebhook);
router.get('/verify/:transactionId', verify);
router.get('/reveal/:hostelId',    reveal);

module.exports = router;

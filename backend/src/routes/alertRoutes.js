const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middleware/auth');

router.post('/create', auth, alertController.createAlert);
router.get('/', auth, alertController.getAlerts);

module.exports = router;

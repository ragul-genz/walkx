const express = require('express');
const { authUser, getUserProfile, updateUserProfile, updateSteps } = require('../controllers/userController');

const router = express.Router();

router.post('/auth', authUser);
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/steps', updateSteps);

module.exports = router;

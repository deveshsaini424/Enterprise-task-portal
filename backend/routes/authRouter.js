const { googleLogin, registerLocal, loginLocal } = require('../controllers/authController');

const router = require('express').Router();

router.get('/test', (req, res) => {
    res.send("test pass");
});

// Support both GET and POST for Google OAuth
router.get('/google', googleLogin);
router.post('/google', googleLogin);

router.post('/register', registerLocal);
router.post('/login', loginLocal);

module.exports = router;
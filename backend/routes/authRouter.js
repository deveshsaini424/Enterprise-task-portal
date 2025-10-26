const { googleLogin, registerLocal, loginLocal } = require('../controllers/authController');

const router = require('express').Router();

router.get('/test', (req, res) => {
    res.send("test pass");
});

router.post('/google', googleLogin);

router.post('/register', registerLocal);
router.post('/login', loginLocal);

module.exports = router;
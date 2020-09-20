const express = require('express');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('name', 'please enter your name').not().isEmpty(),
    check('password', 'please enter your password atleast with 6 characters..').not().isEmpty().isLength({
        min: 6
    }),
    check('email', 'Please enter valid email..').isEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        let { name, password, email } = req.body;

        let user = await User.findOne({ email });


        if (user) {
            res.status(400).json({
                errors: [{
                    msg: 'USer already exist...'
                }]
            })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            password,
            email,
            avatar
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err);
    }

});


module.exports = router;
const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');


router.get('/me', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            res.status(500).json({ msg: 'Profile not available for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', [auth, [
    check('status', 'Status is missing!!!!').not().isEmpty(),
    check('skills', 'Skills is missing!!!!').not().isEmpty()
]], async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(401).json({ error: error.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedIn
    } = req.body;


    const profileObj = {};
    profileObj.user = req.user.id;
    if (company) profileObj.company = company;
    if (website) profileObj.website = website;
    if (location) profileObj.location = location;
    if (bio) profileObj.bio = bio;
    if (status) profileObj.status = status;
    if (githubusername) profileObj.githubusername = githubusername;
    if (skills) {
        profileObj.skills = skills.split(',').map((val) => val.trim());
    }
    profileObj.social = {};
    if (youtube) profileObj.social.youtube = youtube;
    if (facebook) profileObj.social.facebook = facebook;
    if (twitter) profileObj.social.twitter = twitter;
    if (instagram) profileObj.social.instagram = instagram;
    if (linkedIn) profileObj.social.linkedIn = linkedIn;


    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileObj }, { new: true });
            return res.json(profile);
        }

        profile = new Profile(profileObj);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' })
    }
});

router.get('/', async(req, res)=>{
    try {
        let profiles = await Profile.find().populate('users', ['name', 'avatar']);  
        res.json(profiles);  
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
});


router.get('/user/:user_id', async(req, res)=>{
    try {
        let profile = await Profile.findOne({user: req.params.user_id}).populate('users', ['name', 'avatar']);  

        if(!profile){
            res.status(500).json({msg: 'User not avaialbe!!!!!'})
        }
        res.json(profile);  
    } catch (error) {
        console.error(error);
        if (error.kind == 'ObjectId') {
            res.status(500).json({ msg: 'User not avaialbe!!!!!' })
        }
        res.status(500).json({ msg: 'server error' });
    }
});


router.delete('/', auth, async(req, res)=>{
    try {

        // delete profiles
        await Profile.findOneAndRemove({user: req.user.id});
        
        // delete users
        await User.findOneAndRemove({_id: req.user.id});

    
        res.status(200).json({msg: 'USer deleted!!!!'});  
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'server error' });
    }
});

router.put('/experience', [auth, [
    check('title', 'Title is missing!').not().isEmpty(),
    check('company', 'Company is missing!').not().isEmpty(),
    check('from', 'From date is missing!').not().isEmpty()
]], async(req, res) => {
    const err = validationResult(req.body);

    if(!err.isEmpty()){
        res.status(500).json({error: err.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    let newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    
    try{
        const profile = await Profile.findOne({user : req.user.id});

        profile.experience.unshift(newExp);
    
        await profile.save();
        res.json(profile);
    } catch(err){
        console.error(err);

        res.json({msg: 'Server error'});

    }
});


router.put('/experience/:exp_id', auth, async(req, res) => {

    try{
        const profile = await Profile.findOne({user: req.user.id});

        let index = profile.experience.findIndex((val)=>(val._id === req.params.exp_id));
    
        profile.experience.splice(index, 1);
    
        profile.save();
        res.json(profile);
    } catch(err){
        console.error(err);
        res.status(400).json({msg: 'Server error'});
    }
});



router.put('/education', [auth, [
    check('school', 'School is missing!').not().isEmpty(),
    check('degree', 'Degree is missing!').not().isEmpty(),
    check('fieldofstudy', 'Field of study is missing!').not().isEmpty(),
    check('from', 'From date is missing!').not().isEmpty()
]], async(req, res) => {
    const err = validationResult(req.body);

    if(!err.isEmpty()){
        res.status(500).json({error: err.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    let newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };
    
    try{
        const profile = await Profile.findOne({user : req.user.id});

        profile.education.unshift(newEducation);
    
        await profile.save();
        res.json(profile);
    } catch(err){
        console.error(err);
        res.json({msg: 'Server error'});
    }
});

router.put('/experience/:exp_id', auth, async(req, res) => {

    try{
        const profile = await Profile.findOne({user: req.user.id});

        let index = profile.experience.findIndex((val)=>(val._id === req.params.exp_id));
    
        profile.experience.splice(index, 1);
    
        profile.save();
        res.json(profile);
    } catch(err){
        console.error(err);
        res.status(400).json({msg: 'Server error'});
    }
});


router.get('/github/:user_name', (req, res)=>{

    const options = {
        uri: `https://api.github.com/user/${req.params.username}/repros?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };

    request(options, (err, response, body) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'github profile not available' });
        }

        res.json(body);
    });
});



module.exports = router;
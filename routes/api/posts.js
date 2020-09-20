const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const USer = require('../../models/User');
const {check ,validationResult} = require('express-validator');
const User = require('../../models/User');

router.post('/', [auth, [
    check('text', 'Text is missing').not().isEmpty()
]],async(req, res) => {
    let errors = validationResult(req.body);

    if(!errors.isEmpty()){
        res.status(500).json({error: errors.array()});
    }

try {
    const {name, avatar} = await User.findOne({id: req.user.id}).select('-password');
    const {
        text
    } = req.body;
    const newPost = {
        text,
        name, 
        avatar,
        user: req.user.id
    };

    const post = new Post(newPost);

    await post.save();

    res.json(post);

} catch (error) {
    console.error(error);
    res.status(400).json({msg: 'Server error'});
}
});


router.get("/", auth, async(req, res)=>{
try{
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
} catch (error) {
    console.error(error);
    res.status(400).json({msg: 'Server error'});
}
});


router.get("/:post_id", auth, async (req, res) => {
    try {
        const posts = await Post.findOne({ _id: req.params.post_id });

        if (!posts) {
            res.status(500).json({ msg: 'Post not available' });
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        if (error.kind == 'ObjectId') {
            res.status(500).json({ msg: 'Post not avaialbe!!!!!' })
        }
        res.status(400).json({ msg: 'Server error' });
    }
});


router.delete("/:post_id", auth, async (req, res) => {
    try {
        const posts = await Post.findOne({ _id: req.params.post_id });

        if (!posts) {
            res.status(500).json({ msg: 'Post not available' });
        }

        if (posts.user.toString() !== req.user.id) {
            res.status(401).json({ msg: 'Not Authorised!!!!!' })
        }

        await posts.remove();
        res.json({msg: 'Post removed!!!!'});
    } catch (error) {
        console.error(error);
        if (error.kind == 'ObjectId') {
            res.status(500).json({ msg: 'Post not avaialbe!!!!!' })
        }
        res.status(400).json({ msg: 'Server error' });
    }
});

router.put("/like/post_id", auth, async(req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.psot_id});

        let index = post.likes.user.findIndex(req.user.id);
        index > 0 ? post.likes.slice(index, 1) : post.likes.push(req.user.id);
        
        await post.save();
    } catch (err) {
        
    }
});
    

module.exports = router;
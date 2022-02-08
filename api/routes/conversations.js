const router = require("express").Router();
const Conversation = require("../models/Conversation")
const { authenticateToken } = require("../helpers/auth")


router.post("/", authenticateToken, async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.recieverId],
    })
    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    }catch (err) {
        res.status(500).json(err)
    }
})

router.get("/:userId", authenticateToken, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(conversation)
    }catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;

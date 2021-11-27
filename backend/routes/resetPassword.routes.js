const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail");
const express = require("express");
const router = express.Router();

// Send email with reset link
router.post("/getResetLink", async (req, res) => {
    let user_type = req.body.user_type;
    try {
        let user;
        if(user_type === "student")
        {
            user = await Student.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).send("User with given email doesn't exist");
        }
        else if(user_type === "teacher")
        {
            user = await Teacher.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).send("User with given email doesn't exist");
        }

        let token = await Token.findOne({ user_id: user._id });
        if (!token) {
            token = await new Token({
                user_id: user._id,
                user_type: user_type
            }).save();
        }
        const link = `${process.env.BASE_URL ? process.env.BASE_URL : "http://localhost:3000"}/reset-password/${user_type}/${user._id}/${token._id}`;
        await sendEmail(user.email, link);

        res.send({success: true, data: "Password reset link sent to your email account"});
    } catch (error) {
        res.status(400).send("An error occured");
        console.log(error);
    }
});

// Reset password
router.post("/resetPassword/:userType/:userId/:token", async (req, res) => {
    try {
        const user_type = req.params.userType;
        const _id = req.params.userId;
        
        let user;
        if(user_type === "student")
        {
            user = await Student.findById(_id);
            if (!user)
                return res.status(400).send("Invalid link");
        }
        else if(user_type === "teacher")
        {
            user = await Teacher.findById(_id);
            if (!user)
                return res.status(400).send("Invalid link");
        }

        const token = await Token.findOne({
            user_id: user._id,
            user_type: user_type,
            _id: req.params.token
        });
        if (!token) return res.status(400).send("Invalid or expired link");

        user.password = req.body.password;
        await user.save();
        await Token.findByIdAndDelete(token._id)

        res.send({success: true, data: "Password reset sucessfully."});
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;
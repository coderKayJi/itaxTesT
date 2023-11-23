const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

router.post("/", async (req, res, next) => {
    try {
        let { name, email, mobile, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.signup_details.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser === null) {
            const newUser = await prisma.signup_details.create({
                data: {
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: hashedPassword,
                    role: role || 'USER',
                },
            });
            if (newUser) {
                res.status(200).json({
                    success: true,
                    error: false,
                    msg: "Signup Successful!",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                error: true,
                msg: "Emailid Already Registered!",
            });
        }
    } catch (err) {
        next(err);
    }
});


module.exports = router;

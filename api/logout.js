const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/", async (req, res, next) => {
    try {
        let { emailid } = req.body;

        const updatedUser = await prisma.signup_details.update({
            where: {
                email: emailid,
            },
            data: {
                token: null,
            },
        });
      
        res.status(200).json({
            success: true,
            error: false,
            msg: "Logout Successfully.",
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;




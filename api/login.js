const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = "M#-SEcr#T-*#Y"; // Generally saved in config.env for test purpose i am using it here

router.post("/", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const user = await prisma.signup_details.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      bcrypt.compare(password, user.password, async(err, result) => {
        if (err || !result) {
          return res.status(401).json({
            error: true,
            success: false,
            message: "Wrong Password",
          });
        } else {
          if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
            const token = jwt.sign(
              {
                userId: user.email,
                username: user.name,
                role: user.role,
              },
              secretKey
            );

            const updatedUser = await prisma.signup_details.update({
                where: {
                    email: email,
                },
                data: {
                    token: token,
                },
            });

            res.status(200).json({
              success: true,
              error: false,
              token: token,
              msg: "Login Successful",
            });
          } else {
            res.status(401).json({
              success: false,
              error: true,
              msg: "Unauthorized Access",
            });
          }
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        msg: "Email not Registered",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const userEmail = req.user.userId;

    const user = await prisma.signup_details.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        name: true,
        email: true,
        mobile: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        msg: "User not found",
      });
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        error: true,
        msg: "Unauthorized Access",
      });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      error: false,
      msg: "Details Fetched Successfully",
      data: { ...profileData },
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;

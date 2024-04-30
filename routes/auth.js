const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modals/Users");

const JWT_SECRET = "thisisintellinews";
const { body, validationResult } = require("express-validator");
//create a user using POST:"/api/auth/",does not required auth
router.post(
  "/signup",
  [
    body("name", "enter a valid username").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there is any error return error with bad request.
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    //check wheather user is already exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken: authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("some error occured");
    }
  }
);

//create login endpoint
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password should not be blanked").exists(),
  ],
  async (req, res) => {
    //if there is any error return error with bad request.
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try login with currect credentials" });
      }

      const passwordCompare = bcrypt.compare(req.body.password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try login with currect credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken: authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;

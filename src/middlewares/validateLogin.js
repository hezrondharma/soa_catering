const db = require("../models/index");
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "./uploads",
});
const jwt = require("jsonwebtoken");

const JWT_KEY = "ProjekSOA";

async function validateLogin (req,res,next) {
    let token = req.header('x-auth-token');
        if(!req.header('x-auth-token')){
            return res.status(400).send('Unauthorized. Please login first !')
        }
      
    try {
        let userdata = jwt.verify(token, JWT_KEY);
    } catch {
        return res.status(400).send('Invalid JWT Key');
    }
    next();
}

module.exports = validateLogin;
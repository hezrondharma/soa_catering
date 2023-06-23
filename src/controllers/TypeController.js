const db = require("../models/index");
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "./uploads",
});
const jwt = require("jsonwebtoken");
const { Sequelize, Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const JWT_KEY = "ProjekSOA";

module.exports = {
    getAll : async function (req,res) {
        let list = await db.MenuType.findAll();

        return res.status(200).send(list);
    },
    addNew : async function (req,res) {
        let schema = Joi.object({
            nama : Joi.string().required().label("Nama"),
        }).messages({
            "any.required" : "{{#label}} harus diisi !",
            "any.empty" : "{{#label}} harus diisi !",
        });

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let ins = await db.MenuType.create(req.body);

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 100,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(201).send({
            message : "Tipe menu baru berhasil dibuat !",
            ins,
        })
    },
};
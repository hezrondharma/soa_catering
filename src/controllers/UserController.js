const db = require("../models/index");
const multer = require("multer");
const fs = require("fs");

var storage =   multer.diskStorage({
    destination: "./uploads/public",
});

var upload = multer({ storage : storage});

const jwt = require("jsonwebtoken");
const path = require("path");
const Joi = require("joi").extend(require("@joi/date"));

const privateKey = "ProjekSOA";

const validateUsername = async (username) => {
    let user = await db.User.findOne({
        where : {
            username : username,
        }
    });

    if (user) throw new Error("Username sudah terdaftar !");
}

const validateEmail = async (email) => {
    let user = await db.User.findOne({
        where : {
            email : email,
        }
    });

    if (user) throw new Error("Email sudah terdaftar !");
}

module.exports = {
    login : async function (req,res) {
        let {username, password} = req.body;

        if (!username || !password) return res.status(400).send("Input invalid !");
        else {
            let user = await db.User.findOne({
                where : {
                    username : username
                }
            });
            if (user==null) {
                return res.status(404).send("User tidak ditemukan !");
            } else if (user.password!=password) {
                return res.status(400).send("Password salah !");
            } else {
                let token = jwt.sign({
                    username : user.username,
                    jabatan : user.id_jabatan
                }, privateKey, {expiresIn:"1h"});

                return res.status(200).send({
                    message : "Berhasil login !",
                    token : token,
                });
            }
        }
    },
    register : async function (req,res) {
        let schema = Joi.object({
            username : Joi.string().required().label("Username").external(validateUsername),
            password : Joi.string().required().label("Password"),
            email : Joi.string().required().email().label("Email").external(validateEmail),
            nama : Joi.string().label("Nama").required(),
            id_jabatan : Joi.number().valid(1,2,3).label("ID jabatan").required().messages({
                "any.only" : "ID jabatan hanya bisa 1-3 (1 : Karyawan, 2 : Chef, 3 : Manager) !",
            }),
            no_telp : Joi.number().required().label("Nomor telepon"),
        }).messages({
            "any.required" : "{{#label}} harus diisi !",
            "any.empty" : "{{#label}} harus diisi !",
        });

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let ins = await db.User.create(req.body);

        return res.status(201).send({
            message : "User berhasil register !",
            ins,
        });
    },
    uploadPhoto : async function (req,res) {
        const func = upload.single("photo");
        func(req,res, async function (err) {
            if(err) {
                res.send(err)
            }
            else {
                fs.renameSync(
                    `./uploads/public/${req.file.filename}`,
                    `./uploads/photos/${req.body.username}${path.extname(req.file.originalname)}`,
                );

                let upd = await db.User.update({
                    photo : `./uploads/photos/${req.body.username}`,
                }, {
                    where : {
                        username : req.body.username,
                    }
                });

                let user = await db.User.findOne({
                    where : {
                        username : req.body.username
                    }
                });

                return res.status(200).send({
                    message : "Foto berhasil diupload !",
                    user,
                })
            }
        })
    },
};
const db = require("../models/index");
const multer = require("multer");
const fs = require("fs");

var storage =   multer.diskStorage({
    destination: "./uploads/public",
});

var upload = multer({ storage : storage});

const jwt = require("jsonwebtoken");
const path = require("path");
const { Sequelize, Op } = require("sequelize");
const { default: axios } = require("axios");
const Joi = require("joi").extend(require("@joi/date"));

const JWT_KEY = "ProjekSOA";

const valType = async (id) => {
    let type = await db.MenuType.findByPk(id);
    if (type==null) throw new Error("Tipe menu tidak terdaftar !");
};

module.exports = {
    searchAvail : async function (req,res) {
        let query = req.query.search;

        let link = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=8d1acc3ae2c64faeb34b5c22e8978f13`;

        let find = await axios.get(link);

        return res.status(200).send(find.data.results);
    },
    addMenu : async function (req,res) {
        let schema = Joi.object({
            nama : Joi.string().required().label("Nama"),
            harga : Joi.number().required().min(1).label("Harga").messages({
                "number.min" : "Harga harus minimal 1 !",
            }),
            tipe : Joi.number().required().label("Tipe Menu").external(valType),
        }).messages({
            "any.required" : "{{#label}} harus diisi !",
            "any.empty" : "{{#label}} harus diisi !",
        }).unknown();

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let link = `https://api.spoonacular.com/recipes/complexSearch?query=${req.body.nama}&apiKey=8d1acc3ae2c64faeb34b5c22e8978f13`;
        let find = await axios.get(link);
        if (find.data.results.length==0) return res.status(404).send("Menu tidak tersedia !");

        let ins = await db.Menu.create(req.body);

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 250,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(201).send({
            message : "Menu berhasil ditambahkan !",
            ins,
        })
    },
    searchMenuKeyword : async function (req,res) {
        let search = req.query.search;

        let list = await db.Menu.findAll({
            where : {
                nama : {
                    [Op.like] : `%${search}%`
                }
            },
            paranoid : false,
            attributes : {
                exclude : [
                    'createdAt',
                    'updatedAt',
                ],
                include : [
                    [Sequelize.literal("CASE WHEN deletedAt is NULL THEN 'Tersedia' ELSE 'Tidak Tersedia' END"), 'Status']
                ],
            }
        });

        if (list.length==0) return res.status(404).send("Tidak ada menu yang cocok !");
        else {
            return res.status(200).send(list);
        }
    },
    searchMenuType : async function (req,res) {
        let type = req.params.tipe;

        let find = await db.MenuType.findByPk(type);

        if (find==null) return res.status(400).send("Tipe menu tidak terdaftar !");

        let list = await db.Menu.findAll({
            where : {
                tipe : type,
            },
            paranoid : false,
            attributes : {
                exclude : [
                    'createdAt',
                    'updatedAt',
                ],
                include : [
                    [Sequelize.literal("CASE WHEN deletedAt is NULL THEN 'Tersedia' ELSE 'Tidak Tersedia' END"), 'Status']
                ],
            }
        });

        if (list.length==0) return res.status(404).send("Tidak ada menu yang cocok !");
        
        return res.status(200).send(list)
    },
    updateMenu : async function (req,res) {
        let find = await db.Menu.findByPk(req.params.id);
        if (!find) return res.status(404).send("Menu tidak ditemukan !");

        let schema = Joi.object({
            nama : Joi.string().label("Nama"),
            harga : Joi.number().min(1).label("Harga").messages({
                "number.min" : "Harga harus minimal 1 !",
            }),
        }).messages({
            "any.required" : "{{#label}} harus diisi !",
            "any.empty" : "{{#label}} harus diisi !",
        }).unknown();

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let {nama, harga} = req.body;
        let updbody = {};
        if (nama) updbody.nama = nama;
        if (harga) updbody.harga = harga;

        let upd = await db.Menu.update(updbody,{
            where : {
                id : req.params.id,
            }
        });

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 100,
        }, {
            where : {
                username : userdata.username
            }
        });

        let menu = await db.Menu.findByPk(req.params.id);

        return res.status(200).send({
            message : "Menu berhasil diupdate !",
            menu,
        })
    },
    uploadPhoto : async function (req,res) {
        const func = upload.single("foto");
        func(req,res, async function (err) {
            if(err) {
                res.status(400).send(err)
            }
            else {
                fs.renameSync(
                    `./uploads/public/${req.file.filename}`,
                    `./uploads/menus/${req.params.id}${path.extname(req.file.originalname)}`,
                );

                let upd = await db.Menu.update({
                    foto : `./uploads/menus/${req.params.id}${path.extname(req.file.originalname)}`,
                }, {
                    where : {
                        id : req.params.id,
                    }
                });

                let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
                let use = await db.User.increment({
                    total_use : 100,
                }, {
                    where : {
                        username : userdata.username
                    }
                });

                let user = await db.Menu.findOne({
                    where : {
                        id : req.params.id
                    }
                });

                return res.status(200).send({
                    message : "Foto berhasil diupload !",
                    user,
                })
            }
        })
    },
    deleteMenu : async function (req,res) {
        let id = req.params.id;

        let menu = await db.Menu.findByPk(id);
        if (!menu) return res.status(404).send("Menu tidak ditemukan !");

        let des = await db.Menu.destroy({
            where : {
                id : id,
            }
        });

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 100,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(200).send("Menu berhasil dihapus !");
    },
    restoreMenu : async function (req,res) {
        let id = req.params.id;

        let menu = await db.Menu.findByPk(id, {
            paranoid : false,
        });
        if (!menu) return res.status(404).send("Menu tidak ditemukan !");

        let des = await db.Menu.restore({
            where : {
                id : id,
            }
        });

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 100,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(200).send("Menu berhasil dikembalikan !");
    }
}
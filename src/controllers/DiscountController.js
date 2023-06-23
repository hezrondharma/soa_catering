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
        let list = await db.Discount.findAll({
            attributes: {
                exclude : [
                  'createdAt',
                  'updatedAt',
                  'amount',
                  'expiredAt',
                ],
                include:[
                  [Sequelize.literal("CASE WHEN type = 'POTONGAN' THEN CONCAT('Rp',FORMAT(AMOUNT,0,'de_DE')) ELSE CONCAT(AMOUNT,'%') END"), 'Jumlah'],
                  [Sequelize.literal("DATE_FORMAT(expiredAt,'%d %M %Y')"), 'expiredAt'],
                ],
              },
        });

        return res.status(200).send(list);
    },
    addDiscount : async function (req,res) {
        let schema = Joi.object({
            nama : Joi.string().required().label("Nama"),
            type : Joi.string().required().valid("POTONGAN", "DISKON").label("Tipe").messages({
                "any.only" : "Tipe harus berupa potongan atau diskon !",
            }),
            amount : Joi.number().required().min(1).label("Jumlah").when('type',{
                is:'DISKON',
                then: Joi.number().max(100),
            }).messages({
                "number.min" : "Diskon harus minimal 1 !",
                "number.max" : "Diskon harus maksimal 100 !",
            }),
            expiredAt : Joi.date().format("YYYY-MM-DD").label("Tanggal Kadaluarsa").required().greater('now').messages({
                "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                "date.greater" : "{{#label}} harus lebih telat dari hari pembuatan !"
            }),
        }).messages({
            "any.required" : "{{#label}} harus diisi !",
            "any.empty" : "{{#label}} harus diisi !",
        });

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let discount = await db.Discount.create(req.body);

        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 250,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(200).send({
            message : "Diskon baru berhasil dibuat !",
            discount,
        })
    },
    updateDiscount : async function (req,res) {
        let discount = await db.Discount.findByPk(req.params.id);

        if (discount==null) return res.status(404).send("Diskon tidak ditemukan !");
        else {
            let {nama, type, amount, expiredAt} = req.body;

            if (!type) {
                if (discount.type=="DISKON" && (Number(amount)<0 || Number(amount)>100)) return res.status(404).send("Input jumlah invalid !");
                else if (discount.type=="POTONGAN" && Number(amount)<0) return res.status(404).send("Input jumlah invalid !");

                let schema = Joi.object({
                    expiredAt : Joi.date().format("YYYY-MM-DD").label("Tanggal Kadaluarsa").greater('now').messages({
                        "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                        "date.greater" : "{{#label}} harus lebih telat dari hari pembuatan !"
                    }),
                }).unknown();

                try {
                    await schema.validateAsync(req.body);
                } catch (error) {
                    return res.status(400).send(error.toString());
                }
            } else {
                let schema = Joi.object({
                    type : Joi.string().valid("POTONGAN", "DISKON").label("Tipe").messages({
                        "any.only" : "Tipe harus berupa potongan atau diskon !",
                    }),
                    amount : Joi.number().required().min(1).label("Jumlah").when('type',{
                        is:'DISKON',
                        then: Joi.number().max(100),
                    }).messages({
                        "number.min" : "Diskon harus minimal 1 !",
                        "number.max" : "Diskon harus maksimal 100 !",
                    }),
                    expiredAt : Joi.date().format("YYYY-MM-DD").label("Tanggal Kadaluarsa").greater('now').messages({
                        "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                        "date.greater" : "{{#label}} harus lebih telat dari hari pembuatan !"
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
            }

            let updbody = {};
            if (nama) updbody.nama = nama;
            if (type) updbody.type = type;
            if (amount) updbody.amount = amount;
            if (expiredAt) updbody.expiredAt = expiredAt;

            let upd = await db.Discount.update(updbody, {
                where : {
                    id : req.params.id
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

            let disc = await db.Discount.findByPk(req.params.id, {
                attributes : {
                    exclude : [
                        'createdAt',
                        'updatedAt',
                    ]
                }
            });

            return res.status(200).send({
                message : "Diskon berhasil diupdate !",
                disc,
            });
        }
    },
};
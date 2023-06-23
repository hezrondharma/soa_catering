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

const valDiskon = async (id) => {
    let discount = await db.Discount.findByPk(id);
    if (discount==null) throw new Error("Diskon tidak terdaftar !");
};

module.exports = {
    getEvents : async function (req,res) {
        let list = await db.Booking.findAll();

        return res.status(200).send(list);
    },
    addEvent : async function (req,res) {
        if (req.body.discount) {
            let schema = Joi.object({
                nama : Joi.string().required().label("Nama"),
                tempat : Joi.string().required().label("Tempat"),
                participant : Joi.number().required().min(1).label("Jumlah partisipan").messages({
                    "number.min" : "Diskon harus minimal 1 !",
                }),
                email : Joi.string().email().required().label("Email").messages({
                    "string.email" : "Email harus dalam format yang sesuai !",
                }),
                no_telp : Joi.number().required().label("Nomor Telepon"),
                date : Joi.date().format("YYYY-MM-DD").label("Tanggal Acara").required().greater('now').messages({
                    "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                    "date.greater" : "{{#label}} harus lebih telat dari hari booking !"
                }),
                discount : Joi.number().external(valDiskon),
            }).messages({
                "any.required" : "{{#label}} harus diisi !",
                "any.empty" : "{{#label}} harus diisi !",
            });
    
            try {
                await schema.validateAsync(req.body);
            } catch (error) {
                return res.status(400).send(error.toString());
            }
        } else {
            let schema = Joi.object({
                nama : Joi.string().required().label("Nama"),
                tempat : Joi.string().required().label("Tempat"),
                participant : Joi.number().required().min(1).label("Jumlah partisipan").messages({
                    "number.min" : "Diskon harus minimal 1 !",
                }),
                email : Joi.string().email().required().label("Email").messages({
                    "string.email" : "Email harus dalam format yang sesuai !",
                }),
                no_telp : Joi.number().required().label("Nomor Telepon"),
                date : Joi.date().format("YYYY-MM-DD").label("Tanggal Acara").required().greater('now').messages({
                    "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                    "date.greater" : "{{#label}} harus lebih telat dari hari booking !"
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
        }

        let {nama, tempat, participant, date, email, discount, no_telp} = req.body; 
        let cr = {};
        cr.nama = nama;
        cr.tempat = tempat;
        cr.participant = participant;
        cr.date_time = date;
        cr.email = email;
        cr.no_telp = no_telp;
        cr.id_diskon = discount;

        let ins = await db.Booking.create(cr);
        let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        let use = await db.User.increment({
            total_use : 250,
        }, {
            where : {
                username : userdata.username
            }
        });

        return res.status(200).send({
            message : "Acara berhasil dibooking !",
            ins,
        });
    },
    updateEvent : async function (req,res) {
        let id = req.params.id;

        let schema = Joi.object({
            tempat : Joi.string().label("Tempat"),
            participant : Joi.number().min(1).label("Jumlah partisipan").messages({
                "number.min" : "Diskon harus minimal 1 !",
            }),
            email : Joi.string().email().label("Email").messages({
                "string.email" : "Email harus dalam format yang sesuai !",
            }),
            no_telp : Joi.number().label("Nomor Telepon"),
            date : Joi.date().format("YYYY-MM-DD").label("Tanggal Acara").greater('now').messages({
                "date.format" : "Format tanggal harus dalam YYYY-MM-DD !",
                "date.greater" : "{{#label}} harus lebih telat dari hari booking !"
            }),
            discount : Joi.number().external(valDiskon),
        }).messages({
            "any.empty" : "{{#label}} harus diisi !",
        }).unknown();

        try {
            await schema.validateAsync(req.body);
        } catch (error) {
            return res.status(400).send(error.toString());
        }

        let {tempat, participant, date, email, discount, no_telp} = req.body; 
        let cr = {};
        cr.tempat = tempat;
        cr.participant = participant;
        cr.date_time = date;
        cr.email = email;
        cr.no_telp = no_telp;
        if (discount!=null) cr.id_diskon = discount;

        let ins = await db.Booking.update(cr, {
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

        let event = await db.Booking.findByPk(id);

        return res.status(200).send({
            message : "Acara berhasil dibooking !",
            event,
        });
    },
    addMenuOrders : async function (req,res) {
        let orders = req.body.orders;
        let event_id = req.body.event;
        let jumlah = req.body.jumlah;

        let e = await db.Booking.findByPk(event_id);
        if (!e) return res.status(404).send("Event tidak terdaftar !");

        let list = orders.split(",");
        let nums = jumlah.split(",");

        if (list.length!=nums.length) return res.status(400).send("Jumlah menu dengan jumlah order tidak cocok !");

        for (let i = 0; i < list.length; i++) {
            const id = list[i];
            let m = await db.Menu.findByPk(id);
            if (!m) return res.status(404).send("Menu tidak terdaftar !");
        }

        for (let i = 0; i < list.length; i++) {
            const menuid = list[i];
            
            let ins = await db.BookingMenu.create({
                booking_id: event_id,
                menu_id: menuid,
                jumlah : nums[i],
            });

            let userdata = jwt.verify(req.header("x-auth-token"), JWT_KEY);
            let use = await db.User.increment({
                total_use : 50,
            }, {
                where : {
                    username : userdata.username
                }
            });
        }

        let event = await db.Booking.findByPk(event_id);
        let listmenu = [];
        for (let i = 0; i < list.length; i++) {
            const menuid = list[i];
            
            let m = await db.Menu.findByPk(menuid);
            listmenu.push({
                nama : m.nama,
                harga : m.harga,
                jumlah : m.jumlah,
            });
        }

        return res.status(200).send({
            message : "Berhasil menambahkan order !",
            event : event.nama,
            listmenu,
        })
    },
    getOrdersInEvent : async function (req,res) {
        let list = await db.BookingMenu.findAll({
            where : {
                booking_id : req.params.event_id,
            }
        });

        if (list.length==0) return res.status(404).send("Belum ada menu yang terdaftar !");

        let daftar = [];
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            const bookings = list[i];
            
            let menu = await db.Menu.findByPk(bookings.menu_id);
            daftar.push({
                nama : menu.nama,
                harga : menu.harga,
                jumlah : bookings.jumlah,
            });
            sum += (menu.harga*bookings.jumlah);
        }

        let event = await db.Booking.findByPk(req.params.event_id);
        let clean = 0;
        let dis = 0;
        let perc = '';
        let pot = 0;
        if (event.id_diskon!=null) {
            let disc = await db.Discount.findByPk(event.id_diskon);
            if (disc.type=="DISKON") {
                dis = 1;
                perc = `${disc.amount}%`;
                clean = sum*(100-disc.amount)/100;
            } else {
                dis = 2;
                pot = disc.amount;
                clean = sum-disc.amount;
            }
        }

        return res.status(200).send({
            acara : event.nama,
            pesanan : daftar,
            harga_total : sum,
            "diskon/potongan" : (dis==0 ? 0 : (dis==1 ? perc : pot)),
            harga_akhir : (clean==0 ? sum : clean),
        });
    },
    deleteBooking : async function (req,res) {
        let event_id = req.params.event_id;
        let event = await db.Booking.findByPk(event_id);

        if (!event) return res.status(404).send("Acara tidak ditemukan !");

        let des1 = await db.BookingMenu.destroy({
            where : {
                booking_id : event_id
            }
        });

        let des2 = await db.Booking.destroy({
            where : {
                id : event_id,
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

        return res.status(200).send("Acara berhasil dibatalkan !");
    },
};
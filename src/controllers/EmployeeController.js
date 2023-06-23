const db = require("../models/index");
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "./uploads",
});
const jwt = require("jsonwebtoken");
const { Sequelize, Op } = require("sequelize");

const JWT_KEY = "ProjekSOA";

module.exports = {
    getAll : async function (req,res) {
        const users = await db.User.findAll({
          raw : true,
          paranoid : false,
          attributes: {
            exclude : [
              'id_jabatan',
              'id',
              'password',
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
            include:[
              [Sequelize.col('Jabatan.nama'), 'Jabatan'],
              [Sequelize.literal("CASE WHEN deletedAt is NULL THEN 'Active' ELSE 'Inactive' END"), 'Status']
            ],
          },
          include : [
            {
                model: db.Jabatan,
                attributes : [],
            }
          ]
        });
        return res.status(200).send(users);
    },
    searchKaryawan : async function (req,res) {
      let {username, nama} = req.query;
      let updbody = {};
      if (username) updbody.username = {
        [Op.like] : `%${username}%`,
      };
      if (nama) updbody.nama = {
        [Op.like] : `%${nama}%`,
      };;

      const users = await db.User.findAll({
        where : updbody,
        raw : true,
        paranoid : false,
        attributes: {
          exclude : [
            'id_jabatan',
            'id',
            'password',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
          include:[
            [Sequelize.col('Jabatan.nama'), 'Jabatan'],
            [Sequelize.literal("CASE WHEN deletedAt is NULL THEN 'Active' ELSE 'Inactive' END"), 'Status']
          ],
        },
        include : [
          {
              model: db.Jabatan,
              attributes : [],
          }
        ]
      });
      
      if (users.length==0) return res.status(404).send("User tidak ditemukan !");
      return res.status(200).send(users);
    },
    updateKaryawan : async function (req,res) {  
        let {username, email, nama, no_telp} = req.body;
        if (!username) return res.status(400).send("Username tidak ada !");

        let updbody = {};
        if (email) updbody.email = email;
        if (nama) updbody.nama = nama;
        if (no_telp) updbody.no_telp = no_telp;

        let upd = db.User.update(updbody, {
          where : {
            username : username
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

        return res.status(200).send("User berhasil diupdate !");
    },

    deleteKaryawan : async function (req,res) {
      let {username} = req.body;
      if (!username) return res.status(400).send("Username tidak ada !");

      let del =  db.User.destroy({
        where : {
          username : username
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

      return res.status(200).send(`User ${username} berhasil dihapus !`);
    }
};

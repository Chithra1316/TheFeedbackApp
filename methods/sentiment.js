const Promise = require('bluebird');
var models = require('../models');
var Sequelize = require('sequelize');
var methods = require('../methods');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.json')[env];
var sequelize ={};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var sentiment = {};

sentiment.insert = (info) => {
    return new Promise((resolve,reject)=>{
    models.sentiment.create(info).then((results) =>{
        console.log(results)
        resolve(results)
    })
    .catch((err) =>{
        console.log(err)
        reject(err)
    })
    }
)
}
sentiment.getAll = () =>{
    return new Promise((resolve, reject)=>{
        sequelize.query('SELECT feedback FROM Sentiments;').then((results) =>{
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
            reject(err)
        })
    })
}
sentiment.getCount = () =>{
    return new Promise((resolve, reject)=>{
        sequelize.query('SELECT COUNT(id) AS C FROM Sentiments',{type:sequelize.Querytypes.SELECT}).then((results) =>{
            console.log(results)
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
            reject(err)
        })
    })

}
module.exports = sentiment;
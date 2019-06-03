const Promise = require('bluebird');
var models = require('../models');
var Sequelize = require('sequelize');
var methods = require('.');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.json')[env];
var sequelize ={};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var feed = {};

feed.insert = (info) => {
    return new Promise((resolve,reject)=>{
    models.feed.create(info).then((results) =>{
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
feed.getAll = () =>{
    return new Promise((resolve, reject)=>{
        sequelize.query('SELECT value FROM Feed;').then((results) =>{
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
            reject(err)
        })
    })
}

feed.getFeedsPos = () =>{
    return new Promise((resolve,reject) =>{
        sequelize.query('SELECT S.feedback FROM Sentiments AS S, Feeds AS F WHERE S.id=F.id AND F.value=1;').then((results) =>{
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
        })
    })
}
feed.getFeedsNeg = () =>{
    return new Promise((resolve,reject) =>{
        sequelize.query('SELECT S.feedback FROM Sentiments AS S, Feeds AS F WHERE S.id=F.id AND F.value=0;').then((results) =>{
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
        })
    })
}
feed.getCount = () =>{
    return new Promise((resolve, reject)=>{
        sequelize.query('SELECT COUNT(id) AS C FROM Feed;',{type:sequelize.Querytypes.SELECT}).then((results) =>{
            console.log(results)
            resolve(results)
        })
        .catch((err) =>{
            console.log(err)
            reject(err)
        })
    })

}
feed.drop = () =>{
    return new Promise((resolve, reject) =>{
        models.feed.destroy( {
            
            where: {
          },
          truncate: true /* this will ignore where and truncate the table instead */
       } ).then((res) =>{
            console.log('destroyed')
            var op = "destroyed";
            resolve(op)
        })
        .catch((err) =>{
            console.log(err)
        })
    })
}
module.exports = feed;
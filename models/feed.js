
'use strict';

const bcrypt =  require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var Feed = sequelize.define('Feed', {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type : DataTypes.INTEGER,
    },
 
  });



  return Feed;
}


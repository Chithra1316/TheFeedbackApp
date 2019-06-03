
'use strict';

const bcrypt =  require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var Sentiment = sequelize.define('Sentiment', {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    feedback: {
      type : DataTypes.STRING,
    },
 
  });



  return Sentiment;
}


var mongoose = require('mongoose');

// Config details based on env
var config = require('config');
var dbConfig = config.get('database.dbConfig');

// Create master database connection URL
//var masterDbURL = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName;
var masterDbURL =  'mongodb://rajiv:rajiv*123@ds143608.mlab.com:43608/heroku_5d789bdf'
module.exports = masterDB = mongoose.createConnection(masterDbURL);

masterDB.on('error', console.error.bind(console, 'connection error:'));

masterDB.on('connected', function() {  
  console.log('Mongoose connected to master one.');
});
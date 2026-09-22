const mongodb = require('mongodb');

const dbClient = mongodb.MongoClient;

let _db;
const URL = "mongodb+srv://samsomesh2o2o_db_user:QZHnwKc4cEPdQ98j@cluster-1.de1mykq.mongodb.net/?appName=Cluster-1";

const mongoCon = (callback) => {
  dbClient.connect(URL)
  .then(client => {
    console.log('connected to MongoDB')
    _db = client.db('airbnb');
    callback();
  }).catch((err) => {
    console.log("error connecting to mongo");
    console.log(err);
    
  });
};


const getDb = () => {
  if(!_db) {
    throw new Error("Mongo not connected!");
  }
  return _db;
}


exports.getDb = getDb;
exports.mongoCon = mongoCon;

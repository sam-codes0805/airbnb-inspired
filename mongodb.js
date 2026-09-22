const mongodb = require('mongodb');

const dbClient = mongodb.MongoClient;

let _db;

const mongoCon = (callback) => {
  const URL = process.env.MONGO_URL;
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

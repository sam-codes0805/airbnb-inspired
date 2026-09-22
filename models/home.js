const { ObjectId } = require("mongodb");
const { getDb } = require("../mongodb");



module.exports = class Home {
  constructor(housename, price, location, rating, photourl, _id) {
    // this._id = Math.floor(Math.random() * 10000);
    this.housename = housename;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photourl = photourl;
    if(_id) {
      this._id = _id;
    }
  }

  save() {
    const db = getDb();
    return db.collection('homes').insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('homes').find().toArray();
  }

  static fetchById(_id) {
    const db = getDb();
    return db.collection('homes')
    .find({_id: new ObjectId(String(_id))})
    .next();
  }

  static remHome (_id) {
    console.log(_id);
    const db = getDb();
    return db.collection('homes').
    deleteOne({_id: new ObjectId(String(_id))});
  }

  static editDetail (editedHome) {
    const db = getDb();

    console.log(editedHome);
    const updatedHome = { 
      housename: editedHome.housename,
      price: editedHome.price,
      location: editedHome.location,
      rating: editedHome.rating,
      photourl: editedHome.photourl
    }

    return db.collection('homes').updateOne({_id: new ObjectId(String(editedHome._id))}, { $set: updatedHome});
  }
}
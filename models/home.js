const mongoose = require('mongoose');
const Fav = require('./Fav');

const homeSchema = new mongoose.Schema({
    housename: {
        type: String, 
        required: true
    }, 
    price: {
        type: Number, 
        required: true
    }, 
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    photourl: {
        type: String,
        required: true
    }
});

homeSchema.pre('findOneAndDelete', async function() {
    const homeId = this.getQuery()._id;
    await Fav.deleteMany({homeId: homeId});
    console.log('performing prehook instructions')
})

module.exports = mongoose.model('Home', homeSchema);


/* 


*
this.housename = housename;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photourl = photourl;
    if(_id) {
      this._id = _id;
    }
*
    save()
* 
    static fetchAll()
* 
    static findById(_id)
* 
    static remHome (_id)
* 
    static editDetail (editedHome)
*

  **  const { getDb } = require("../mongodb");

*


*/
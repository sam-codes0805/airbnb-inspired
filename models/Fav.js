const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('fav', favSchema);

/*
* static fetchFav ()
* 
* 
* static addFav (favHome_id)
* 
* 
* static getFavs (callback)
* 
* 
* static remFav (_id)
*/
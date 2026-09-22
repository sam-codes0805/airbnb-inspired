const { getDb } = require("../mongodb")
const Home = require('./home');

module.exports = class FavouriteHomes{

    static fetchFav (){
    const db = getDb();
    return db.collection('favHomeIds').find().toArray();
  }

  static addFav (favHome_id) {
    const db = getDb();
    // console.log(favHome_id + "\t is added");
    this.fetchFav().then(data => {
      if(data.find(ids => ids.homeId === favHome_id)){
        console.log('home already added to favourite');
      }else {
        return db.collection('favHomeIds').insertOne({homeId: favHome_id});
      }
    })
  }

  static getFavs (callback) {
    this.fetchFav().then(ids => {
      const favIds = ids.map(favI => favI.homeId);
      // console.log(favIds);
      Home.fetchAll().then(homes => {
        const FavHomes = homes.filter((home) => favIds.includes(String(home._id)));
        // console.log(FavHomes);
        callback(FavHomes);
      })
    })
  }

  static remFav (_id) {
    const db = getDb();
    return db.collection('favHomeIds').deleteOne({homeId: _id});
  }
}
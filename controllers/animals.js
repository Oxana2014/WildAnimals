const Animal = require('../models/animal');
const User = require('../models/user');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const addition = require('../models/addition');
const Feedback = require('../models/feedback');
const ExpressError = require('../utils/ExpressError');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});


module.exports.index = async (req, res) =>  {
    const animals = await Animal.find({moderate: {$ne:"new"}});
    res.render('animals/index', {animals});
}

module.exports.renderNewForm = (req, res) => {
    req.session.returnTo = req.originalUrl;
    res.render('animals/new');
}

module.exports.renderModeratorPage = async (req, res) => {
 const numUsers = await User.count();
    const newAnimals = await Animal.find({moderate:"new"});
   const newAdditions = await addition.find({moderate: "new"});
   const newFeedbacks = await Feedback.find({moderate:"new"});
   const usefulFeedbacks = await Feedback.find({moderate:"useful"});
    res.render("animals/moderator", {newAnimals, newAdditions, numUsers, newFeedbacks, usefulFeedbacks});
}

module.exports.createAnimal = async (req, res, next) => {
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.animal.location,
    //     limit: 1
    // }).send();
    req.session.returnTo = req.originalUrl;

    if( req.files.length > 4) {
        throw new ExpressError("Количество загружаемых изображений не более 4", 400)
    }
 
    const animal = new Animal(req.body.animal);
    animal.geometry = { "type" : "Point", "coordinates" : [ 0, 0 ] };
    // if (!geoData.body.features.length) {
    //     animal.geometry = { "type" : "Point", "coordinates" : [ 0, 0 ] };
    // } else {
    //     animal.geometry = geoData.body.features[0].geometry;
    // }

    animal.images = req.files.map(f => ({url: f.path, filename: f.filename}));
 
    animal.author = req.user._id;
     await animal.save();
    //  console.log(animal);
     req.flash('success', 'Новый вид будет добавлен в базу после проверки модератором (обычно на следующий день)')
     res.redirect(`/animals`);
 }

 module.exports.showAnimal = async (req, res) => { 
      const animal = await Animal.findById(req.params.id).populate({
          path: 'additions',
          populate: {
              path: "author"
          }
      }).populate('author')
   // console.log(animal)
      if(!animal) {
        req.flash('error', 'Cannot find this animal');
        return res.redirect('/animals');
    }
    req.session.returnTo = req.originalUrl;
      res.render('animals/show', {animal});
  }

  module.exports.renderEditForm = async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal) {
        req.flash('error', "Животное не найдено!");
        return res.redirect('/animals');
    }
    res.render('animals/edit', {animal});
}

module.exports.updateAnimal = async (req, res) => {
    const {id} = req.params;
  
   const geoData = await geocoder.forwardGeocode({
        query: req.body.animal.location,
        limit: 1
    }).send();
    
    const animal = await Animal.findById(id);
    if (!animal) {
        req.flash("error", "Животное не найдено!");
        return res.redirect('/animals');
    }
const a = await Animal.findByIdAndUpdate(id, {...req.body.animal});
   if (!geoData.body.features.length) {
        a.geometry = { "type" : "Point", "coordinates" : [ 0, 0 ] };
    } else {
        a.geometry = geoData.body.features[0].geometry;
    }
  
 
const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
a.images.push(...imgs );
await a.save();
if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await a.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})  
}

if(req.body.verticalImages) {
    for(let url of req.body.verticalImages) {
        console.log("vertical: ",url);
        a.images.map((image) => {
            if(image.url === url) {
              //  image.url = image.url.replace('/upload', '/upload/w_700,h_500,c_pad,b_white');
          image.vertical = true;
              console.log("changed")
            }
        })    
    }
}
a.moderate = "ready";
await a.save();
req.flash('success', 'Информация успешно обновлена!')
    res.redirect(`/animals/${a._id}`);
}

module.exports.renderAvatarForm = async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal) {
        req.flash('error', "Животное не найдено!");
        return res.redirect('/animals');
    }
    res.render('animals/avatar', {animal});
}

module.exports.addAvatar = async (req, res) => {
    const {id} = req.params;
    const animal = await Animal.findById(id);
    if(!animal) {
        req.flash('error', "Животное не найдено!");
        return res.redirect('/animals');
    }
    const avatar = {url:req.file.path,filename: req.file.filename};
   
animal.avatar = avatar;
await animal.save();
    res.redirect("/animals");
}

module.exports.deleteAnimal = async (req, res) => {
    const {id} = req.params;
    await Animal.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted animal')
    res.redirect('/animals');
}


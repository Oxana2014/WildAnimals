const { animalSchema, additionSchema, feedbackSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const multer  = require('multer');
const {storage} = require('./cloudinary');
const upload = multer({ storage })
const upload4 =  upload.array('image', 4);

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Сначала вам нужно войти как пользователь");
    return res.redirect("/login");
  }
  next();
};

module.exports.catchUpload4 = function(req, res, next){
  upload4(req, res, function (err) {
       if (err) {
        next(new ExpressError("Можно добавить не больше 4 фото", 400));
       }
      next(); 
  })} 

module.exports.validateAnimal = (req, res, next) => {
  // console.log(req.body)
  const { error } = animalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isModerator = async (req, res, next) => {
  // const animal = await Animal.findById(id);
  console.log(req.user);
  if (!req.user || req.user.role !== "moderator") {
    req.flash("error", "У вас нет разрешения на это");
    return res.redirect(`/animals`);
  }
  next();
};

module.exports.setModeratorRole = async (req, res, next) => {
  const moderator = await User.findOne({ username: "bill" });
  moderator.role = "moderator";
  await moderator.save();
  next();
};

module.exports.validateAddition = (req, res, next) => {
  const { error } = additionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateFeedback = (req, res, next) => {
  const { error } = feedbackSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

 if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
 }

const express = require("express");
const mongoose = require("mongoose");
const methodOvarride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const News = require('./models/news');
const animalsRouter = require('./routes/animals')
const additionsRouter = require('./routes/additions')
const usersRouter = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/wild-animals';

const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const app = express();
const path = require('path');
const { date } = require("joi");

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOvarride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith: '_',
  }))

  const secret = process.env.SECRET || "4G_class";

const options = {
          mongoUrl: dbUrl,
           secret,
          touchAfter: 24*3600
      }
     const store = MongoStore.create(options);

  store.on('error', function(e) {
      console.log("SESSION STORE ERROR: ", e);
  })

const sessionConfig = {
    store,
    name: "_lacos",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24* 7,
        maxAge: 1000 * 60 * 60 * 24* 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/', usersRouter);
app.use('/animals', animalsRouter);
app.use('/animals/:id/additions', additionsRouter);


app.get('/', async (req, res) =>  {
    const news = await News.find();
    res.render('home', {news});
})




app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
 
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render('error', {err});
})
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}!`);
})
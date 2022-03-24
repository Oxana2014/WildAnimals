const User = require('../models/user');
const Feedback = require('../models/feedback')
const News = require('../models/news');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
     const {email, username, password} = req.body;

     const user = new User({email, username});

    const registeredUser = await User.register(user, password);
     req.login(registeredUser, err => {
         if(err) return  next(err);
         req.flash('success', `Добро пожаловать, ${user.username}! `);
    res.redirect('/animals');
     }) 
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    } 
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Привет, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/animals';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Заходи ещё!')
    res.redirect('/animals')
}

module.exports.writeUsForm = (req, res) => {
    res.render('users/writeUs')
}

module.exports.createFeedback = async (req, res) => {
const feedback = new Feedback(req.body.feedback);
await feedback.save();
    //  console.log(feedback);
     const {username} = feedback;
     req.flash('success', `Спасибо за обратную связь, ${username}! `)
     res.redirect(`/animals`);

}

module.exports.feedbackUseful = async (req, res, next) => {
    const {id} = req.params;
    const f = await Feedback.findById(id);
   f.moderate = "useful";
   await f.save();
   res.redirect(`/animals/moderate`);
}

module.exports.feedbackOld = async (req, res) => {
    const {id} = req.params;
    const f = await Feedback.findById(id);
   f.moderate = "old";
   await f.save();
   res.redirect(`/animals/moderate`);
}

module.exports.createNews = async (req, res) => {
    const news = new News(req.body.news);
    await news.save();
         console.log(news.created);
        
         req.flash('success', "Good job, Moderator!")
         res.redirect(`/`);
}
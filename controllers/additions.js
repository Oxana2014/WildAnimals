const Animal = require('../models/animal');
const Addition = require('../models/addition');
const ExpressError = require('../utils/ExpressError');
const {cloudinary} = require('../cloudinary');

module.exports.createAddition = async(req, res) => {
    if( req.files.length > 4) {
        throw new ExpressError("Количество загружаемых изображений не более 4", 400)
    }
    const animal = await Animal.findById(req.params.id);
    const addition = new Addition(req.body.addition);
    addition.animal = animal._id;
    addition.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    addition.author = req.user._id;
    console.log(addition)
    animal.additions.push(addition);
    await addition.save();
    await animal.save();
    req.flash('success', 'Добавление будет опубликовано после проверки модератором (обычно на следующий день).')
        res.redirect(`/animals/${animal._id}`)
    }

    module.exports.deleteAddition = async (req, res, next) => {
        const {id, additionId} = req.params;
        await Animal.findByIdAndUpdate(id, {$pull: {additions: additionId}})
         await Addition.findByIdAndDelete(additionId);
         req.flash('success', 'Successfully deleted addition')
         res.redirect(`/animals/${id}`)
     }

     module.exports.editAdditionForm = async (req, res) => {
        const {id, additionId} = req.params;
        console.log('params: ', req.params)

         const animal = await Animal.findById(id).populate({
             path: 'additions',
             populate: {
                 path: "author"
             }
         }).populate('author');
         if(!animal) {
             req.flash('error', 'Cannot find this animal');
             return res.redirect('/animals');
         }
         const addition = await Addition.findById(additionId).populate('author');
         if(!addition) {
            req.flash('error', 'Cannot find this addition');
            return res.redirect('/animals');
        }
         req.session.returnTo = req.originalUrl;
           res.render('animals/editAddition', {animal, addition});
     
    }

    module.exports.updateAddition = async (req, res) => {
        const {id, additionId} = req.params;
        const addition = await Addition.findById(additionId);
        if (!addition) {
            req.flash("error", "Дополнение не найдено!");
            return res.redirect(`/animals/`);
        }
        const a = await Addition.findByIdAndUpdate(additionId, {...req.body.addition});
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
            res.redirect(`/animals/${id}`);
    }
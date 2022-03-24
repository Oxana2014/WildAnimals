const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const animalController = require('../controllers/animals');
const Animal = require('../models/animal');
const {isLoggedIn, isModerator, validateAnimal, setModeratorRole, catchUpload4} = require('../middleware');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const { set } = require('mongoose');

const upload = multer({  storage  });


router.get('/',  catchAsync(animalController.index))
router.get('/new', isLoggedIn, animalController.renderNewForm);
router.get('/moderate', isModerator, animalController.renderModeratorPage);

router.get('/:id', catchAsync(animalController.showAnimal))

 router.post('/', isLoggedIn, catchUpload4
    , validateAnimal, catchAsync( animalController.createAnimal))
// router.post('/', upload.array('image'), (req, res) => {
//    console.log(req.body, req.files);
//      res.send("IT WORKED")
// })

router.get('/:id/edit', isLoggedIn, isModerator, catchAsync(animalController.renderEditForm ))
router.get('/:id/avatar', isLoggedIn, isModerator, catchAsync(animalController.renderAvatarForm ))
// router.put('/:id', isModerator,upload.array('image'),  validateAnimal, catchAsync(animalController.updateAnimal))
 router.put('/:id', isModerator, catchUpload4,  validateAnimal, catchAsync(animalController.updateAnimal))
 router.patch('/:id', isModerator, upload.single('avatar'),  catchAsync(animalController.addAvatar))
router.delete('/:id', isLoggedIn, isModerator, catchAsync(animalController.deleteAnimal))

module.exports = router;
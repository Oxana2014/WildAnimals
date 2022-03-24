const express = require("express");
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal');
const Addition = require('../models/addition');
const catchAsync = require('../utils/catchAsync');
const {validateAddition, isLoggedIn, isModerator,catchUpload4 } = require('../middleware');
const additionController = require('../controllers/additions');

router.post('/',catchUpload4, validateAddition,  catchAsync(additionController.createAddition))
// router.post('/', upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It Worked!")
// })
    
router.get('/:additionId/editAddition', isModerator, catchAsync(additionController.editAdditionForm)
)
router.put('/:additionId', isModerator,  validateAddition, catchAsync(additionController.updateAddition))

    router.delete('/:additionId', isLoggedIn, isModerator, catchAsync(additionController.deleteAddition ))

    module.exports = router;
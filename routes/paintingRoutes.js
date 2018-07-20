const express = require('express');
const router = express.Router();
const Painting = require('../models/paintings');
const ensureLogin = require('connect-ensure-login');
const uploadCloud = require('../config/cloudinary');



router.get('/paintings', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // if(!req.session.currentUser){
  //     res.redirect('/login');
  //     return;
  // } // this way you can use to make ONE SINGLE ROUTE private but oyu have to do it in every route that you want to restrict
  Painting.find()
    .then((listOfPaintings) => {
      // console.log(listOfPaintings);
      res.render('paintings/paintings', {
        listOfPaintings
      });
    })
    .catch((err) => {
      next(err);
    })
});


router.get('/painting/new', (req, res, next) => {

  res.render('paintings/newPainting');
});



router.post('/paintings/create', uploadCloud.single('photo'), (req, res, next) => {
  let price = req.body.buyPrice;
  const longterm = req.body.longTerm;

  console.log('longterm: ', longterm)


  const newPainting = new Painting({
    title: req.body.title,
    artist: req.body.artist,
    description: req.body.description,
    buyPrice: req.body.buyPrice,
    longtermLease: req.body.longTerm,
    imgPath: req.file.url,
  })

  if (longterm === 'true') {
    newPainting.monthlyPrice = ((price * 0.15) / 12).toFixed(2);
  } else {
    newPainting.monthlyPrice = ((price * .2) / 12).toFixed(2);
  }


  newPainting.save()
    .then((newPaint) => {
      //  console.log(' - - - - - - - -: ', newPaint)
      res.redirect('/paintings')
    })
    .catch((err) => {
      next(err);
    })

})

router.get('/paintings/:id/edit', (req, res, next) => {
  Painting.findById(req.params.id)
    .then((thePainting) => {

      res.render('paintings/editPaintings', {
        thePainting: thePainting
      })
    })

    .catch((err) => {
      next(err)
    })
})


router.post('/paintings/:id/update', uploadCloud.single('photo'), (req, res, next) => {
  let price = req.body.buyPrice;
  const longterm = req.body.longTerm;

  Painting.findById(req.params.id)
    .then((thePainting) => {

      thePainting.title = req.body.title;
      thePainting.artist = req.body.artist;
      thePainting.description = req.body.description;
      thePainting.buyPrice = req.body.buyPrice;
      thePainting.longtermLease = req.body.longTerm;
      thePainting.imgPath = req.file.url;


      if (longterm === 'true') {
        thePainting.monthlyPrice = ((price * 0.15) / 12).toFixed(2);
      } else {
        thePainting.monthlyPrice = ((price * .2) / 12).toFixed(2);
      }

      thePainting.save()
        .then((thePainting) => {
          res.redirect('/paintings/' + thePainting._id)
        })
        .catch((err) => {
          next(err);
        })


    })
})

router.post('/paintings/:id/delete', (req, res, next) => {
  Painting.findByIdAndRemove(req.params.id)
    .then((reponse) => {
      res.redirect('/paintings');
    })
    .catch((err) => {
      next(err);
    })
})


router.get('/paintings/:id', (req, res, next) => {
  const id = req.params.id;
  Painting.findById(id)
    .then((thePainting) => {
      res.render('paintings/paintingDetails', {
        thePainting: thePainting
      });
    })
    .catch((err) => {
      next(err);
    })
});






module.exports = router;
const express     = require('express');
const router      = express.Router();
const Painting    = require('../models/paintings');
const ensureLogin = require('connect-ensure-login');



router.get('/paintings', ensureLogin.ensureLoggedIn() ,(req, res, next) => {
    // if(!req.session.currentUser){
    //     res.redirect('/login');
    //     return;
    // } // this way you can use to make ONE SINGLE ROUTE private but oyu have to do it in every route that you want to restrict
    Painting.find()
    .then((listOfPaintings)=>{
      console.log(listOfPaintings);
        res.render('paintings', {listOfPaintings});
    })
    .catch((err)=>{
        next(err); 
     })
});


router.get('/painting/new', (req, res, next) =>{

        res.render('newPainting');
});



router.post('/paintings/create', (req, res, next)=>{
  const price = req.body.buyPrice;
  const longtermLease = req.body.longTerm;

  if(longtermLease === true){
    const monthlyPrice = price * .15 / 12
  } else {
    const monthlyPrice = price * .18 / 12
  }

   const newPainting = new Painting({
    title: req.body.title,
    artist: req.body.artist,
    description: req.body.description,
    buyPrice: req.body.buyPrice,
    longtermLease: req.body.longTerm,
    monthlyPrice: req.body.monthlyPrice,
   })


   newPainting.save()
   .then((response)=>{
       res.redirect('/paintings')
   })
   .catch((err)=>{
       next(err);
   }) 

})

router.get('/paintings/:id/edit', (req, res, next)=>{
   Painting.findById(req.params.id)
   .then((thePainting)=>{
          
     res.render('editPaintings', {thePainting: thePainting})
    })
        
        .catch((err)=>{
            next(err)
        })
})


router.post('/paintings/:id/update', (req, res, next)=>{
    Painting.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      artist: req.body.artist,
      description: req.body.description,
      buyPrice: req.body.buyPrice,
    })
    .then((thePainting)=>{
        res.redirect('/paintings/'+thePainting._id)
    })
    .catch((err)=>{
        next(err);
    })  
})

router.post('/paintings/:id/delete', (req, res, next)=>{
    Painting.findByIdAndRemove(req.params.id)
    .then((reponse)=>{
        res.redirect('/paintings');
    })
    .catch((err)=>{
        next(err);
    })
})


router.get('/paintings/:id', (req, res, next) => {
    const id = req.params.id;
    Painting.findById(id)
    .then((thePainting)=>{    
        res.render('paintingDetails',  {thePainting: thePainting});
    })
    .catch((err)=>{
       next(err); 
    })
});






module.exports = router;

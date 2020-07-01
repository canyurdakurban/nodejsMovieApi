const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie')



//Listele
router.get('/', (req,res) => {
 const promise = Movie.aggregate([
   {
     $lookup:{
       from: 'directors',
       localField: 'director_id',
       foreignField: '_id',
       as: 'directors'
     }
   },
   {
     $unwind: '$directors'
   }
 ]);

 promise.then((data) => {
   res.json(data);
 }).catch((err) => {
   res.json(err);
 });
});

//verilen 2 tarih arasını listele
router.get('/between/:start_year/:end_year', (req,res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
      {
        year:{"$gte": parseInt(start_year), "$lte": parseInt(end_year)}  //gte büyük veya eşitse lte küçük veya eşitse sondaki e ler kalkarsa büyük yada küçük oluyor
      }
      );

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//Top 10 List üste yazmasının sebebi movie_id li req i ezmek için yoksa top10 u id zannediyor.
router.get('/top10', (req,res) => {
  const promise = Movie.find({ }).limit(10).sort({ imdb_score: -1});

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//id bazlı veri çekme
router.get('/:movie_id', (req,res,next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then((movie) => {
    if (!movie)  //hata yakalama
      next({ message: 'Film bulunamadı.', code: 99});

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

//update
router.put('/:movie_id', (req,res,next) => {
  const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, {
    new:true
  });

  promise.then((movie) => {
    if (!movie)  //hata yakalama
      next({ message: 'Film bulunamadı.', code: 99});

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


//delete
router.delete('/:movie_id', (req,res,next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise.then((movie) => {
    if (!movie)  //hata yakalama
      next({ message: 'Film bulunamadı.', code: 99});

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


//Post methodu 2 farklı yöntem ile
/* GET movie listing. */
router.post('/', (req, res) => {
  //const { title,imdb_score,category,county,year} = req.body;

  /*const movie = new Movie({
    title: title,
    imdb_score: imdb_score,
    category: category,
    county: county,
    year: year
  });*/

  const movie = new Movie(req.body);

  /*movie.save((err, data) => {
    if (err)
      res.json(err);

    //res.json(data);
    res.json({status:1});
  });*/

  const promise = movie.save();

  promise.then((data)=> {
    res.json(data);
  }).catch((err)=> {
    res.json(err);
  });
});



module.exports = router;

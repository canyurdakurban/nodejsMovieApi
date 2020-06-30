const mongosee = require('mongoose');
const express = require('express');
const router = express.Router();

//Models
const Director = require('../models/Director')

router.post('/',(req,res) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//Sadece tek yönetmen ve filmleri
router.get('/:director_id', (req,res) => {
  const promise = Director.aggregate([
    {
      $match:{
        '_id': mongosee.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies',  //hangi tablo ile join yapılacak.
        localField: '_id', // direktor tablosundan hangi id Kullanılacak
        foreignField: 'director_id', // movieste hangi id ile eşleşecek
        as: 'movies'  //dönen datanın atanacağı değişken
      }
    },
    {
      $unwind: {
        path: '$movies',  //yukarıda ki veriyi kullanabilmek için alıyoruz.
        preserveNullAndEmptyArrays: true  //Filmi olmayanlarıda listeler
      }
    },
    {
      $group: {   //sadece bir yönetmen ve altındaki filmleri almak için grupluyoruz.
        _id:{
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies:{
          $push: '$movies'   //push metodu ile yukarıdaki tanımlanan movies verileri dolduruyoruz.
        }
      }
    },
    {
      $project:{  //gösterdiğimiz alan yukarıdaki group metodunun _id propertsinin yakalayıp listeledik.
        _id: '$_id._id',
        name: '$_id.name',
        surname:  '$_id.surname',
        movies: '$movies'
      }
    }

  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

//yönetmenlere göre filmleri join ederek listeledik.
router.get('/', (req,res) => {
  const promise = Director.aggregate([
      {
        $lookup: {
          from: 'movies',  //hangi tablo ile join yapılacak.
          localField: '_id', // direktor tablosundan hangi id Kullanılacak
          foreignField: 'director_id', // movieste hangi id ile eşleşecek
          as: 'movies'  //dönen datanın atanacağı değişken
        }
      },
    {
      $unwind: {
        path: '$movies',  //yukarıda ki veriyi kullanabilmek için alıyoruz.
        preserveNullAndEmptyArrays: true  //Filmi olmayanlarıda listeler
      }
    },
    {
      $group: {   //sadece bir yönetmen ve altındaki filmleri almak için grupluyoruz.
        _id:{
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies:{
          $push: '$movies'   //push metodu ile yukarıdaki tanımlanan movies verileri dolduruyoruz.
        }
      }
    },
    {
      $project:{  //gösterdiğimiz alan yukarıdaki group metodunun _id propertsinin yakalayıp listeledik.
        _id: '$_id._id',
        name: '$_id.name',
        surname:  '$_id.surname',
        movies: '$movies'
      }
    }

    ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});


module.exports = router;

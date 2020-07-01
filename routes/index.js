const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {

    const  user = new Users({
      username,
      password : hash
    });

    const promise = user.save();

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err)
    });

  });

});

router.post('/authenticate', (req, res) => {
  const {username, password } = req.body;

  Users.findOne({
    username
  }, (err, user) => {
    if (err)
      throw err;

    if (!user){
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{
      bcrypt.compare(password, user.password).then((result)=> {
        if (!result){
          res.json({
            status:false,
            message: 'Authentication failed, user not found or wrong password.'
          });
        }else
          {
              const payload = {
                     username
              };
              const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                 expiresIn: 720 //12 saat
              });

              res.json({
                status: true,
                token: token
              });
        }
      });
    }
  });

});

module.exports = router;

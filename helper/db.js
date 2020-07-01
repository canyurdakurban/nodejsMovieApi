const mongoose = require('mongoose');
mongoose.set('useCreateIndex',true);

module.exports = () => {
    mongoose.connect('mongodb://movie_user:Cy35623562@ds211774.mlab.com:11774/heroku_6fgm63sc', {useNewUrlParser:true,  useUnifiedTopology: true });


    mongoose.connection.on('open', () => {
       //console.log('MongoDb: Connected');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    });

    mongoose.Promise = global.Promise;
};
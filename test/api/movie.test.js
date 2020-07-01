const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies tests', () => {
    before((done)=> {
        chai.request(server)
            .post('/authenticate')
            .send({username: 'canyurdakurban', password : '123456'})
            .end((err,res)=> {
                token = res.body.token;
                //console.log(token);
                done();
            });
    });

    describe('/GET movies', ()=> {
        it('it should GET all the movies', (done)=> {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST Movie', ()=> {
        it('it should POST movie', (done)=> {
            const movie = {
                title: "Test Film",
                director_id: "5efb0459a57bf14390000b74",
                category: "Korku",
                country: "Turkey",
                year: 1990,
                imdb_score: 7
            };

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId = res.body._id;
                    done();
                });
        });
    });

    describe('/GET:movie_id movie', ()=> {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        });
    });

    describe('/PUT:movie_id Movie', ()=> {
        it('it should UPDATE movie given by id', (done)=> {
            const movie = {
                title: "Test Film Update",
                director_id: "5efb0459a57bf14390000b74",
                category: "Komedi",
                country: "Fransa",
                year: 1990,
                imdb_score: 7
            };

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);

                    done();
                });
        });
    });

    describe('/Delete:movie_id Movie', ()=> {
        it('it should DELETE movie given by id', (done)=> {

            chai.request(server)
                .delete('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eql(1);


                    done();
                });
        });
    });
});

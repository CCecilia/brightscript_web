process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../models/user');
const Tutorial = require('../models/tutorial');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('Index', function() {
    // test home page
    it('should retrieve home page on / GET', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
});

describe('Admin', function() {
    // Setup Test Data
    function testSetup() {
        // add users
        User.insertMany([
            {
                email: 'admin@test.com',
                password: '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
                admin: true
            },
            {
                email: 'user@test.com',
                password: '$2a$08$N5EjrC9VdIHzQ5Qmr8vReeJv1aW09YPI/Cr3u3ea.qpo3H7WnMXWO',
                admin: false
            }
        ]);
    };
    testSetup();

    // test admin login
    it('should retrieve admin login page on / GET', function(done) {
        chai.request(server)
        .get('/admin')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    //  login form: success
    it('should login:success then redirect on /admin POST', function(done) {
        chai.request(server)
        .post('/admin')
        .send({
            email: 'admin@test.com',
            password: 'march3489'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.redirect;
            done();
        });
    });

    //  login form: fail
    it('should login:fail(permissions) NOT redirect on /admin POST', function(done) {
        chai.request(server)
        .post('/admin')
        .send({
            email: 'user@test.com',
            password: 'march3489'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.not.redirect;
            done();
        });
    });

    //  login form: fail
    it('should login:fail(password) NOT redirect on /admin POST', function(done) {
        chai.request(server)
        .post('/admin')
        .send({
            email: 'admin@test.com',
            password: 'password'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.not.redirect;
            done();
        });
    });

    //  login form: fail
    it('should login:fail(unknown email) NOT redirect on /admin POST', function(done) {
        chai.request(server)
        .post('/admin')
        .send({
            email: 'test@admin.com',
            password: 'march3489'
        })
        .end(function(err, res){
            res.should.have.status(200);
            expect(res).to.not.redirect;
            done();
        });
    });

    // test admin dashboard
    it('should retrieve admin dashboard on / GET', function(done) {
        chai.request(server)
        .get('/admin/dashboard')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    // test admin tutorials
    it('should retrieve admin tutorials on / GET', function(done) {
        chai.request(server)
        .get('/admin/tutorials')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    // test admin tutorial create page
    it('should retrieve admin tutorial create on / GET', function(done) {
        chai.request(server)
        .get('/admin/tutorials/create')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });

    // test admin tutorial create
    it('should retrieve admin tutorial create on / POST', function(done) {
        chai.request(server)
        .post('/admin/tutorials/update')
        .send({
            cover_title: 'Test Title',
            cover_image: '/images/roku.png',
            cover_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            published: false,
            steps: [
                {
                    title: 'step 1',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    image: '/images/roku.png',
                    order_number: 1,

                },
                {
                    title: 'step 2',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    image: '/images/roku.png',
                    order_number: 2,

                },
                {
                    title: 'step 3',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    image: '/images/roku.png',
                    order_number: 3,

                }
            ]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // test admin tutorial update
    it('should retrieve admin tutorial create on / POST', function(done) {
        Tutorial.findOne()
        .exec(function(err, tutorial) {
            chai.request(server)
            .post('/admin/tutorials/update')
            .send({
                _id: tutorial._id,
                cover_title: 'Test Title Edited',
                cover_image: '/images/roku.png',
                cover_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Edited.',
                published: true,
                steps: [
                    {
                        title: 'step 1 edited',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Edited.',
                        image: '/images/roku.png',
                        order_number: 1,

                    },
                    {
                        title: 'step 2 edited',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Edited.',
                        image: '/images/roku.png',
                        order_number: 2,

                    }
                ]
            })
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
        });
    });

    // test admin categories create
    it('should retrieve admin categories create on / PUT', function(done) {
        chai.request(server)
        .put('/admin/categories/new')
        .send({
            name: 'Test Category',
        })
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });

    // test admin categories
    it('should retrieve admin tutorials on / GET', function(done) {
        chai.request(server)
        .get('/admin/categories')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });


});

/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    let testBookId;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            testBookId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function() {
      
      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });      
      
    });


    suite('GET /api/books/:id => book object with id', function() {
      
      test('Test GET /api/books/:id with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/000000000000000000000000')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/:id with valid id in db', function(done) {
        chai.request(server)
          .get('/api/books/' + testBookId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.equal(res.body._id, testBookId);
            done();
          });
      });
      
    });


    suite('POST /api/books/:id => add comment/expect book object with id', function() {
      
      test('Test POST /api/books/:id with comment', function(done) {
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({ comment: 'Great book!' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.include(res.body.comments, 'Great book!');
            done();
          });
      });

      test('Test POST /api/books/:id without comment field', function(done) {
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/:id with comment, id not in db', function(done) {
        chai.request(server)
          .post('/api/books/000000000000000000000000')
          .send({ comment: 'Not a real book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/:id => delete book object id', function() {

      test('Test DELETE /api/books/:id with valid id in db', function(done) {
        chai.request(server)
          .delete('/api/books/' + testBookId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/:id with id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/000000000000000000000000')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});

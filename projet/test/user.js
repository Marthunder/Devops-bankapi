var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:4000/');
var invoiceData = {};
var testUser = {};
var invoiceRoute = 'user/1/invoice';
describe('User unit test', function () {

    before(function(done) {
        //Avant l'execution des test
        //Supprime et recré l'utilisateur de test
        //Et le recré
        server
            .delete('user/test')
            .end(function (err, res) {
                server
                    .post('user/test')
                    .end(function (err, res) {
                        testUser = res.body.data;
                        invoiceRoute = 'user/' + testUser.id +'/invoice';
                        done();
                    });
            });

    });

    after(function(done) {
        //A la fin de lexecution des tests
        //Supprime l'utilisateur de test
        server
            .delete('user/test')
            .end(function (err, res) {
                done();
            });
    });


    beforeEach(function() {
        //Avant chaque test on réinitialise les données de la facture
        invoiceData = {
            amount: 50,
            expirationDate: '04/17',
            cardNumber: '1111222233334444',
            cvv: '322'
        };
    });

    it('should throw missing parameters', function (done) {
        server
            .post(invoiceRoute)
            .expect(400)
            .send()
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_MISSINGPARAMETERS');
                done();
            });
    });

    it('should throw invalid card 1', function (done) {
        invoiceData.cardNumber = 12314;
        server
            .post(invoiceRoute)
            .expect(400)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_INVALIDCARD');
                done();
            });
    });

    it('should throw invalid card 2', function (done) {
        invoiceData.expirationDate = "12/16";
        server
            .post(invoiceRoute)
            .expect(400)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_INVALIDCARD');
                done();
            });
    });

    it('should throw invalid card 3', function (done) {
        invoiceData.cvv = 1234;
        server
            .post(invoiceRoute)
            .expect(400)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_INVALIDCARD');
                done();
            });
    });

    it('should throw inssufficient balance', function (done) {
        invoiceData.amount = 200;
        server
            .post(invoiceRoute)
            .expect(400)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_USER_INSUFFICIENTBALANCE');
                done();
            });
    });

    it('should throw user not found', function (done) {
        server
            .post('user/0/invoice')
            .expect(400)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.code.should.equal('ERR_USER_NOTFOUND');
                done();
            });
    });

    it('should debit user', function (done) {
        server
            .post(invoiceRoute)
            .expect(200)
            .send(invoiceData)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});
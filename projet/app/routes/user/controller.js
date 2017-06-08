var apiResponse = require('../../../lib/apiResponse');
var errorService = require('../../../lib/errorService');

module.exports = {
    getAllUsers : function getAllUsers(req, res) {
        const User = res.db.user;

        User.findAll().then(function (users) {
            apiResponse.ok(res, users);
        }, function (error) {
            apiResponse.serverError(res, errorService.getDefault(error.message));
        });
    },

    createTestUser : function createTestUser(req, res) {
        const User = res.db.user;

        User.create({
            email: 'testuser@ynov.com',
            firstName: 'Test',
            lastName: 'User',
            balance: 300
            }).then(function (user) {
                apiResponse.ok(res, user);
            }, function (error) {
                apiResponse.serverError(res, errorService.getDefault(error.message));
         });
    },

    deleteTestUser: function deleteTestUser(req, res) {
        const User = res.db.user;

        User.destroy({
            where: {
                email: 'testuser@ynov.com'
            }
            }).then(function(){
                apiResponse.ok(res);
            }, function (error) {
                apiResponse.serverError(res, errorService.getDefault(error.message));
            });
    },

    invoiceUser: function invoiceUser(req, res){
        const User = res.db.user,
              Operation = res.db.operation;

        if(!req.body.cvv || !req.body.cardNumber || !req.body.expirationDate || !req.body.amount){
            apiResponse.badRequest(res, errorService.get('missingparameters'));
            return;
        }
        var cvvRegex = new RegExp('^[0-9]{3}$');
        var cardRegex = new RegExp('^[0-9]{16}$');

        var exirationDateSplited = req.body.expirationDate.split('/');
        var expirationMonth = exirationDateSplited[0];
        var expirationYear = "20" + exirationDateSplited[1];
        var today = new Date();
        var isValidDate = true;
        if (expirationYear < today.getFullYear() || expirationMonth < today.getMonth() + 1 && expirationYear <= today.getFullYear()){
            isValidDate = false;
        }

        if (!cvvRegex.test(req.body.cvv) || !cardRegex.test(req.body.cardNumber) || !isValidDate){
            apiResponse.badRequest(res, errorService.get('invalidcard'));
            return;
        }

        //Débit de l'user
        User.find({
            where: { id: req.params.id }
        }).then(function (user) {

            if (!user){
                apiResponse.badRequest(res, errorService.get('user.notfound'));
                return;
            }

            if (user.balance < parseInt(req.body.amount) * 5){
                apiResponse.badRequest(res, errorService.get('user.insufficientbalance'));
                return;
            }
            var newBalance = user.balance - parseInt(req.body.amount);
            user.updateAttributes({
                balance: newBalance
            })
                .then(function (userUpdated) {
                    var today = new Date();
                    var invoiceDate = today.setDate(today.getDate() + 7);
                    Operation.create({
                        amount: parseInt(req.body.amount),
                        debitDate: services.formatDateTime(invoiceDate),
                        userId: req.params.id
                    }).then(function(operation){
                        apiResponse.ok(res);
                    },function(error){
                        apiResponse.serverError(res, errorService.getDefault(error.message));
                    });

                }, function (error) {
                    apiResponse.serverError(res, errorService.getDefault(error.message));
                });
        }, function (error) {
            apiResponse.serverError(res, errorService.getDefault(error.message));
        });
    }
};
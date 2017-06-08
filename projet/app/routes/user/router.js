var controllers = require('./controller');


module.exports = function (router) {
    'use strict';

    router.route('/')
    /**
     * @api {get} /user/ Get all users
     * @apiName getAllUsers
     * @apiGroup User
     *
     * @apiSuccess {Object[]} Users List of users
     */
        .get(controllers.getAllUsers);

    router.route('/test')
    /**
     * @api {post} /user/test Create a user for testing
     * @apiName CreateTestUser
     * @apiGroup User
     *
     * @apiSuccess {Object} user User created
     */
        .post(controllers.createTestUser)
        /**
         * @api {delete} /user/test delete the user for testing
         * @apiName DeleteTestUser
         * @apiGroup User
         *
         */
        .delete(controllers.deleteTestUser);

    router.route('/:id/invoice')
    /**
     * @api {post} /user/id/cant Apply an invoice to a user
     * @apiName InvoiceUser
     * @apiGroup User
     *
     * @apiParam {Number} amount Amount of the invoice
     * @apiParam {Number} expirationDate Expiration date of the card
     * @apiParam {Number} cardNumber
     * @apiParam {Number} cvv
     */
        .post(controllers.invoiceUser);
};
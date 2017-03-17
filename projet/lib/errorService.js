var fs = require("fs");

module.exports = {
    ERROR_CODE_PREFIX : 'ERR',
    ERROR_CODE_SEPARATOR : '_',

    DEFAULT_CODE : 'UNKNOWN',
    DEFAULT_MESSAGE : 'Unknown error',

   ERROR_VALUE : JSON.parse(fs.readFileSync('error_value.json', 'utf8')),

    getDefault : function(customMessage) {
        var code = this.ERROR_CODE_PREFIX + this.ERROR_CODE_SEPARATOR + this.DEFAULT_CODE;
        var message = this.DEFAULT_MESSAGE;
        if(customMessage) {
            message = customMessage;
        }
        //Permet de gérer le cas des messages d'erreur de validations des models générés par Sequelize
        if (message.code && message.message){
            return message;
        }
        return {
            code : code,
            message : message
        };
    },

    get : function(error, details){
        if(!error) {
            return this.getDefault();
        }

        var value = error.split('.');
        var that = this;
        var errorResult = {code : that.ERROR_CODE_PREFIX + that.ERROR_CODE_SEPARATOR, message : ''};
        var context = null;

        for(var i = 0; i < value.length; i++) {
            var upper = value[i].toUpperCase();
            if(this.ERROR_VALUE[upper] instanceof Object) {
                errorResult.code += upper + this.ERROR_CODE_SEPARATOR;
                context = context ? context[upper] : this.ERROR_VALUE[upper];
            } else {
                errorResult.code += upper + this.ERROR_CODE_SEPARATOR;
                errorResult.message = context ? context[upper] : this.ERROR_VALUE[upper];
            }
        }

        if(details) {
            errorResult.details = details;
        }

        if(errorResult.code === this.ERROR_CODE_PREFIX + this.ERROR_CODE_SEPARATOR || !errorResult.message) {
            return this.getDefault();
        } else {
            errorResult.code = errorResult.code.substr(0, errorResult.code.length -1);
            return errorResult;
        }
    }
};
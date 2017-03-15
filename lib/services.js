var moment = require('moment');
module.exports = {
    formatDateTime : function(date){
        var d = moment(date);
        if(!d.isValid()){
            return null;
        }else{
            return d.format('YYYY-MM-DD HH:mm:ss');
        }
    },

    formatDate : function(date){
        var d = moment(date);
        if(!d.isValid()){
            return null;
        }else{
            return d.format('YYYY-MM-DD');
        }
    },
}
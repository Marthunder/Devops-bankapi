var errorService = require('../../lib/errorService.js');
var services = require('../../lib/services.js');
module.exports = function(sequelize, DataTypes) {
    var Operation = sequelize.define('operation', {
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            debitDate: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'operation',
            underscored: true,
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: sequelize.models.user,
                    key: 'id'
                }
            },
            instanceMethods : {
                toJSON: function(){
                    var values = Object.assign({}, this.get());

                    values.created_at = services.formatDateTime(values.created_at);
                    values.updated_at = services.formatDateTime(values.updated_at);
                    values.debitDate = services.formatDateTime(values.debitDate);

                    return values;
                }
            }
        });

    return Operation;
};
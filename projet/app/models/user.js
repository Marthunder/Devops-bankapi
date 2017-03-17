var errorService = require('../../lib/errorService.js');
var services = require('../../lib/services.js');
module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
		email: { 
			type: DataTypes.STRING, 
			unique: {name: 'email', msg: errorService.get('user.emailalreadyexist')},
			allowNull: false 
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	},
	{
        tableName: 'user',
        underscored: true,
        classMethods: {
            associate: function(models) {
				User.hasMany(models.operation, {foreignKey: 'userId'});
            }
        },
		instanceMethods : {
			toJSON: function(){
				var values = Object.assign({}, this.get());

				values.created_at = services.formatDateTime(values.created_at);
				values.updated_at = services.formatDateTime(values.updated_at);

				return values;
			}
		}
    });
	
	return User;
};
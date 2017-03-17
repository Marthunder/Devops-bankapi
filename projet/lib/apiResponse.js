module.exports = {
	
	ok : function(res, data){
		var response = {
			status : 200	
		};
		if (data){
			response.data = data;
		}
		res.status(response.status);
		res.json(response);
	},
	
	badRequest : function (res, error){
		var response = {
			status : 400	
		};
		if (error){
			response.error = error;
		}
		res.status(response.status);
		res.json(response);	
	},
	
	serverError : function (res, error){
		var response = {
			status : 500	
		};
		if (error){
			response.error = error;
		}
		res.status(response.status);
		res.json(response);	
	},
	
	notFound : function (res, error){
		var response = {
			status : 404	
		};
		if (error){
			response.error = error;
		}
		res.status(response.status);
		res.json(response);	
	},
	
	unAuthorized: function (res, error){
		var response = {
			status : 401	
		};
		if (error){
			response.error = error;
		}
		res.status(response.status);
		res.json(response);	
	},

	forbidden: function (res, error){
		var response = {
			status : 403
		};
		if (error){
			response.error = error;
		}
		res.status(response.status);
		res.json(response);
	}
}
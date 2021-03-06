'use strict';

const request = require('request');
const queryString = require('querystring');

class Youtube {
	constructor(){
		this.url = 'https://www.googleapis.com/youtube/v3/'
		this.params = {
			type: 'video',
			videoSyndicated: true
		};
	}

	set APIKey(apiKey){
		this.params['key'] = apiKey;
	}

	search(query, part, limit){
		part = part || 'snippet';
		limit = limit || 1;

		this.params['part'] = part;
		this.params['q'] = query;
		this.params['maxResults'] = limit;

		return this._makeRequest(this.url + 'search?' + queryString.stringify(this.params));

	}

	_makeRequest(url){
		let promise = new Promise((resolve, reject) =>{
			request(url, function(err, res, body){
				if(err){
					console.log(err);
					reject(err);
				} else{
					let data = JSON.parse(body);
					resolve(data);
				}
			});
		});
		return promise;
	}

}

module.exports = new Youtube;
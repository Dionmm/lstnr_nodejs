'use strict';

const request = require('request');
const queryString = require('querystring');

class Spotify {
	constructor(){
		this.url = 'https://api.spotify.com/v1/'
		this.params = {
			type: 'track'
		};
	}

	search(query, limit){
		limit = limit || 1;

		this.params['q'] = query;
		this.params['limit'] = limit;

		console.log(this.url + 'tracks?' + queryString.stringify(this.params));
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

module.exports = new Spotify;
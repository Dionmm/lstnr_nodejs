'use strict';

const request = require('request');
const queryString = require('querystring');

class Youtube {
	constructor(){
		this.url = 'https://www.googleapis.com/youtube/v3/search?'
		this.params = {
			type: 'video',
			videoSyndicated: true
		};
	}

	set APIKey(apiKey){
		this.params['key'] = apiKey;
	}

	search(query, part, results){
		part = part || 'snippet';
		results = results || 1;

		this.params['part'] = part;
		this.params['q'] = query;
		this.params['maxResults'] = results;
		console.log(this.url + queryString.stringify(this.params));
		request(this.url + queryString.stringify(this.params), function(err, res, body){
			if (err) {
				console.error(err);
				process.exit();
			}
			let data = JSON.parse(body);
			console.log(body);
		});
	}

}

module.exports = new Youtube;
let express = require('express');
let app = express();

let port = process.env.POR || 8080;

history = new Map();

app.get('/himastermind/newgame/*', function (req, res) {
	let name = req.url.substring(22);
	name = name.substring(0, (name.indexOf('/')<0?name.length:name.indexOf('/')));
	let id = makeid(6);
	history.set(id, [Math.floor(Math.random()*1000000), (Date.now()/1000 | 0)]);
	console.log(history);
	res.send(id);
});

app.get('/himastermind/play/*', function (req, res) {
	let params = req.url.substring(19);
	code = params.substring(0, (params.indexOf('/')<0?params.length:params.indexOf('/')));
	guess = params.substring(params.indexOf('/')<0?params.length:params.indexOf('/') + 1);
	if (history.has(code)) {
		let accuracy = getDigitsAccuracy(Array.from(history.get(code)[0].toString()), Array.from(guess));
		res.send(accuracy + ' ' + ((Date.now()/1000 | 0)-(history.get(code)[1])).toString());
	} else {
		res.send('error!');
	}
});

app.listen(port);

function getDigitsAccuracy(correct, guess) {
	correct_digits = 0;
	for (var i = 0; i < correct.length; i++) {
		if (correct[i] == guess[i]) {
			correct_digits++;
			correct[i] = 'a';
			guess[i] = 'a';
		}
	}

	misplaced_digits = 0;
	for (var i = 0; i < guess.length; i++) {
		if (guess[i] != 'a') {
			for (var j = 0; j < correct.length; j++) {
				if(correct[j] == guess[i]){
					misplaced_digits++;
					guess[i] = 'a';
					correct[i] = 'a';
				}
			}
		}
	}

	return correct_digits.toString() + " " + misplaced_digits.toString();
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

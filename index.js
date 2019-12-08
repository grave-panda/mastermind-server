let express = require('express');
let app = express();
const cors = require('cors')
const { pool } = require('./config')
app.use(cors())

let port = process.env.PORT || 8080;

history = new Map();

app.get('/himastermind/newgame/*', function (req, res) {
	let name = req.url.substring(22);
	name = name.substring(0, (name.indexOf('/')<0?name.length:name.indexOf('/')));
	let id = makeid(6);
	let correct = Math.floor(Math.random()*1000000);
	// history.set(id, [Math.floor(Math.random()*1000000), (Date.now()/1000 | 0)]);
	pool.query('INSERT INTO data (key, correct, started) VALUES  ($1, $2, $3)', [id, correct, (Date.now()/1000 | 0)], error => {
	    if (error) {
    	  	throw error;
    	}
    	res.send(id);
  	})
	// console.log(history);
});

app.get('/himastermind/play/*', function (req, res) {
	let params = req.url.substring(19);
	code = params.substring(0, (params.indexOf('/')<0?params.length:params.indexOf('/')));
	guess = params.substring(params.indexOf('/')<0?params.length:params.indexOf('/') + 1);
	// if (history.has(code)) {
	// 	let accuracy = getDigitsAccuracy(Array.from(history.get(code)[0].toString()), Array.from(guess));
	// 	res.send(accuracy + ' ' + ((Date.now()/1000 | 0)-(history.get(code)[1])).toString());
	// } else {
	// 	res.send('error!');
	// }
	pool.query('SELECT * FROM data WHERE id=\''+code+'\';', (error, results) => {
    if (error) {
    	throw error
    }
    if (results.length == 0) {
    	res.send('error');
    }
	let accuracy = getDigitsAccuracy(Array.from(results[0].correct.toString()), Array.from(guess));
    res.send(accuracy + ' ' + ((Date.now()/1000 | 0)-results[0].started).toString());
  })
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening`)
})

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

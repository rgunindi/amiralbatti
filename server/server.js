const express = require('express');
const app = express();
const cors = require('cors');
const a = require('../utils/app.js');
const sendMode = require('../helpers/sendType.js');
const port = process.env.PORT || 3000;
app.use(cors());
let startStatus = false;
let queue = true;
let queuePlayer1 = false;
let queuePlayer2 = false;
let gameReference = new a.Game();
app.get('/start/:id', function (req, res) {
    if (startStatus == false) {
        const id = parseInt(req.params.id);
        if (typeof id == 'number' && id > 0) {
            startStatus = true;
            gameReference = a.Game(id, sendMode.START);
            res.send('Starting game');
        } else {
            res.send('please enter a number');
        }
    } else {
        res.send('Game already started');
    }
});
app.get('/player1', function (req, res) {
    if (startStatus == true) {
        if (queue == true) {
            queue = false;
            let data=a.Game(0, sendMode.PLAYER1, 0);
            res.send(`Player 1<br> ${data.log}`);
            queue = true;
        }
    } else {
        res.send('Game not started');
    }
})

app.get('/player1/:id', function (req, res) {
    const moveId = (req.params.id);
    if (startStatus == true) {
        if (queuePlayer1 == false||queuePlayer2==true){
        if (queue == true) {
            queue = false;
            let data = a.Game(0, sendMode.PLAYER1, moveId);
            if (data.status == true) {
                res.send(`Player 1 you hit the ship!<br> ${data.log}`);
                if(data.log=='Player Won!'){
                    startStatus=false;
                }
                queuePlayer1 = false;
            } else {
                res.send(`Player 1 you missed! <br> ${data.coordinates==undefined?'':data.coordinates.toString().replace(/[,]/g,'-')}`);
                queuePlayer1 = true;
                queuePlayer2 = false;
            }
            queue = true;
        }}else {
            res.send('Player 2 is playing');
        }
    } else {
        res.send('Game not started');
    }
});

app.get('/player2', function (req, res) {
    if (startStatus == true) {  
        if (queue == true) {
            queue = false;
            let data=a.Game(0, sendMode.PLAYER2, 0);
            res.send(`Player 2<br> ${data.log}`);
            queue = true;
        }
    } else {
        res.send('Game not started');
    }
});

app.get('/player2/:id', function (req, res) {
    const moveId = (req.params.id);
    if (startStatus == true) {
        if (queuePlayer2 == false||queuePlayer1==true) {
            if (queue == true) {
                queue = false;
                let data = a.Game(0, sendMode.PLAYER2, moveId);
                if (data.status == true) {
                    res.send(`Player 2 you hit the ship!<br> ${data.log}`);
                    if(data.log=='Player Won!'){
                        startStatus=false;
                    }
                    queuePlayer2 = false;
                } else {
                    res.send(`Player 2 you missed! <br> ${data.coordinates==undefined?'':data.coordinates.toString().replace(/[,]/g,'-')}`);
                    queuePlayer2 = true;
                    queuePlayer1=false;
                }
                queue = true;
            }
        } else {
            res.send('Player 1 is playing');
        }
    } else {
        res.send('Game not started');
    }
});
//start server with port
app.listen(port, function () {
    console.log('server started at port ' + port);
})

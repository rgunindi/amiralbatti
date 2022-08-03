const sendMode = require('../helpers/sendType.js');
var cache = require('memory-cache');
function game(app, mode,move) {
    let coordinatesPlayers = [];
    let status=false;
    switch (mode) {
        case sendMode.START:
            // code block
            //Create board for battleship game
            let size = app;
            let board = [];
            function createBoard(size) {
                for (var i = 0; i < size; i++) {
                    board[i] = [];
                    for (var j = 0; j < size; j++) {
                        board[i][j] = '🌊';
                    }
                }
                return board;
            }
            //Create random location for ship
            function randomLocation(size) {
                let x = Math.floor(Math.random() * size);
                let y = Math.floor(Math.random() * size);
                return [x, y];
            }

            function create() {
                for (let k = 1; k < 3; k++) {
                    console.log("Player: " + k);
                    createBoard(size);
                    let coordinates = [];
                    for (let i = 0; i < size * 2; i++) {
                        var a = randomLocation(size);
                        var c = coordinates.find(x => x.toString() == a);
                        if (c != undefined) {
                            i--;
                            continue;
                        }
                        coordinates.push(a);
                        board[a[0]][a[1]] = '🚢';
                    }
                    coordinatesPlayers.push(board);
                    coordinates = [];
                    print(board);
                    board = [];
                }
            }
            create();
            //Print board
            cache.put('coordinatesPlayers', coordinatesPlayers);
            break;
        case sendMode.PLAYER1:
            console.log("Player 1");
           if(move!=0){
            const count=cache.get('coordinatesPlayers')[0].length;
               let c=(move[0].toUpperCase().charCodeAt(0)) - 65;
                let r=move[1]-1;
                if(count<=c){
                    return false;
                }
                cache.put('coordinatesMemoryP1',
                cache.get('coordinatesMemoryP1')?
                cache.get('coordinatesMemoryP1').concat([move[0].toUpperCase(),move[1]]):
                [move[0].toUpperCase(),move[1]]);
                
                console.log(cache.get('coordinatesPlayers')[0][c][r]);
                if(cache.get('coordinatesPlayers')[0][c][r]=='🚢'){
                    cache.get('coordinatesPlayers')[0][c][r]='💥';
                    console.log("Hit");
                    status=true;
                }
            }
            let logp1=print(cache.get('coordinatesPlayers')[0]);
            let datap1={status:status,coordinates:cache.get('coordinatesMemoryP1'),log:logp1};
            return datap1;

        case sendMode.PLAYER2:
            console.log("Player 2");
            if(move!=0){
                const count=cache.get('coordinatesPlayers')[1].length;
                let c=(move[0].toUpperCase().charCodeAt(0)) - 65;
                 let r=move[1]-1;
                 if(count<=c){
                    return false;
                }
                cache.put('coordinatesMemoryP2',
                cache.get('coordinatesMemoryP2')?
                cache.get('coordinatesMemoryP2').concat([move[0].toUpperCase(),move[1]]):
                [move[0].toUpperCase(),move[1]]);

                 if(cache.get('coordinatesPlayers')[1][c][r]=='🚢'){
                     cache.get('coordinatesPlayers')[1][c][r]='💥';
                     console.log("Hit");
                     status=true;
                 }
             }
             let logp2=print(cache.get('coordinatesPlayers')[1]);
             let datap2={status:status,coordinates:cache.get('coordinatesMemoryP2'),log:logp2};
            return datap2;
            
        default:
        // code block
    }

    function print(data) {
        let Cell = "";
        let Cells = "";
        let TableCell = "";
        let RowString = "# ";
        let countLetter = 0;
        let charConst = 65;
        data.forEach(function (row) {
            row.forEach(function (cell) {
                Cell += cell + " ";
            });
            Cells += `${String.fromCharCode(countLetter + charConst)} ${Cell} \n`;
            TableCell += `<tr><td>${String.fromCharCode(countLetter + charConst)} ${Cell}</td></tr>`;
            Cell = "";
            countLetter++;
        });
        let numbers={1:"１",2:"２",3:"３",4:"４",5:"５",6:"６",7:"７",8:"８",9:"９"};
        for (let i = 1; i <= countLetter; i++) {
            // RowString += i + " ";
            RowString += numbers[i] + " ";
        }
        
        console.log(RowString);
        console.log(Cells);
        var anyShip=Cells.match(/🚢/g);
        if(anyShip==null){
            console.log("Player Won!");
        return "Player Won!";
        }
        //var data=RowString+"\n"+Cells.replaceAll("🚢","🌊");
        var data=`<table>
    <thead>
        <tr>
            ${RowString}
        </tr>
    </thead>
    <tbody>
        ${TableCell.replaceAll("🚢","🌊")}
    </tbody>
</table>`;
       return data;
    }
}
exports.Game = game;
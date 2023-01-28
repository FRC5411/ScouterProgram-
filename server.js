const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

//************************* END OF PHYSICS ENGINE ***/

/*class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}*/

const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const fw = require('./Server/fileWriter')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//import { MarkerColor } from './gamePieces'
//MarkerColor = require('./gamePieces')

const http = require("http")
const socketio = require("socket.io")
const path = require("path")

const httpserver = http.Server(app)
const io = socketio(httpserver)

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'));
})

let playerPos = {}
let scouts = []
let scoutData
let assignments = {}
let gamemarkers = []
let gamePlay = {}

fs.readFile("./data/scouters.json", "utf8", (error, data) => {
    if (error) { console.log(error) }
    assignments = JSON.parse(data)
})

initGame();
io.on('connection', connected);
//setInterval(serverLoop, 1000/60);

function connected(socket){
    socket.on('newScouter', data => {
        console.log("New client connected, with id (yeah): " + socket.id);
        //let markerCol = new markerColor();
        //let testColor = new gp.MarkerColor(235,255,137,0.5);
        //let markerColor = new markerColor(255,91,206);
        //scoutData.markerColor = markerColor;
        console.log("markerColor: " + scoutData.markerColor.red)
        //console.log(data + " joined. They are assigned to the " + assignments[data]["alliance"] + " alliance")
        //scoutData = new gp.Scout(data, '5411', assignments[data]["alliance"], new gp.MarkerColor(235,255,137,0.5))
        console.log(scoutData)
        io.emit('AssignRobot', scoutData);
    })
    socket.on('drawMarker', data => {
        let drawMarker = {
            x: data.x,
            y: data.y,
            markerColor: scoutData.markerColor
        }
        let markerId = "x"+drawMarker.x+"y"+drawMarker.y;
        addMarker(drawMarker,markerId);
        /*console.log("coordinate X: "+data.x);
        console.log("coordinate Y: "+data.y);*/
        //console.log("coordinate Red: "+drawMarker.markerColor.red);
        io.emit('placeMarker', drawMarker);
    })

    socket.on('disconnect', function(){
        console.log("Goodbye client with id "+socket.id);
        console.log("Current number of players: "+Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })

}

function initGame()
{
    let markerColor = new gp.MarkerColor(235,255,137,0.5);
    //console.log("markerColor: "+markerColor.red);
    gamePlay = new gp.GamePlay();
    scoutData = new gp.Team('Scott', '5411', 'Red', markerColor); 
    //fw.addScout(scoutData.name, scoutData);
    fw.addNewGame('match1');
}

function addMarker(gameMarker,markerid)
{
    let newMarker = new gp.Markers(gameMarker.x, gameMarker.y);
    newMarker.markerColor = gameMarker.markerColor;
    gamemarkers[markerid] = newMarker;
    console.log(gamemarkers);

}

httpserver.listen(5500)
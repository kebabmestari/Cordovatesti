var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        gamstart = true;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

    }
};

var wH = window.innerHeight;
document.getElementsByClassName("mainwrapper")[0].style.height = ""+wH-20+"px";

var gamstart = false;

var gameon = false;
//Pelivariablet
var pisteet = 0;

var pelialue = document.getElementsByTagName("canvas")[0];

var matopalat = new Array(1);
var suunta = "right";

var boxW = pelialue.width/9;
var boxH = pelialue.height/9;

var pelialue = document.getElementById('peli');
var suuntaboksi = document.getElementById('direction');
window.addEventListener("keydown", nappain );
var ctx = pelialue.getContext("2d");
var ctx_w = ctx.width, ctx_h = ctx.height;

ctx.font = "30px Arial";
ctx.textAlign = "center";
ctx.fillText("MATOPELI", pelialue.width/2, pelialue.height/2 );

var mato_x, mato_y;

var nopeus = 700;
var updateInterval;

var aaniefekti = new Audio("res/aani.wav");
var gameover = new Audio("res/gameover.mp3");

//Style
var emptyBg 	= "white";
var matoBg  	= "#46B82C";
var matoHeadBg  = "#2AB82D";
var ruokaBg 	= "rgb(216,103,87)";

var ruoka_x, ruoka_y;

/**
 Start the game
 */
function startGame(){
    gameon = true;

    nopeus = 900;

    pisteet = 0;
    matopalat = new Array();

    mato_x = getRandomPosition();
    mato_y = getRandomPosition();

    ruoka_x = getRandomPosition();
    ruoka_y = getRandomPosition();

    window.addEventListener( "touchstart", getTouch );

    var i;
    for( i in matopalat ){
        delete matopalat[i];
    }

    if( updateInterval != null )
        window.clearInterval( updateInterval );

    updateInterval = window.setInterval( updateGame, nopeus );

}

/**
 Mato controls
 */
function nappain(e){
    e = e || window.event;
    var painettu = e.which || e.keyCode;
    switch( painettu ){
        case 38:
            suunta = 'up';
            break;
        case 40:
            suunta = 'down';
            break;
        case 39:
            suunta = 'right';
            break;
        case 37:
            suunta = 'left';
            break;
        default:
            return;
    }
    suuntaboksi.innerHTML = suunta;
}

function updateGame(){
    document.getElementById('pojot').innerHTML  = pisteet;
    document.getElementById('nopeus').innerHTML = nopeus;

    //Move matopalat
    positionMato( mato_x, mato_y );

    switch( suunta ){
        case 'up':
            mato_y--;
            break;
        case 'down':
            mato_y++;
            break;
        case 'left':
            mato_x--;
            break;
        case 'right':
            mato_x++;
            break;
    }

    if( mato_x < 0 ) mato_x = 8;
    if( mato_x > 8 ) mato_x = 0;
    if( mato_y < 0 ) mato_y = 8;
    if( mato_y > 8 ) mato_y = 0;

    //Check hits
    var i;
    for( i in matopalat ){
        if( mato_x == matopalat[i].x && mato_y == matopalat[i].y ){
            window.clearInterval( updateInterval );
            ctx.fillText("IS KILL", 0, 0);
            endGame();
        }
    }

    if( mato_x == ruoka_x && mato_y == ruoka_y ){
        pisteet++;
        aaniefekti.play();
        updateRuoka();
    }

    //Clear view
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,pelialue.width, pelialue.height);

    ctx.fillStyle = matoBg;
    //Draw mato
    var i;
    for( i in matopalat ){
        ctx.fillRect( matopalat[i].x * boxW, matopalat[i].y * boxH, boxW, boxH );
    }

    //Draw mato head
    ctx.fillStyle = matoHeadBg;
    ctx.fillRect( mato_x * boxW, mato_y * boxH, boxW, boxH );

    //Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(ruoka_x * boxW, ruoka_y * boxH, boxW, boxH );

}

function updateRuoka(){

    if( nopeus > 400 )
        nopeus -= 50;

    ruoka_x = getRandomPosition();
    ruoka_y = getRandomPosition();

    window.clearInterval( updateInterval );
    updateInterval = window.setInterval( updateGame, nopeus );

    //Uusi pala
    var newinstance = matopalat.length;

    if( newinstance === 0 )
        matopalat[ matopalat.length ] = new uusiPala( mato_x, mato_y );
    else
        matopalat[ matopalat.length ] = new uusiPala( matopalat[ matopalat.length-1 ].x, matopalat[ matopalat.length-1 ].y );

}

/**
 Palauta random paikka 0-9
 */
function getRandomPosition(){
    return randomIntFromInterval(0, 8);
    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}

/**
 Matopalan konstruktori
 */
function uusiPala( x, y ){
    this.x = x;
    this.y = y;
}

/**
 Muuta tausta lopussa
 */
function endGame(){
    var solut = document.getElementsByTagName('td');
    var i;
    for( i = 0; i < solut.length; i++ ){
        solut[i].style.backgroundColor = 'rgb(214,204,171)';
    }
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("DED", pelialue.width/2, pelialue.height/2);
    gameover.play();
}

/**
 * Read touch
 *
 */
function getTouch( ev ){
    var x = ev.touches[0].pageX;
    var y = ev.touches[0].pageY;

    if( x < window.innerWidth/2 && Math.abs( window.innerHeight/2 - y ) < 50 )
        suunta = "left";
    if( x > window.innerWidth/2 && Math.abs( window.innerHeight/2 - y ) < 50 )
        suunta = "right";
    if( y < window.innerHeight/2 && Math.abs( window.innerWidth/2 - x ) < 50 )
        suunta = "up";
    if( y > window.innerHeight/2 && Math.abs( window.innerWidth/2 - x ) < 50 )
        suunta = "down";
    suuntaboksi.innerHTML = suunta;
}

/**
 Siirrä madon pää
 */
function positionMato( x, y ){
    var i;
    for( i = matopalat.length-1; i > 0; i-- ){
        matopalat[i].x = matopalat[i-1].x;
        matopalat[i].y = matopalat[i-1].y;
    }
    if( matopalat.length > 0 ){
        matopalat[0].x = mato_x;
        matopalat[0].y = mato_y;
    }
    mato_x = x;
    mato_y = y;
}
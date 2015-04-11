
//TODO: Handle orientation changes on teh screen
//take a look at this link it might hel[
//https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
//TODO: make big celebration screen when reaching orelia
//TODO: Provide a better menu screen than currently
//TODO: add bonus round level
//TODO: add shoot em up level
//TODO: centralize all settings to one class
//TODO: change fonts for start menu
//TODO: integrate leader board
//TODO: Fix the issue with controls on android
//TODO: fix screen sizing issues on phonesma
//TODO: Change music for second level
//TODO: Add power up
//
//http://stackoverflow.com/questions/7773865/how-to-disable-web-page-zooming-scaling-on-android
//to view a way to maintain and avoid zooming in
var scene;
var theShip;
var theBackground;
var levelTimer;
var getReadySplash;
var powerupShield;
var healthMeter;

var explosionSound;
var bonusSound;
var landedSound;
var thrustSound;
var bgMusic;

var paused = false;
var readyToSpawn = false;


var FONT_FAMILY= "Courier New";
var FONT_SIZE = 20; //in pixel size
var HEADER_COLOR = "#7777bb";
var NORMAL_COLOR = "#DDDDDD";
var HIGHLIGHT_COLOR = "#DDEEEE";
var FONT_COLOR = NORMAL_COLOR;
var SCREEN_COLOR = "#333333";
var MAX_WALLS = 15; //must be divisible by 3
var VERTICAL_WALL_SPACING = 5;
var LEVEL = 1;


//Image files
var SHIP_CENTER = "./img/nasa_center.png";
var SHIP_THRUSTING = "./img/nasa_thrusting.png";
var SHIP_LEFT = "./img/nasa_left.png";
var SHIP_RIGHT = "./img/nasa_right.png";
var SMOKE_IMG = "./img/Smoke10.png";
var ASTRONAUT_IMG = "./img/astronaut.png";
var METEOR_01_IMG = "./img/meteor_b1.png";
var METEOR_02_IMG = "./img/meteor_b2.png";
var METEOR_03_IMG = "./img/meteor_b3.png";
var METEOR_04_IMG = "./img/meteor_b4.png";
var METEOR_05_IMG = "./img/meteor_b5.png";
var ORELIA_IMG = "./img/earth.png";
var TRANSPARENT_IMG = "./img/image_transparent.png";
var BACKGROUND_IMG = "./img/bg_01.jpg";
var NOTEPAD_IMG = "./img/notepad.png";
var POWERUP_SHIELD_IMG = "./img/powerup_shield.png";

var HEALTHMETER_1_IMG = "./img/healthmeter_1.png";
var HEALTHMETER_2_IMG = "./img/healthmeter_2.png";
var HEALTHMETER_3_IMG = "./img/healthmeter_3.png";


//sound files
var EXPLOSION_SOUND_FILE = "./sound/explosion_02.ogg";
var BONUS_SOUND_FILE = "./sound/bonus_01.mp3";
var LANDED_SOUND_FILE = "./sound/bonus_02.wav";
var THRUST_SOUND_FILE = "./sound/thrust.wav";
var BACKGROUND_MUSIC_01 = "./sound/Kurevy_192001419_soundcloud.m4a";


var accel;
var joy;
var orelia; //planetorelia
var nextPlanetDistance = 1000;
var debugCounter = 0;
var mileage = 0;
var lastRecordedMileage = 0;
var wallManager;
var planetReachedTimer;
var enteredOrbit;

var livesRescued = 0;
var window_orientation = 90;
var smoke;


window.addEventListener("orientationchange", function() {

    window_orientation = window.orientation;

    var newWidth = window.innerWidth-50;
    var newHeight = window.innerHeight-50;

    if(newWidth > 800)
        newWidth = 800;
    if(newHeight > 600)
        newHeight = 600;

    if(scene){
        scene.setSize(newWidth, newHeight);
    }

}, false);

function advanceToNextLevel(){
    //var colors = ["#111111","#dddddd","#ee9999", SCREEN_COLOR];
    LEVEL++;
    VERTICAL_WALL_SPACING--;
    if(VERTICAL_WALL_SPACING < 1)
    {
        VERTICAL_WALL_SPACING = 1;
    }
    MAX_WALLS += 3;
    wallManager.addWalls(3);
    //TODO: change music
    //scene.setBG(colors[LEVEL%4]);
}


function getLastRecordedMileage(){
    return lastRecordedMileage;
}

function resetLevel(resetScore){
    getReadySplash.reset();
    levelTimer.reset();
    if(resetScore === true)
    {
        mileage = 0;
    }
    else{
        advanceToNextLevel();
    }


    nextPlanetDistance = 1000;
    wallManager.resetWalls();
    orelia.reset();
    theShip.init();
    //TODO: start crash scene
    enteredOrbit = false;
    livesRescued=0;
    astronaut.reset();
    smoke.reset();
    bgMusic.stop();
}

function init(){


    //virtKeys = true;
    scene = new Scene();
    scene.setBG(SCREEN_COLOR);

    smoke = new ParticleEngine(scene, SMOKE_IMG, 50, 7);

    //scene.setSize(800, 800);
    wallManager = new WallManager(scene);
    astronaut = new BonusItem(scene, ASTRONAUT_IMG);

    if(scene.touchable){
        accel = new Accel();
        joy = new Joy();
    }

    theBackground =  new Background(scene);

    /* TODO uncomment sounds later
    explosionSound = new Sound(EXPLOSION_SOUND_FILE);
    bonusSound = new Sound(BONUS_SOUND_FILE);
    landedSound = new Sound(LANDED_SOUND_FILE);
    thrustSound = new Sound(THRUST_SOUND_FILE);
    bgMusic = new Sound(BACKGROUND_MUSIC_01);
    //explosionSound.showControls();

    */


    getReadySplash = new GetReadySplash(scene, joy);
    theShip = new SpaceShip(scene, accel, joy, function(){ /*TODO play sound here*/});
    orelia = new Planet(scene, ORELIA_IMG);
    powerupShield = new ShieldPowerup(scene);
    healthMeter = new HealthMeter(scene);

    levelTimer = new Timer();
    planetReachedTimer = new Timer();

    scene.start();
    getReadySplash.init();
    theShip.init();
    theBackground.init();
    orelia.init();
    astronaut.init();

    wallManager.init(scene);
    smoke.init();
    powerupShield.init();
    healthMeter.init();

} // end init

function inOreliasOrbit(){
    return orelia.distanceTo(theShip) < theShip.cWidth/2 && orelia.y > 0;
}


function update(){
    scene.clear();

    //explosionSound.showControls();
    theBackground.update();


    if(inPlay()){
        //TODO sound bgMusic.play();
        //explosionSound.showControls();
        theShip.checkKeys();
        wallManager.checkWallsForBounds();


        theShip.checkGravity();
        astronaut.checkGravity();
        powerupShield.checkGravity();

        if(theShip.isPlaying() && inOreliasOrbit()){

            planetReachedTimer.reset();
            theShip.turnOffBoundsChecking();
            theShip.setMoveAngle( orelia.angleTo(theShip) );
            theShip.setImgAngle( orelia.angleTo(theShip) );
            theShip.setSpeed(10);

            if(orelia.collidesWith(theShip)){
                /* TODO sound
                landedSound.play();
                */
                resetLevel(false);
            }

        }else{

            theShip.displayText();

            if(theShip.isPlaying() && astronaut.hasBeenCollected() == false && theShip.collidesWith(astronaut)){

                astronaut.collectIt();
                /* TODO sound bonusSound.play();*/
                livesRescued++;
                //astronaut.setImage("./img/image_transparent.png");


            }

            theShip.checkForPowerUp(powerupShield, function(){
                powerupShield.reset();
                /* TODO sound bonusSound.play();*/
            });

            if(theShip.isPlaying()){
                wallManager.collidesWith(theShip, function(){
                    theShip.beginCrash();
                    wallManager.rattle();
                    theShip.rattle();
                    theBackground.rattle();
                    smoke.launch(theShip.x, theShip.y, 5);
                    playCrashSound();
                    //TODO sound bgMusic.stop();
                });
            }

            if(astronaut.hasBeenCollected()){
                theBackground.writeText(FONT_FAMILY, 20, FONT_COLOR, "RESCUED!", astronaut.x, astronaut.y);
            }

            wallManager.update();
        }




        //The ship does not die right away after it crashes
        //instead it has to go through the process
        if(theShip.isDead()){
            resetLevel(true);
        }


        //update all the sprites
        //update is actually the drawing
        //unlike other systesm that use draw for drawing
        //and update for updating position
        //In this case update is for drawing to the screen
        orelia.update();

        if(astronaut.getSpeed() > 0){
            astronaut.update();
        }

        updateScore();
        healthMeter.updateImage(theShip.getLives());
        healthMeter.update();
        healthMeter.displayText();

        powerupShield.update();
        theShip.update();
        theShip.updateThruster();
        smoke.update(theShip, 0, 0);





    }
    else{
        getReadySplash.update();
        showCountDown();
    }
}



function spawnOrelia (){
    debugCounter = 2;
    //theBackground.writeText"Arial", "30", "#ff0000", "Orelia Spawning", 10, 100);
    orelia.spawn();
    debugCounter = 3;
}

function spawnAstronaut(){
    debugCounter = 2;
    //theBackground.writeText"Arial", "30", "#ff0000", "Orelia Spawning", 10, 100);
    astronaut.spawn()();
    debugCounter = 3;
}

function updateScore(){

    var fontFamily = "Courier New";
    var fontSize = "20";
    var message = "distance: " + (Math.round(levelTimer.getTimeElapsed() * 10)).toString();
    mileage = Math.round(levelTimer.getTimeElapsed() * 10);

    //avoid getting mileage after it has been reset
    if(mileage != 0)
        lastRecordedMileage = mileage;

    //to keep astronaut from spawning back to back
    if(mileage % 99 == 0){
        readyToSpawn = true;
    }

    if(mileage > 200  && mileage < 300 && powerupShield.getSpeed() < 1){
        powerupShield.spawn();

    }

    if(mileage > 200 && mileage % 200 == 0 && readyToSpawn)
    {
        spawnAstronaut();
        readyToSpawn = false;
    }

    if(mileage > nextPlanetDistance){

        debugCounter = 1;
        nextPlanetDistance += 1000; //to prevent back to back spawn
        spawnOrelia();
    }

    theBackground.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, message, 10, 60);
    theBackground.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "level: " + LEVEL.toString(), 10, 80);
    theBackground.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "rescued: " + livesRescued.toString(), 10, 100);

}

function getAY(){
    if(accel){
        return accel.getAY();
    }

    return 0;
}

function getAX(){
    if(accel){
        return accel.getAX();
    }
    return 0;
}

function getAZ(){
    if(accel){
        return accel.getAZ();
    }

    return 0;
}


function playCrashSound(){
    /* TODO sound explosionSound.play(); */
}

function inPlay(){

    return getReadySplash.inPlay() && 90 == Math.abs(window_orientation);
}

function showCountDown(){
    var timeElapsed = levelTimer.getTimeElapsed();
    var message = (4 - Math.round(levelTimer.getTimeElapsed())).toString();

    theBackground.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, message, 350, 200);
}

init();
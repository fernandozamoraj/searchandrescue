var WALL_HEIGHT = 50;
var SPLASH_FONT_FAMILY = "Nova Square";





/******************************************************************

 GetReadySplash class
 Class for the splash screen

 ******************************************************************/
function GetReadySplash(scene, virtualJoystick){

    var tempSplash = new EnhancedSprite(scene, NOTEPAD_IMG, 800, 300);
    var isInPlay = false;

    tempSplash.init = function(){
        this.setX(this.cWidth/2 );
        this.setY(this.cHeight/2);
        this.setSpeed(0);
        isInPlay = false;
        //this.setMoveAngle(180);
    };

    tempSplash.reset = function(){
        this.init();
    };

    tempSplash.realUpdate = tempSplash.update;

    tempSplash.update = function(){

        var yStartPosition = 100;
        var lineSpacing = 30;
        this.writeText(SPLASH_FONT_FAMILY, "40", HEADER_COLOR, "Space Search and Rescue", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", HIGHLIGHT_COLOR, "GET READY!!!!", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "You must be in Landscape Mode on mobile devices.", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Swipe anywhere or press S on your keyboard to play", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Use the keyboard left, right and up arrow keys to move", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "On Mobile - Tilt to move left and right", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "and swipe up anywhere on the screen to ascend.", 50, yStartPosition+=lineSpacing);

        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Kilometers (1000's): " + getLastRecordedMileage().toString(), 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Avoid the meteors.", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Rescue all stranded astronauts.", 50, yStartPosition+=lineSpacing);
        this.writeText(SPLASH_FONT_FAMILY, "20", NORMAL_COLOR, "Your mission is to reach planet Orelia (1,000km away)", 50, yStartPosition+=lineSpacing);

        if(virtualJoystick){
            if(virtualJoystick.getDiffY() != 0 || virtualJoystick.getDiffX() != 0){
                this.putInPlay();
            }
        }

        if(keysDown[K_S]){
            this.putInPlay();
        }

        this.realUpdate();
    };

    tempSplash.inPlay = function(){
        return isInPlay;
    };

    tempSplash.putInPlay = function(){
        isInPlay = true;
    };

    return tempSplash;
}

/******************************************************************

 Background Class
 Class for the wall logic

 ******************************************************************/
function Background(scene){

    var sprite = new EnhancedSprite(scene, BACKGROUND_IMG, 800, 600);

    sprite.init = function(){
        this.setX(this.cWidth/2 );
        this.setY(this.cHeight/2);
        this.setSpeed(0);
        this.width = this.cWidth;
        this.height = this.cHeight;
        //this.setMoveAngle(180);
    };

    return sprite;
}

/******************************************************************

 Orelia Class
 Class for the planet logic

 ******************************************************************/
function Planet(scene, planetFile){

    var sprite = new EnhancedSprite(scene, planetFile, 50, 50);

    sprite.init = function(){

        //allows sprite to go off screen
        this.setBoundAction(CONTINUE);
        this.setPosition(200, -200);
        this.setSpeed(0);
        this.setMoveAngle(180);
    };

    sprite.reset = function(){
      this.init();
    };

    sprite.spawn = function(){
        this.setPosition(200, 0);
        this.setMoveAngle(180);
        this.setSpeed(1);
    };

    return sprite;
}

/******************************************************************

 Bonus Item Class
 Class for the planet logic

 ******************************************************************/
function BonusItem(scene, imagePath){

    var sprite = new EnhancedSprite(scene, imagePath, 60, 50);
    var collected = false;


    //intended to be executed whenever this item is collected
    //the image changes to a transparent image so that the itme
    //dissapears
    sprite.collectIt = function(){
        collected = true;
        this.changeImage(TRANSPARENT_IMG);
    };

    sprite.hasBeenCollected = function(){

        return collected;
    };

    sprite.init = function(){


        var xPosition = Math.random() * (scene.cWidth - 200);

        collected = false;
        //this.setImage(imagePath);
        //allows sprite to go off screen
        this.setBoundAction(CONTINUE);
        this.setPosition(xPosition, -200);
        this.setSpeed(0);
        this.setMoveAngle(180);
    };

    sprite.reset = function(){
        this.init();
    };

    sprite.spawn = function(){

        var xPosition = Math.random() * 500  + 100;

        this.changeImage(imagePath);
        collected = false;
        this.setPosition(xPosition, -100);
        this.setMoveAngle(180);
        this.setSpeed(2);
    };

    sprite.checkGravity = function(){
        this.changeImgAngleBy(5);

        if(this.y >= this.cHeight){
            this.reset();
        }
    };

    return sprite;
}

function ShieldPowerup(scene){

    var bonusItem = new BonusItem(scene, POWERUP_SHIELD_IMG);

    bonusItem.checkGravity = function(){
        if(bonusItem.y >= this.cHeight){
            bonusItem.reset();
        }
    };

    return bonusItem;
}


/******************************************************************

 Wall Class
 Class for the wall logic

 ******************************************************************/
function Wall(scene){


    var wallNames = [METEOR_02_IMG, METEOR_02_IMG, METEOR_03_IMG, METEOR_04_IMG, METEOR_05_IMG];
    var imageIndex = Math.floor(Math.random()*5);
    var widths = [100, 92, 80, 70, 54];
    var tempWall = new EnhancedSprite(scene, wallNames[imageIndex], widths[imageIndex], WALL_HEIGHT);
    var angles = [-12,-8,-4,4,8,12];
    var _angle = angles[Math.floor(Math.random()*5)];

    tempWall.getWallHeight = function(){
        return WALL_HEIGHT;
    };

    tempWall.init = function(){

        var MIN_WIDTH = this.cWidth/20;
        var MAX_WIDTH = this.cWidth/15;

        var width = Math.random() * (4*MIN_WIDTH) + MIN_WIDTH;
        var xPosition = Math.random() * this.cWidth + width/2;

        //allows sprite to go off screen
        this.setBoundAction(CONTINUE);
        //this.width = width;
        this.setX(xPosition);
        this.setSpeed(3);
        this.setMoveAngle(180);
        this.setImgAngle(90);
        //this.changeImgAngleBy(Math.floor(Math.random()*50)-25);
    };

    tempWall.myUpdate = tempWall.update;

    tempWall.update = function(){


        tempWall.changeImgAngleBy(_angle);
        tempWall.myUpdate();
    };

    tempWall.tooCloseToOtherWall = function(sprite){
        //check for collision with another sprite

        var divisor = 2;

        //collisions only activated when both sprites are visible
        var collision = false;
        if (this.visible){

            if (sprite.visible){
                //define borders
                myLeft = this.x - (this.width / divisor);
                myRight = this.x + (this.width / divisor);
                myTop = this.y - (this.height / divisor);
                myBottom = this.y + (this.height / divisor);
                otherLeft = sprite.x - (sprite.width / divisor);
                otherRight = sprite.x + (sprite.width / divisor);
                otherTop = sprite.y - (sprite.height / divisor);
                otherBottom = sprite.y + (sprite.height / divisor);

                //assume collision
                collision = true;

                //determine non-colliding states
                if ((myBottom < otherTop) ||
                    (myTop > otherBottom) ||
                    (myRight < otherLeft) ||
                    (myLeft > otherRight)) {
                    collision = false;
                } // end if

            } // end 'other visible' if
        } // end 'I'm visible' if

        return collision;
    };


    tempWall.repositionOnBoundsCheck = function(){

        var xPosition = Math.random() * this.cWidth + 100;

        if(this.y > 600){

            this.setX( xPosition );
            this.setY(-600);
            this.setImgAngle(90);
            this.setSpeed(Math.floor(Math.random()*7+2));
            //this.changeImgAngleBy(Math.floor(Math.random()*30)-15);
        }
    };

    return tempWall;
}

/********************************************************************
 *
 * WallManager
 *
 * Originally it was intended to have walls and the later they were
 * they simply became the meteor obstacles but I just haven't gotten
 * around to renaming them.
 *
 *******************************************************************/
function WallManager(scene){

    //TODO: put all configurable settings in one file called settings js
    var walls = [];

    //TODO: this needs to be fixed... the spacing on the last wall collides with the next wall...
    var WALL_START_POSITION = (((VERTICAL_WALL_SPACING*(MAX_WALLS)/3)+1)*WALL_HEIGHT)*(-1); //start off screen

    var MIN_HORIZONTAL_SPACING = 100;

    this.init = function(scene){

        for(i=0;i<MAX_WALLS;i++){

            walls[i] = new Wall(scene);
            walls[i].init();
        }

        this.resetWalls();
    };

    //This method makes all the walls move left and then right and then left...
    //creating a rattle effect.
    //THe rattle effect gives a more shocking effect when the ship crashes
    this.rattle = function(){
        for(i=0;i<MAX_WALLS;i++){
            walls[i].rattle();
        }
    };

    this.addWalls = function(count){
        for(i=0;i<count;i++){

            var wall = new Wall(scene);
            walls.push(wall);
            wall.init();
        }
    };

    this.resetWalls = function() {

        var yPosition = WALL_START_POSITION;
        var i = 0;
        var j = 0;

        for (i = 0; i < MAX_WALLS;) {
            for (j = 0; j < 3; j++) {
                walls[i].setY(yPosition);
                i++;
            }

            yPosition += (walls[0].getWallHeight() * VERTICAL_WALL_SPACING);
        }

        this.spaceOutWalls();
    };

    //This method is avid the walls touching each other horizontally
    //this way there is alway some minimun space in between the walls.
    this.spaceOutWalls = function(){


        var i = 0;

        //realign walls so that they don't touch each other horizontally
        for(i =0; i < MAX_WALLS; i+=3){

            var wall1 = walls[i];
            var wall2 = walls[i+1];
            var wall3 = walls[i+2];
            var cWidth = wall1.cWidth;

            if(wall2.tooCloseToOtherWall(wall1)){
                wall2.x = (wall1.x + (wall1.width/2) + MIN_HORIZONTAL_SPACING) % cWidth;
            }

            if(wall3.tooCloseToOtherWall(wall2)){
                wall3.x = (wall2.x + (wall2.width/2) + MIN_HORIZONTAL_SPACING) % cWidth;
            }

            if(wall3.tooCloseToOtherWall(wall1)){
                wall1.x = (wall3.x + (wall3.width/2) + MIN_HORIZONTAL_SPACING) % cWidth;
            }

        }

    };

    this.checkWallsForBounds = function(){
        var i = 0;

        for(i =0; i < MAX_WALLS; i++){
            walls[i].repositionOnBoundsCheck();
        }

        this.spaceOutWalls();

    };

    this.update = function(){
        var i = 0;

        for(i =0; i < MAX_WALLS; i++){
            walls[i].preUpdate();
            walls[i].update();
        }

    };

    this.collidesWith = function(otherSprite, onCollisionCallback){

        var i = 0;
        for(i = 0 ; i < MAX_WALLS; i++){

            if(walls[i].collidesWith(otherSprite)){
                onCollisionCallback();
            }
        }
    };
}

function HealthMeter(scene){

    var sprite = new EnhancedSprite(scene, HEALTHMETER_1_IMG, 138, 23);
    var previousLives = 1;

    sprite.init = function(){
        this.setPosition(80, 200);
        this.setSpeed(0);
    };

    sprite.updateImage =  function(lives){
        if(previousLives != lives){
            previousLives = lives;
            if(lives === 1){
                this.setImage(HEALTHMETER_1_IMG);
            }
            else if(lives === 2){
                this.setImage(HEALTHMETER_2_IMG);
            }
            else if(lives >= 3){
                this.setImage(HEALTHMETER_3_IMG);
            }
            else{
                this.setImage(HEALTHMETER_1_IMG);
            }
        }
    };

    sprite.displayText = function(){
        this.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "health", this.x - 68, this.y - 20);
    }


    return sprite;
}

/******************************************************************

 SpaceShip Class
 Class for the spaceship logic

 ******************************************************************/
function SpaceShip(scene, accel, j, thrustSound){

    var accelerometer = accel;
    var joystickVirtual = j;
    var tempSpaceShip = new EnhancedSprite(scene, SHIP_CENTER, 45, 50);
    var thrusterSmoke = new ParticleEngine(scene, SMOKE_IMG, 10, 5);
    var START_Y_POSITON  = 500;
    var MIN_SPEED = 1;
    var previousKeyLeft = false;
    var previousKeyRight = false;
    var boundsChecking = true;
    var crashSequenceTimer = new Timer();
    var currentState;
    var CRASHING_STATE = 0;
    var PLAYING_STATE = 1;
    var DEAD_STATE = 2;
    var thrusterTimer = 0;
    var THRUSTER_WAIT_FRAMES = 10;
    var currentShipImage = SHIP_CENTER;
    var lives = 1;
    var text = "foo";
    var lastCrashTimer = 0;


    crashSequenceTimer.start();

    tempSpaceShip.getLives = function(){
       return lives;
    };

    tempSpaceShip.beginCrash = function(){

        if(lastCrashTimer >= 20){
            lastCrashTimer = 0;
            lives--;
        }

        if(currentState == PLAYING_STATE && lives < 1){
            this.addVector(0, 8);
            currentState = CRASHING_STATE;
            this.turnOffBoundsChecking();

            crashSequenceTimer.reset();
        }
    };

    tempSpaceShip.isDead = function(){
        return currentState == DEAD_STATE;
    };

    tempSpaceShip.isPlaying = function(){
        return currentState == PLAYING_STATE;
    };

    tempSpaceShip.init = function(){

        lives = 2;
        currentState = PLAYING_STATE;
        this.setBoundAction(CONTINUE);
        this.setImgAngle(90);
        this.setSpeed(MIN_SPEED);
        this.setY(START_Y_POSITON);
        this.turnOnBoundsChecking();

        thrusterSmoke.init();
        thrusterSmoke.setMoveAngle(180);
        thrusterSmoke.setSpeed(5);

    };

    tempSpaceShip.turnOffBoundsChecking = function(){
        boundsChecking = false;
    };

    tempSpaceShip.turnOnBoundsChecking = function(){
        boundsChecking = true;
    };


    //overrides the checkBounds
    //keep shit within screen bounds
    tempSpaceShip.checkBounds = function(){

        if(boundsChecking == false)
            return;

        var leftBound = 10 + this.width/2;
        var rightBound = this.cWidth - (this.width/2 + 10);
        var topBound = 50;
        var bottomBound = this.cHeight - this.height; // (this.height/2 + 10);

        //bottom is set to 2/3 screen because of differences in mobile devices
        //otherwise theship at the bottom can't be seen

        if(this.y < topBound){
            this.y = topBound;
            this.dy = 0; //remove any vector acceleration
        }

        if(this.y > bottomBound){
            this.y = bottomBound;
            this.dy = 0; //affected by gravity
        }

        if(this.x < leftBound){
            this.x = leftBound;
            this.dx = 0; //remove any vector acceleration
        }

        if(this.x > rightBound){
            this.x = rightBound;
            this.dx = 0; //remove any vector acceleration
        }

    };

    tempSpaceShip.checkGravity = function(){

        if(lastCrashTimer < 1000){
            lastCrashTimer++;
        }

        this.addVector(180,.3);
        if(currentState == CRASHING_STATE) {

            this.addVector(180, 1);

            if(lives < 1){
                this.changeImgAngleBy(20);
            }

            if(crashSequenceTimer.getElapsedTime() > 4){
                currentState = DEAD_STATE;
            }
        }
    };

    tempSpaceShip.checkForPowerUp = function(powerupSprite, callback){
        if(powerupSprite.collidesWith(tempSpaceShip)){
            callback();
            lives++;
            text = "lives: " + lives.toString();
        }
    };

    tempSpaceShip.updateThruster = function(){
      thrusterSmoke.update(this, 0, this.height/2);
    };

    tempSpaceShip.displayText = function(){
        text = "lives: " + lives.toString();
        tempSpaceShip.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, text, this.x - 25, this.y - 35);
    };

    tempSpaceShip.checkKeys = function(){


        var newDx = 0;
        var newDy = 0;
        var LANDSCAPE_PRIMARY = 90;
        var LANDSCAPE_SECONDARY = -90;
        var PORTRAIT_PRIMARY = 0;
        var tempShipImage = SHIP_CENTER;
        var TILT_THRESHOLD = 1;


        thrusterTimer--;

        if(accelerometer){

            newDx = accelerometer.getAY();
            if(window_orientation === LANDSCAPE_PRIMARY){
                newDx = accelerometer.getAY();
            }
            else if(window_orientation === -LANDSCAPE_SECONDARY){
                newDx =accelerometer.getAY() * -1; //flip it
            }else if(window_orientation === PORTRAIT_PRIMARY){
                newDx =  Math.abs(accelerometer.getAY() ) - 9; //4.5 is the dx in portrait mode
            }
            else{
                newDx = 9 - Math.abs(accelerometer.getAY() );
            }

            /* //Debugging code: TODO:Investigate portrait mode fix... seems that there is no fix
            //when it goes past -10 or 10 it flips over causing all kinds of crazyness
            this.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "AY: " + accelerometer.getAY().toString(), this.x, this.y);
            this.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "AX: " + accelerometer.getAX().toString(), this.x, this.y+25);
            this.writeText(FONT_FAMILY, FONT_SIZE, FONT_COLOR, "AZ: " + accelerometer.getAZ().toString(), this.x, this.y+50);
            */
        }

        if(joystickVirtual){
            newDy = joystickVirtual.getDiffY();
        }

        tempShipImage = SHIP_CENTER;


        var addedGravityOnMobile = Math.abs(newDx)*.2;



        if(keysDown[K_LEFT] || newDx > TILT_THRESHOLD)
        {
            tempShipImage = SHIP_LEFT;
            this.addVector(270,1+addedGravityOnMobile);
        }


        if(keysDown[K_RIGHT] || newDx < -(TILT_THRESHOLD)){

            tempShipImage = SHIP_RIGHT;

            this.addVector(90,1 + addedGravityOnMobile);
        }

        //set a max DX
        if(this.dx < -7)
            this.dx = -7;
        if(this.dx > 7)
            this.dx = 7;


        if(keysDown[K_UP] || newDy != 0){
            //handle events here
            //sprite1.changeImgAngleBy(5);
            //this.setMoveAngle(0);

            //this.setSpeed(MIN_SPEED*6);
            tempShipImage = SHIP_THRUSTING;

            this.addVector(0, 2);
            thrustSound.play();

            previousKeyLeft = false;
            previousKeyRight = false;

            if(thrusterTimer <= 0){
                thrusterSmoke.launch(this.x, this.y+(this.height*2), 3);
                thrusterTimer = THRUSTER_WAIT_FRAMES;
            }

        }

        //only swap the image when necessary
        //otherwise you can get performance issues
        //such as flickering
        if(!(tempShipImage == currentShipImage)){

            this.changeImage(tempShipImage);
        }

        currentShipImage = tempShipImage;

        if(keysDown[K_DOWN] || newDy > 0){
            //handle events here
            //sprite1.changeImgAngleBy(5);
           // this.addVector(180, 3);

            previousKeyLeft = false;
            previousKeyRight = false;

        }
    };

    return tempSpaceShip;
}
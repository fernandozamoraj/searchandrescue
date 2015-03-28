        //TODO:  
        //      Provide men to rescue
        //      provie points
        ///     add level music
        //      add ship count on screen
        //      fix get ready screen and add count down
        /******************************************************************
         
         Extension for the Sprite class
         This class provides functionality that I need

         1. Improved RectangleCollision
         2. Provides writing text to a sprite

        ******************************************************************/
        function EnhancedSprite(scene, fileName, width, height){

            var enhancedSprite = new Sprite(scene, fileName, width, height);
            var paused = false;
            var rattleTimer = 100;
            var prevX = 0;
            var prevY = 0;
            var prevMoveAngle = 0;
            var prevSpeed = 0;
            var RATTLE_FRAMES = 5;
            var xOffset = 20;

            enhancedSprite.rattle = function(){
                if(rattleTimer > RATTLE_FRAMES){
                    rattleTimer = 0;
                    prevX = this.x;
                    prevY = this.y;
                    prevMoveAngle = this.getMoveAngle();
                    prevSpeed = this.getSpeed();

                }
            };

            enhancedSprite.isRattling = function(){
                return rattleTimer <= RATTLE_FRAMES;
            };

            enhancedSprite.pause = function(){
                paused = true;
            };

            enhancedSprite.resume = function(){
                paused = false;
            };

            enhancedSprite.preUpdate = function(){


                if(this.isRattling()){

                    xOffset = xOffset*(-1);
                    this.setPosition(this.x + xOffset, this.y);

                    rattleTimer++;
                }
            };


            //override update
            enhancedSprite.realUpdate = enhancedSprite.update;

            enhancedSprite.update = function(){

                if(!paused){
                    this.realUpdate();
                }
            };


            //fontFamily: e.g. "Arial"
            //fontSize: in pixels e.g. 30
            //fontColor: hex value e.g. "#ff00dd"
            //textValue: "GAME OVER"
            //x and y positions
            enhancedSprite.writeText = function(fontFamily, fontSize, fontColor, textValue, x, y){
                //var c = document.getElementById("myCanvas");
                //var ctx = c.getContext("2d");
                this.context.font = fontSize.toString() + "px " + fontFamily; //"30px Arial";
                this.context.fillStyle = fontColor;
                this.context.fillText(textValue, x, y);
            };

            //override collidesWith
            //this collidesWith reduces the collision area in half
            //          --------------------
            //         |                    |
            //         |     ----------     |
            //         |     |         |    |
            //         |     |_________|    |
            //         |                    |
            //         _____________________   
            enhancedSprite.collidesWith = function(sprite){
                //check for collision with another sprite
                
                var divisor = 3;

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

            return enhancedSprite;
        }

        /******************************************************************

         Particle Engine
         Class for the wall logic

         ******************************************************************/
        function ParticleEngine(scene, particleImage, width, particleCount){

            var particles = [];
            var rotationAngles = [];
            var currentParticle = particleCount+1; //to avoid updating on init
            var spawnTimer = 0;
            var moveAngle = -1;
            var moveSpeed = 5;

            this.setMoveAngle = function(angle){
                moveAngle = angle;
            };

            this.setSpeed = function(speed){
                moveSpeed = speed;
            };

            //DO NOT call this function more than once
            this.init = function(){
                var i = 0;
                var particleSprite;
                var cloudSize = width * 4;

                for(i = 0; i < particleCount ; i++){

                    cloudSize = cloudSize * 1.05;

                    particleSprite = new EnhancedSprite(scene, particleImage, cloudSize, cloudSize);
                    rotationAngles[i] = Math.random() * 10 - 5;
                    particles[i] = particleSprite;
                }

                this.reset();
            };

            this.reset = function(){
                var i = 0;
                var particleSprite;

                for(i = 0; i < particleCount ; i++){

                    particleSprite = particles[i];

                    particleSprite.setBoundAction(CONTINUE);
                    particleSprite.setMoveAngle(0);
                    particleSprite.setSpeed(0);
                    particleSprite.setPosition(300, -300);
                }

            };

            this.launch = function(x, y, maxSpeed){
                var i = 0;

                currentParticle = 0;
                spawnTimer = 0;

            };



            this.update = function(trailingSprite, distX, distY){
                var i = 0;

                if(spawnTimer === 2 && currentParticle < particleCount){
                    currentParticle++;
                    particles[currentParticle].setPosition(trailingSprite.x+distX, trailingSprite.y+distY);

                    if(moveAngle > -1){
                        particles[currentParticle].setMoveAngle(moveAngle);
                    }
                    else{
                        particles[currentParticle].setMoveAngle((Math.random() * 14));
                    }

                    particles[currentParticle].setSpeed(moveSpeed);

                    spawnTimer = 0;
                }

                spawnTimer++;

                for(i = 0; i < currentParticle && i < particleCount ; i++){

                    particles[i].changeImgAngleBy(rotationAngles[i]);
                    particles[i].update();
                }
            };
        }
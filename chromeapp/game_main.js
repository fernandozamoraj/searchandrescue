/**
 * Created by mac on 4/6/15.
 */
var scene;
var meteor;


function init(){
    scene = new Scene();
    scene.setBG("#000000");

    var fileName = "meteor_b1.png";
    var width = 100;
    var height = 50;

    meteor = new Sprite(scene, fileName, width, height);

    scene.start();

    meteor.setX(300);
    meteor.setY(300);
    meteor.setAngle(90);
    meteor.setSpeed(10);
    //meteor.setBoundAction(CONTINUE);
}

function update(){
    scene.clear();
    meteor.update();

}

init();
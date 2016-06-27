var numJoints = 5;
var jointThickness = 1.1;
var jointHeight = 0.01;
var jointSpacing = 2;
var shootColor = 0x99CC00;
var jointColor = 0xCCCC66;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(getRandom(min, max));
}

/* Creates a stalk of bamboo
    radius: Thickness of the bamboo at the base
    height: Height of the stalk
*/
function bambooFactory( radius, height, x, y) {

    var stalk = new THREE.Object3D();

    //Create the "shoot", the plant without the joints
    var shootGeometry = new THREE.CylinderGeometry( radius, radius, height, 32, 1, true );
    var shootMaterial = new THREE.MeshPhongMaterial( {color: shootColor} );
    shootMaterial.side = THREE.DoubleSide;
    var shootMesh = new THREE.Mesh( shootGeometry, shootMaterial );
    //Rotate shoot so that it is standing up
    shootMesh.rotation.x =  Math.PI / 2;
    //Raise it so that the bottom is level with the sand
    shootMesh.position.z = height/2;
    shootMesh.position.x = x;
    shootMesh.position.y = y;


    //Start the joints one "jointSpacing" length up the shoot. That is, we do
    //not want a joint at the bottom of the stalk
    var jointStart = jointSpacing;

    //Create the joints
    while (height > jointStart) {
    
        //Generate joint properties with shoot properties * modifiers
        var jointGeometry = new THREE.CylinderGeometry( radius * jointThickness, radius * jointThickness, height * jointHeight, 32, 5, false );
        var jointMaterial = new THREE.MeshPhongMaterial( {color: jointColor} );
        var jointMesh = new THREE.Mesh( jointGeometry, jointMaterial );
        //Rotate joint so that it is upright
        jointMesh.rotation.x =  Math.PI / 2;
        jointMesh.position.x = x;
        jointMesh.position.y = y;
        jointMesh.position.z = jointStart;

        //Add it to the group
        stalk.add(shootMesh);
        stalk.add(jointMesh);
        
        jointStart+= jointSpacing;
    }

    return stalk;
    
}

function isColliding(x, y, radius, bamboo){
    for (var i = 0; i < bamboo.children.length; i++) {
        if (Math.pow(x - bamboo.children[i].children[0].position.x, 2) + Math.pow(y - bamboo.children[i].children[0].position.y, 2) < Math.pow(radius * 2, 2)) {
            return true;
        }
    }
    return false;
}

function generateBamboo(radius, height){
    var x = 0;
    var y = 0;
    var bamboo = new THREE.Object3D();
    
    for (var i = 0; i < 15; i++) {
        var deltaX = x + (getRandomInt(-1, 2) * getRandom(0, radius * 2));
        var deltaY = y + (getRandomInt(-1, 2) * getRandom(0, radius * 2));

        while (isColliding(deltaX, deltaY, radius, bamboo)) {
            deltaX = x + (getRandomInt(-1, 2) * getRandom(0, radius * 2));
            deltaY = y + (getRandomInt(-1, 2) * getRandom(0, radius * 2));
        }
        x = deltaX;
        y = deltaY;
        var stalk = bambooFactory(radius, height, x, y);
        bamboo.add(stalk);
    }
    return bamboo;    
}
var camera, controls, scene, renderer, clock;

var environment = {};
var tick = 0;

init();
render();
animate();

function init() {

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.015 );

    camera = new THREE.PerspectiveCamera( 45,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    camera.position.set( 0, -50, 20 );
    camera.lookAt( scene.position );

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );
 	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;

    controls = new THREE.OrbitControls( camera );
    var angleOffset = Math.PI / 32;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.minPolarAngle = 0 + angleOffset;
    controls.maxPolarAngle = Math.PI - angleOffset;
    controls.minAzimuthAngle = -Math.PI / 2 + angleOffset;
    controls.maxAzimuthAngle = Math.PI / 2 - angleOffset;
    controls.addEventListener( 'change', render );

    // controls = new THREE.TrackballControls( camera, renderer.domElement );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    createEnvironment( 50, 50, 2 );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    var delta = clock.getDelta();
    render();

    tick++;

    updateLanterns();

    controls.update();

    requestAnimationFrame( animate );

}

function render() {

    renderer.render( scene, camera );

}

function initializeLights() {

    var sceneLight = new THREE.HemisphereLight( 0xdddddd, 0x202020, .1 );

    var lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );
    lamp.position.set( 0, 10, 30 );
    lamp.castShadow = true;

    scene.add( sceneLight );
    scene.add( lamp );

    environment.hemiLight = sceneLight;
    environment.lamp = lamp;

}

function generateRock() {
    var width = environment.width;
    var height = environment.height;

    var x = Math.floor( Math.random() * 6 + 3 );
    var y = Math.floor( Math.random() * 6 + 3 );
    var z = Math.floor( Math.random() * 6 + 1 );


    var rock = ClusterFactory( SpireRockFactory, x, y, z );

    rock.position.x = peturb( rock.position.x, width - 2 * x );
    rock.position.y = peturb( rock.position.y, height - 2 * y );
    rock.position.z += z / 2 - 0.5;
    rippleSand( 3 * Math.sqrt( x * x + y * y ) / 4, rock );

    scene.add( rock );
}

function createEnvironment( width, height, depth ) {

    environment.width = width;
    environment.height = height;
    environment.depth = depth;

    initializeLights();


    createSand( width, height );
    createBase( width, height, depth );

    generateRock();

    while ( Math.random() > 0.3 ) {
        generateRock();
    }

    var chance = 0;
    while ( Math.random() > chance ) {
        var dim = 3;
        var lantern = lanternFactory( dim, dim, 3 );
        lantern.position.x = peturb( lantern.position.x, width - 1 );
        lantern.position.y = peturb( lantern.position.y, height - 1 );
        lantern.position.z += depth * 2;

        scene.add( lantern );

        chance += 0.5;
    }

}

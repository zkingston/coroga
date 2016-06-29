var camera, controls, scene, renderer, clock;

var environment = {};
var tick = 0;

init();
render();
animate();

function init() {

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.01 );

    camera = new THREE.PerspectiveCamera( 45,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    camera.up = new THREE.Vector3( 0, 0, 1 );
    camera.position.set( -60, -60, 30 );
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
    controls.maxPolarAngle = Math.PI / 2 - angleOffset;
    controls.addEventListener( 'change', render );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    createEnvironment( 70, 50, 2 );

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
    updateMoths();
    updateWalls();

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

    rock.position.x = peturb( rock.position.x, width - 3 * x );
    rock.position.y = peturb( rock.position.y, height - 3 * y );
    rock.position.z += z / 2 - 0.5;

    var base = ClusterBaseFactory( rock );

    rippleSand( 3 * Math.sqrt( x * x + y * y ) / 4, rock );

    scene.add( rock );
}

function createEnvironment( width, height, depth ) {

    environment.width = width;
    environment.height = height;
    environment.depth = depth;
    environment.radius = Math.sqrt( height * height / 4 + width * width / 4 );

    initializeLights();

    createSand( width, height );
    createWalls( width, height, 15 );

    generateRock();

    while ( Math.random() > 0.3 ) {
        generateRock();
    }

    var lanterns = [ { x : width / 2 - 2, y : -height / 2 + 2 },
                     { x : -width / 2 + 2, y : height / 2 - 2 } ];
    for ( var i = 0; i < lanterns.length; i++ ) {
        var dim = 3;
        var lantern = lanternFactory( dim, dim, 3 );
        lantern.position.x = lanterns[i].x;
        lantern.position.y = lanterns[i].y;
        lantern.position.z += depth * 2;

        var moth = mothFactory( lantern );

        scene.add( lantern );
        scene.add( moth );
    }


    tree = treeFactory();
    scene.add(tree);

    createBiomeMatrix();

}

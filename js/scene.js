var camera, controls, scene, renderer;

var tick = 0;

init();
render();
animate();

function init() {

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    scene.fog = new THREE.Fog(0xece9ca, 500, 2000);

    camera = new THREE.PerspectiveCamera( 45,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    camera.position.set( 0, -30, 20 );
    camera.lookAt( scene.position );

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );
 	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    initializeLights();
    createEnvironment( Math.random() * 20 + 10, Math.random() * 30 + 10, 2 );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    render();
    tick++;
    controls.update();
    requestAnimationFrame( animate );

}

function render() {

    renderer.render( scene, camera );

}

function initializeLights() {

    var sceneLight = new THREE.HemisphereLight(0xdddddd, 0x202020, .1);

    var lamp = new THREE.DirectionalLight(0xdddddd, 1);
    lamp.position.set(0, 10, 30);
    lamp.castShadow = true;
    lamp.shadowDarkness = .5;

    var light = new THREE.DirectionalLight(0xdddddd, 1);
    light.position.set(-10, -10, 0);
    light.castShadow = true;
    light.shadowDarkness = .5;

    scene.add( sceneLight );
    scene.add( lamp );
    scene.add( light );

}

function createEnvironment( width, height, depth ) {

    var sand = createSand( width, height );
    var base = createBase( width, height, depth );

    var rock = basicRockFactory( 3, 2, 2 );
    rock.position.z -= depth / 2;

    var lantern = lanternFactory( 3, 3, 3, 3 );
    lantern.position.z += 5;

    scene.add( sand );
    scene.add( base );
    scene.add( rock );
    scene.add( lantern );

}

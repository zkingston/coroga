var camera, controls, scene, renderer, clock, stats;

var environment = {};
var tick = 0;

var nightMode = false;

function nightModeSet(value) {
    nightMode = value;
}

init();
render();
animate();

function createUI() {
    stats = new Stats();
    stats.showPanel( 0 );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.display = 'none';
    stats.domElement.style.margin = '10px 15px auto';
    document.body.appendChild( stats.domElement );

    UIaddElement( new CRGButton( 'Regenerate', function ( btn ) {
        createEnvironment( 70, 50, 2 );
    }));

    var tools = new CRGDropdown( 'Tools' );
    tools.addElement( new CRGDropdownButton( 'Show FPS', function( btn ) {
        if (stats.domElement.style.display === 'none') {
            stats.domElement.style.display = 'block';
            btn.setTextNode( 'Hide FPS' );
        } else {
            stats.domElement.style.display = 'none';
            btn.setTextNode( 'Show FPS' );
        }
    }));

    UIaddElement( tools );

    UIgenerate();
}

function init() {

    createUI();

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera( 45,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    camera.up = new THREE.Vector3( 0, 0, 1 );
    camera.position.set( -60, -60, 30 );
    camera.lookAt( 0, 0, 0 );

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );
 	renderer.setPixelRatio( window.devicePixelRatio );

    if (nightMode) {
        renderer.setClearColor( 0x001331, 1 );
    }
    else {
        renderer.setClearColor( 0xaaccff, 1 );
    }
    renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;

    controls = new THREE.OrbitControls( camera );
    var angleOffset = Math.PI / 32;
    controls.minDistance = 5;
    controls.maxDistance = 500;
    controls.minPolarAngle = 0 + angleOffset;
    controls.maxPolarAngle = Math.PI / 2 - angleOffset;
    controls.addEventListener( 'change', render );

    container = document.getElementById( 'canvas' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    createBase( 70, 50, 2 );
    createEnvironment( 70, 50, 2 );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {
    stats.begin();

    render();

    tick++;
    scene.update();
    controls.update();

    stats.end();

    requestAnimationFrame( animate );
}

function render() {
    renderer.render( scene, camera );
}

function initializeLights() {
    var sceneLight = new THREE.HemisphereLight( 0xc2c2dd, 0x40c2c2, .1 );
    scene.add( sceneLight );
    environment.hemiLight = sceneLight;

    if (nightMode) {
        var lamp = new THREE.DirectionalLight( 0x292929, 0.5 );
    }
    else {
        var lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );
    }
    lamp.position.set( 0, 10, 30 );
    lamp.castShadow = true;
    scene.add( lamp );
    environment.lamp = lamp;
}

function generateRock() {
    var width = environment.width;
    var height = environment.height;

    var x = Math.floor( rand() * 6 + 3 );
    var y = Math.floor( rand() * 6 + 3 );
    var z = Math.floor( rand() * 6 + 2 );

    var rock = RockClusterFactory( SpireRockGeometry, x, y, z );
    rock.addToObject( environment.sand,
                      randOffset( 0, width - 3 * x ),
                      randOffset( 0, height - 4 * y ),
                      z / 2 - 0.5);

    rippleSand( 2, rock );
}


function createBase( width, height, depth ) {
    if (nightMode) {
        renderer.setClearColor( 0x001331, 1 );
    }
    else {
        renderer.setClearColor( 0xaaccff, 1 );
    }

    scene = new THREE.Scene();
    if (nightMode) {
        scene.fog = new THREE.FogExp2( 0x001331, 0.0025 );
    }
    else {
        scene.fog = new THREE.FogExp2( 0xaaccff, 0.005 );
    }

    environment.width = width;
    environment.height = height;
    environment.depth = depth;
    environment.radius = Math.sqrt( height * height / 4 + width * width / 4 );

    initializeLights();

    createWalls( width, height, 15 );

    var lanterns = [ { x : width / 2 - 2, y : -height / 2 + 2 },
                     { x : -width / 2 + 2, y : height / 2 - 2 } ];
    for ( var i = 0; i < lanterns.length; i++ ) {
        var dim = 3;
        var lantern = lanternFactory( dim, dim, 3 );
        var moth = mothFactory( lantern );

        lantern.addToObject( scene, lanterns[i].x, lanterns[i].y, depth * 2 );
    }
}

function createEnvironment( width, height, depth ) {
    if ( typeof environment.sand !== 'undefined' )
        scene.remove( environment.sand );
    createSand( width, height );

    generateRock();
    while ( Math.random() > 0.3 )
        generateRock();

    if (nightMode) {
        stars = createStars();
        scene.add(stars);
    }
    // tree = treeFactory();
    // environment.sand.add(tree);
}

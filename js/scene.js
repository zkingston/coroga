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

    var generate = new CRGButton( 'Regenerate', function ( btn ) {
        createEnvironment( 70, 50, 2 );
    });

    generate.addElement( new CRGDropdownButton( 'Night Mode', function( btn ) {
        if (nightMode == true) {
            nightModeSet(false);
            btn.setTextNode( 'Night Mode' );
        } else {
            nightModeSet(true);
            btn.setTextNode( 'Day Mode' );
        }
    }));
    UIaddElement( generate ); 

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
    camera.position.set( -100, -100, 30 );
    camera.lookAt( 0, 0, 0 );

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );
 	renderer.setPixelRatio( window.devicePixelRatio );

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

    createBase();
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

    environment.sand.rotateZ(0.001);
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

    var lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );
    lamp.position.set( 0, 10, 30 );
    lamp.castShadow = true;
    scene.add( lamp );
    environment.lamp = lamp;
}


function createBase( width, height, depth ) {

    scene = new THREE.Scene();
    initializeLights();

    // createWalls( width, height, 15 );

    // var lanterns = [ { x : width / 2 - 2, y : -height / 2 + 2 },
    //                  { x : -width / 2 + 2, y : height / 2 - 2 } ];
    // for ( var i = 0; i < lanterns.length; i++ ) {
    //     var dim = 3;
    //     var lantern = lanternFactory( dim, dim, 3 );
    //     var moth = mothFactory( lantern );

    //     lantern.addToObject( scene, lanterns[i].x, lanterns[i].y, depth * 2 );
    // }
}

function createEnvironment( width, height, depth ) {
    if ( typeof environment.sand !== 'undefined' )
        scene.remove( environment.sand );
    if ( typeof environment.stars !== 'undefined' && !nightMode )
        scene.remove( environment.stars );

    createIsland( discreteUniform( 20, 70 ), discreteUniform( 20, 70 ), depth );

    // createSand( width, height );
    //
    // generateSpireRock();
    // while ( Math.random() > 0.3 )
    //     generateSpireRock();

    if (nightMode) {
        scene.fog = new THREE.FogExp2( 0x001331, 0.0025 );
        renderer.setClearColor( 0x001331, 1 );
        environment.lamp = new THREE.DirectionalLight( 0x292929, 0.5 );
        if (typeof environment.stars === 'undefined') {
            stars = createStars();
            environment.stars = stars;
            scene.add(stars);
        }
        else {
            scene.add(environment.stars);
        }
    }
    else {
        scene.fog = new THREE.FogExp2( 0xaaccff, 0.005 );
        renderer.setClearColor( 0xaaccff, 1 );
        environment.lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );
    }

    var placer = new PlacementEngine(environment, scene);
    placer.runRandomTileEngine();


    // environment.sand.add(tree);
}

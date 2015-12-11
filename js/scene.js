var camera, controls, scene, renderer;

var environment = {};
var tick = 0;

init();
render();
animate();

function init() {

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.01 );

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
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    createEnvironment( 30, 30, 2 );
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

    var x = Math.round( Math.random() * 3 + 2 );
    var y = Math.round( Math.random() * 3 + 2 );
    var z = Math.round( Math.random() * environment.depth + 3 );

    var rock1, rock2, rock3;

    rock1 = SpireRockFactory( x, y, z );

    if ( Math.random() > 0.5 ) {
        rock2 = SpireRockFactory( x - 1, y - 1, z - 1 );
        rock2.position.x = peturb( 0, x );
        rock2.position.y = peturb( 0, y );
        rock2.position.z -= 1;

        if ( Math.random() > 0.5 ) {
            rock3 = SpireRockFactory( x - 2, y - 2, z - 2 );
            rock3.position.x = peturb( 0, x );
            rock3.position.y = peturb( 0, y );
            rock3.position.z -= 2;
        }
    }

    var rockGeo = mergeMeshGeometry( [ rock1, rock2, rock3 ] );
    var rockMat = new THREE.MeshPhongMaterial( { color : 0x505050,
                                                  shading : THREE.FlatShading,
                                                  shininess : 20,
                                                 refractionRatio : 0.1 } );

    var rock = new THREE.Mesh( rockGeo, rockMat );

    rock.position.x = peturb( rock.position.x, width - 2 * x );
    rock.position.y = peturb( rock.position.y, height - 2 * y );
    rock.position.z += z / 2;
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

    for ( var i = 0; i < Math.random() * 3 + 1; i++ ) {
        generateRock();
    }

    var dim = Math.random() * 2 + 3;
    var lantern = lanternFactory( dim, dim, Math.random() * 2 + depth * 2 );
    lantern.position.x = peturb( lantern.position.x, width - 1 );
    lantern.position.y = peturb( lantern.position.y, height - 1 );
    lantern.position.z += depth * 2;

    scene.add( lantern );

}

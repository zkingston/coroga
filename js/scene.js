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

    camera.position.set( 0, -40, 40 );
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

    updateLanterns( tick );

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

}

function createEnvironment( width, height, depth ) {

    createSand( width, height );
    createBase( width, height, depth );

    var z = Math.random() * 2 + 1;
    var rock = basicRockFactory( 3, 3, z );
    rock.position.x = peturb( rock.position.x, width - 3 );
    rock.position.y = peturb( rock.position.y, height - 3 );
    rock.position.z += z / 2;
    rippleSand( 3, rock );
    scene.add( rock );

    z = Math.random() * 2 + 1;
    rock = basicRockFactory( 2, 2, z );
    rock.position.x = peturb( rock.position.x, width - 2 );
    rock.position.y = peturb( rock.position.y, height - 2 );
    rock.position.z += z / 2;
    rippleSand( 3, rock );
    scene.add( rock );

    var lantern = lanternFactory( 5, 5, 3 );
    lantern.position.x = peturb( lantern.position.x, width - 1 );
    lantern.position.y = peturb( lantern.position.y, height - 1 );
    lantern.position.z += 4;

    scene.add( lantern );

}

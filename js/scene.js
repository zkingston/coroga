var container, stats;
var camera, controls, scene, renderer;

init();
render();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 60,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    camera.position.z = 500;

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );


    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    // renderer

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );

    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();

}

function render() {

    renderer.render( scene, camera );

}

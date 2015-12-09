var camera, controls, scene, renderer;

var tick = 0;
var lamp;

init();
render();
animate();

function init() {

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    scene.fog = new THREE.Fog(0xece9ca, 500, 2000);

    camera = new THREE.PerspectiveCamera( 75,
                                          window.innerWidth / window.innerHeight,
                                          0.1,
                                          1000 );

    camera.position.set( 0, -30, 20 );
    camera.lookAt( scene.position );

    renderer = new THREE.WebGLRenderer( { alpha: true,
                                          antialias: false } );
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    initializeLights();
    createEnvironment( 30, 22, 2 );
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

    lamp.position.x += Math.sin(tick * 0.01) * 0.1;

    requestAnimationFrame( animate );
}

function render() {

    renderer.render( scene, camera );

}

function initializeLights() {

    var sceneLight = new THREE.HemisphereLight(0xdddddd, 0x202020, .1);

    lamp = new THREE.DirectionalLight(0xdddddd, 1);
    lamp.position.set(0, 10, 30);
    lamp.castShadow = true;
    lamp.shadowDarkness = .5;

    scene.add( sceneLight );
    scene.add( lamp );

}

function createEnvironment( width, height, depth ) {

    var sand = createSand( width, height );
    var base = createBase( width, height, depth );

    scene.add( sand );
    scene.add( base );

}

function createSand( width, height ) {

    var geometry = new THREE.PlaneGeometry( width, height, width, height );
    var material = new THREE.MeshLambertMaterial( { color : 0xfcfbdf } )
    // var texture = THREE.ImageUtils.loadTexture('img/sand.png');
    // var material = new THREE.MeshPhongMaterial( { map: texture } )

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.z = peturb( vertex.z, .25 );
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;

}

function createBase( width, height, depth ) {

    var offset = 1;
    var baseFloor = cubeFactory( width + offset, height + offset, offset );
    baseFloor.position.z = -depth;

    var baseNorth = cubeFactory( width, offset, depth );
    baseNorth.position.x = offset / 2;
    baseNorth.position.y = height / 2;
    baseNorth.position.z = -depth / 2 + offset / 2;

    var baseSouth = cubeFactory( width, offset, depth );
    baseSouth.position.x = -offset / 2;
    baseSouth.position.y = -height / 2;
    baseSouth.position.z = -depth / 2 + offset / 2;

    var baseEast = cubeFactory( offset, height, depth );
    baseEast.position.x = width / 2;
    baseEast.position.y = -offset / 2;
    baseEast.position.z = -depth / 2 + offset / 2;

    var baseWest = cubeFactory( offset, height, depth );
    baseWest.position.x = -width / 2;
    baseWest.position.y = offset / 2;
    baseWest.position.z = -depth / 2 + offset / 2;

    var geometry = mergeMeshGeometry( [ baseFloor,
                                        baseNorth,
                                        baseSouth,
                                        baseEast,
                                        baseWest ] );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var material = new THREE.MeshLambertMaterial( { color : 0x663333 } )

    var base = new THREE.Mesh( geometry, material );

    return base;
}

function cubeFactory( width, height, depth, attributes ) {

    var geometry = new THREE.BoxGeometry( width, height, depth );
    var material = new THREE.MeshBasicMaterial( attributes );

    var mesh = new THREE.Mesh( geometry, material );

    return mesh;

}

function peturb( value, range ) {

    return value + Math.random() * range - range / 2;

}

function mergeMeshGeometry( meshes ) {

    var combined = new THREE.Geometry();

    for ( var i = 0; i < meshes.length; i++ ) {
        meshes[i].updateMatrix();

        combined.merge(meshes[i].geometry, meshes[i].matrix);
    }

    return combined;

}

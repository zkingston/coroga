var camera, controls, scene, renderer;

var tick = 0;
var lamp, water;

var rockClusters = [];

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

    lamp = new THREE.DirectionalLight(0xdddddd, 1);
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

function createSand( width, height ) {

    var geometry = new THREE.PlaneGeometry( width, height, width, height );

    // var texture = THREE.ImageUtils.loadTexture('img/sand.png');
    var material = new THREE.MeshPhongMaterial( { color : 0xfcfbdf,
                                                  shading : THREE.FlatShading,
                                                  shininess : 10,
                                                  refractionRatio : 0.5 } );

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
    var baseFloor = boxFactory( width + offset, height + offset, offset );
    baseFloor.position.z = -depth;

    var baseNorth = boxFactory( width + offset, offset, depth );
    baseNorth.position.y = height / 2;
    baseNorth.position.z = -depth / 2 + offset / 2;

    var baseSouth = boxFactory( width + offset, offset, depth );
    baseSouth.position.y = -height / 2;
    baseSouth.position.z = -depth / 2 + offset / 2;

    var baseEast = boxFactory( offset, height - offset, depth );
    baseEast.position.x = width / 2;
    baseEast.position.z = -depth / 2 + offset / 2;

    var baseWest = boxFactory( offset, height - offset, depth );
    baseWest.position.x = -width / 2;
    baseWest.position.z = -depth / 2 + offset / 2;

    var geometry = mergeMeshGeometry( [ baseFloor,
                                        baseNorth,
                                        baseSouth,
                                        baseEast,
                                        baseWest ] );
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var material = new THREE.MeshPhongMaterial( { color : 0x996633,
                                                  shading : THREE.FlatShading,
                                                  shininess : 5,
                                                  refractionRatio : 0.1 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;
}

function lanternFactory( width, height, depth, postDepth ) {

    var lantern = new THREE.Group();

    var lightContainer = boxFactory( width / 2,
                                     height / 2,
                                     depth / 2,
                                     {
                                     } );

    lantern.traverse( function( object ) {

        if ( object instanceof THREE.Mesh ) {
            object.castShadow = true;
            object.receiveShadow = true;
        }

    } );

    return lantern;

}

function boxFactory( width, height, depth, attributes ) {

    var geometry = new THREE.BoxGeometry( width, height, depth );
    var material = new THREE.MeshPhongMaterial( attributes );

    var mesh = new THREE.Mesh( geometry, material );

    return mesh;

}

function basicRockFactory( width, height, depth, attributes ) {

    var geometry = new THREE.BoxGeometry( width, height, 0.01, width * 2, height * 2, 10 );

    var axis = new THREE.Vector3( peturb( 0, width ), peturb( 0, height ), 0 );
    var maxDist = Math.sqrt( width * width + height * height );

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.x = peturb( vertex.x, 0.1 );
        vertex.y = peturb( vertex.y, 0.1 );

        if ( vertex.z == 0.005 ) {
            vertex.z = peturb( ( maxDist - vertex.distanceTo( axis ) ) * 3 * depth / 4, depth / 4 );
        }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial( { color : 0x202020,
                                                  shading : THREE.FlatShading,
                                                  shininess : 20,
                                                  refractionRatio : 0.1 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    rockClusters.push( mesh );

    return mesh;

}

function peturb( value, range ) {

    return value + ( Math.random() * range ) - ( range / 2 ) ;

}

function mergeMeshGeometry( meshes ) {

    var combined = new THREE.Geometry();

    for ( var i = 0; i < meshes.length; i++ ) {
        meshes[i].updateMatrix();

        combined.merge(meshes[i].geometry, meshes[i].matrix);
    }

    return combined;

}

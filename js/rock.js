var rockClusters = [];
var perturb = peturb


function incRandInt(low, high){
  //Inclusive RandInt
  return Math.floor(Math.random()* ((high+1) -low)) + low
}

function rand() {
  return Math.random()
}

// Takes in vectors and finds the closest to a point.
function closest(list, vertex){

    cMin = null
    cScore = null
    for(var i = 0; i < list.length; i++){
      score = vertex.distanceTo(list[i])
      if ((cMin == null)||( score < cScore)){
        cMin = list[i]
        cScore = score
      }
    }
    return cMin
}



function basicRockFactory( width, height, depth, attributes ) {
    var geometry = new THREE.BoxGeometry( width, height, 0.01, width*2, height * 2, 10 );

    var axis = new THREE.Vector3( perturb( 0, width ), perturb( 0, height ), 0 );
    var maxDist = Math.sqrt( width * width + height * height );

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.x = perturb( vertex.x, 0.1 );
        vertex.y = perturb( vertex.y, 0.1 );

        if ( vertex.z == 0.005 ) {
            vertex.z = perturb( ( maxDist - vertex.distanceTo( axis ) ) * 3 * depth / 4, depth / 4 );
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

function SpireRockFactory( width, height, depth, attributes ) {
    var depth  =  depth
    var bRadius = width / 2.0;
    var tRadius = Math.random() * (width/3.0);
    var faces = incRandInt(4,6);
    var stories = Math.floor(depth + 1) * incRandInt(3,7);


    // var geometry = new THREE.CylinderGeometry( tRadius, bRadius, depth,
    //   faces, stories, false, 0, 2.01*Math.PI);
    var geometry = new THREE.CylinderGeometry( tRadius, bRadius, depth,faces, stories, false, 0, 2.01*Math.PI);
    var numInternalVectors = faces
    var axisVectors =[];

    for (var v = 0; v < numInternalVectors; v++){
      axisVectors[v] = new THREE.Vector3(
        rand()*bRadius, rand()*bRadius, rand()*depth)
    }

    for (var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        // find closest internal vector

        internal = closest(axisVectors, vertex)

        var vectorMag =0.3
        console.log(vectorMag * (internal.x))


         vertex.x  = vertex.x - vectorMag * (internal.x);
         vertex.y  = vertex.y - vectorMag * (internal.y );
         vertex.z  = vertex.z - vectorMag * (internal.z  );
        // vertex.x = perturb( vertex.x, 0.1 );
        // vertex.y = perturb( vertex.y, 0.1 );
        // vertex.z = perturb( vertex.z, 0.1 );


    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

     geometry.rotateX(90* Math.PI / 180)
    // geometry.rotateZ(90* Math.PI / 180)

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

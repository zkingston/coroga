var perturb = peturb

function incRandInt(low, high){
  //Inclusive RandInt
  return Math.floor(Math.random()* ((high+1) -low)) + low
}

function randRange(low, high){
  return Math.random()*(high -low) + low
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

function ClusterFactory( RockFactory, width, height, depth ) {

    var x = width;
    var y = height;
    var z = depth;

    var rocks = new THREE.Object3D();
    rocks.addFeatureGeometry( 'rocks', RockFactory( x, y, z ) );

    var chance = 0.3;

    while ( Math.random() > chance && x > 2 && y > 2 ) {
        for ( var i = 0; i < 2; i++ ) {
            x -= Math.random() * ( x - 1 );
            y -= Math.random() * ( y - 1 );
            z -= Math.random() * ( z - 1 );

            var newRock = RockFactory( x, y, z );
            newRock.scale( Math.random() / 2 + 0.4, 1, 1 );

            newRock.translate( peturb( 0, 2 * width ),
                               peturb( 0, 2 * height ),
                               -( depth - z ) / 2 );

            newRock.rotateZ( Math.random() * Math.PI );
            rocks.addFeatureGeometry( 'rocks', newRock );
        }

        chance += 0.2;
    }

    rocks.addFeatureMaterialP( 'rocks', { color : 0x505050,
                                          shading : THREE.FlatShading,
                                          refractionRatio : 0.1 } )
    rocks.generateFeatures();
    return rocks;

}

function MossDecorator( rock, threshold ) {

    var mossyRock = new THREE.Group();
    mossyRock.add( rock );

    var mossGeo = rock.geometry.clone();
    mossGeo.computeFaceNormals();

    var mossAngle = new THREE.Vector3( 0, 1, 1 );

    for ( var i = 0; i < mossGeo.faces.length; i++ ) {
        var face = mossGeo.faces[i];

        if ( face.normal.dot( mossAngle ) < threshold ) {
            console.log (face.normal.dot( mossAngle ) );
            var va = mossGeo.vertices[face.a];
            var vb = mossGeo.vertices[face.b];
            var vc = mossGeo.vertices[face.c];

            va.z -= 0.1;
            vb.z -= 0.1;
            vc.z -= 0.1;
        }
    }

    var mossMat = new THREE.MeshPhongMaterial( { color : 0x77d97e,
                                                 shading : THREE.FlatShading,
                                                 shininess : 30,
                                                 refractionRatio : 0.0 } );

    var moss = new THREE.Mesh( mossGeo, mossMat );
    moss.position.x = rock.position.x;
    moss.position.y = rock.position.y;
    moss.position.z = rock.position.z;
    mossyRock.add( moss );

    return mossyRock;

}

function BasicRockFactory( width, height, depth, attributes ) {
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

    var material = new THREE.MeshPhongMaterial( { color : 0x505050,
                                                  shading : THREE.FlatShading,
                                                  shininess : 20,
                                                  refractionRatio : 0.1 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;

}

function SpireRockFactory( width, height, depth) {
    var depth  =  depth
    var bRadius = width / 2.0;
    var tRadius = randRange(0.6,0.85) * (width/2.0);
    var faces = incRandInt(4,7);
    var stories = Math.floor(depth + 1);

    var geometry = new THREE.ClosedCylinderGeometry( tRadius, bRadius, depth,faces, stories, false, 0, 2.01*Math.PI);
    var numInternalVectors = faces
    var axisVectors =[];

    for (var v = 0; v < numInternalVectors; v++){
      axisVectors[v] = new THREE.Vector3(
        rand()*bRadius, rand()*bRadius, rand()*depth)
    }

    for (var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];

        internal = closest(axisVectors, vertex)

        var vectorMag =0.3
         vertex.x  = vertex.x - vectorMag * (internal.x);
         vertex.y  = vertex.y - vectorMag * (internal.y);
         vertex.z  = vertex.z - vectorMag * (internal.z);
    }

    for (var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        if ((vertex.z < depth + 0.1)&&(vertex.z > depth - 0.1))
          vertex.z = perturb(vertex.z, 0.2)

    }

    geometry.rotateX(90* Math.PI / 180);
    return geometry;
}

function SpireRockFactory2 ( width, height, depth ) {
    var cfg = { t_rad_range : { min : 0.4,
                                max : 0.8 },
                r_seg_range : { min : 5,
                                max : 8 },
                h_seg_range : { min : 5,
                                max : 10 },
                rotate      : { min : -Math.PI / 8,
                                max : Math.PI / 8 },
                vector_mag  : 0.3,
                top_perturb : 0.5,
                top_offset  : 0.3 };

    var diameter = Math.max( width, height );
    var b_rad = diameter / 2;
    var t_rad = c_uniform( cfg.t_rad_range.min,
                           cfg.t_rad_range.max ) * b_rad;

    var r_seg = d_uniform( cfg.r_seg_range.min,
                           cfg.r_seg_range.max );

    var h_seg = d_uniform( cfg.h_seg_range.min,
                           cfg.h_seg_range.max );

    var geometry = new THREE.ClosedCylinderGeometry(
        t_rad, b_rad, depth, r_seg, h_seg ).rotateX( Math.PI / 2 );

    var half_depth = depth / 2;
    geometry.vertices.map( function ( vertex ) {
        if ( Math.abs( vertex.z ) === half_depth ) {
            var s = vertex.z.sign();
            var r = c_uniform( 0, cfg.top_perturb );
            if ( Math.abs( vertex.x ) < 0.001 && Math.abs( vertex.y ) < 0.001 ) {
                vertex.z += s * ( r + cfg.top_offset );
            } else {
                vertex.z += s * r;
            }
        }
    } );

    var rotate = c_uniform( cfg.rotate.min, cfg.rotate.max );
    geometry.rotateX( rotate );

    var axis_vectors = [];
    var num_vectors = h_seg;
    for ( var v = 0; v < num_vectors; v++ ) {
        var r = c_uniform( -1, 1 );
        var ar = Math.abs( r );
        axis_vectors.push( new THREE.Vector3( c_uniform( -ar, ar ) * b_rad,
                                              c_uniform( -ar, ar ) * b_rad,
                                              r * half_depth ) );
    }

    geometry.vertices.map( function ( vertex ) {
        var internal = vertex.closest( axis_vectors ).clone();
        vertex.sub( internal.multiplyScalar( cfg.vector_mag ) );
    } );

    geometry.scale( width / diameter, height / diameter, 1 );
    geometry.rotateX( -rotate );

    return geometry;
}

function ClusterBaseFactory( rock ) {

}

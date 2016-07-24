// BRANCH HEURISTICS

/*  Trees are created with a long cone that is bent in a few places.
    In each of these places "joints", another small tree is recursively produced
    using another bent cone.
*/

// What is the length of the branch segment given the joint number.
function _lengthHeuristic(maxlen, maxjoint, curjoint){
  return (curjoint < 2) ? uniform(3,5) : uniform(2,4)
}

// Probability a branch will spawn at fork
// If the branch doesnt fork, it just bends.
// Always fork at least once.
function _branchProb(joint){return (joint == 1)? 1.0:0.6};

// How many degrees is the cone which new branch waypoints are sampled
var _branchiness = 40

// What is the max possible length of a segment
var _length = 7;

// How quickly does the radius taper
var _pointiness = .7

// Max Number of segments a Branch can have
var _segments = 5

// Radius at which to stop spawning off branches (surprisingly good for quality)
var _radiusCutoff = 1.0;


// CASCADE HEURISTICS
/* In a cascade, you start from a point/vector, and generate a few children in a
cone from your vector. Those children then have a chance of spawning children
but in a smaller cone than the parent.
*/

// The starting cone angle
var spreadAngle = 120;

// How much does the cone decrease per child?
function degradation(){return uniform(0.1,1) * 10};


// How big are the flowers.
var flowerSize = .4;

// Space between parent and child
function flowerDist(){return uniform(flowerSize,2* flowerSize)};


// How many children based on how big the probability cone is
// Works closesly with degradation. degradation is how fast the angle drops
// Angle must go to zero for the cascade to stop.
function childPerDegree(angle){
    if (angle > (9/10) * spreadAngle){return Math.floor(uniform(1,4))}
    if (angle > (4/5)*spreadAngle){return Math.floor(4 * angle/spreadAngle)}
    if (angle == 0){return 0} // base case
    else{return 1}
}



// HELPER FUNCTIONS

/**
* Generates a random point in a cone shaped region at a specific length
* away from an origin point, with the cone centered around a vector.
* @param {THREE.Vector3} origin The origin of the cone
* @param {THREE.Vector3} vector The direction the cone is facing
* @param {number} length The distance away the random point is spawned
* @param {number} The outer angle for the cone.
* @param {number} The  inner angle for the cone.
* @return {THREE.Vector3} A random point in the cone.
**/
function conePoint(origin, vector, length, degreeLow, degreeHigh){
    // Default value for degree high
    degreeHigh = (!degreeHigh) ? 1 : degreeHigh;

    // Normalize the start vector.
    vector.normalize()

    var rl = (Math.PI/180) * degreeLow
    var rh = (Math.PI/180) * degreeHigh

    // Pick some vectors that will help you come up with a basis.
    // Use Cross Products to construct the basis. (a,u,v) are the vectors.
    var a = vector;
    var temp = (a.y != 0 || a.z !=0) ?
      new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0);

    var u = new THREE.Vector3();
    u.crossVectors(a, temp).normalize()

    var v = new THREE.Vector3();
    v.crossVectors(a,u).normalize()
    //axis, u, v basis constructed


    // Randomly generate the angles of the new point for conic form.
    var theta = acos(uniform(cos(rl), cos(rh)));
    var phi = uniform(0, 2*Math.PI);

    // Produce the resulting unit vector using the randomly generated angles.
    var x = new THREE.Vector3(
      sin(theta)*(cos(phi) * u.x + sin(phi)* v.x) + cos(theta) *a.x,
      sin(theta)*(cos(phi) * u.y + sin(phi)* v.y) + cos(theta) *a.y,
      sin(theta)*(cos(phi) * u.z + sin(phi)* v.z) + cos(theta) *a.z)
    x.normalize()

    // Stretch the Unit Vector into the size required.
    return new THREE.Vector3(
      origin.x + x.x * length,
      origin.y + x.y * length,
      origin.z + x.z * length)
}


// TREE GENERATION CODE

/**
* Using an iterative spawning algorithm, This produces a cascade of particles
* at a given origin point.
* @param {THREE.Vector3} origin The point where the cascade should be centered
* @return {THREE.Points} Returns a particle system propagating from the origin
*
**/
function cascadeGenerator(origin, color){

    // flowers are the geometric object
    // nodes are their positional data.


    // Properties of each flower

    var flowerProperties = new THREE.PointsMaterial({
        color : color,
        size : .4
    });

    // Array of all flower points.
    var flowers = new THREE.Geometry();

    // We perform an iterative algorithm for the cascade. This is the buffer.
    // Holds statistics of a parent node (flower) until the node has children.
    var buffer = [];

    // The direction of the cascade. We want it to cascade straight down.
    var flowerVector = new THREE.Vector3(0,0,-1);


    // We have to start the cascade. This is the first flower.
    var position = conePoint(origin,
                              flowerVector,
                              flowerDist(),
                              spreadAngle);

    var flower =  new THREE.Vector3(
            position.x,
            position.y,
            position.z);


    flowers.vertices.push(flower);

    // Node keeps track of the statistics of a parent like position and spread.
    var node ={
        position : position,
        angle : spreadAngle
    }
    buffer.push(node);



    // While there are parents still eligible to have children.
    while (buffer.length >= 1){
          var parent = buffer.pop()
          var location = parent.position
          var numChildren = childPerDegree(parent.angle)
          var childAngle = Math.max(0,parent.angle - degradation());

          for (var i = 0; i < numChildren; i++){

                var position = conePoint(location,
                                        flowerVector,
                                        flowerDist(),
                                         childAngle)
                // construct the flower.
                var flower = new THREE.Vector3(
                        position.x,
                        position.y,
                        position.z
                );
                flowers.vertices.push(flower);


                // Give it a node.
                var node ={}
                node.position = position;
                node.angle = childAngle;
                buffer.push(node);
          }
    }


    var particleSystem = new THREE.Points(
        flowers,
        flowerProperties
    );

    // var particleSystem = {
    //     geometry : flowers,
    //     material : flowerProperties
    // };

    return particleSystem;
}


/**
* Generates a branch at the given point, starting in the direction
* of the given vector, starting with a given radius, and having a specified
* number of segments.
* @param {THREE.Vector3} origin The source of the branch
* @param {THREE.Vector3} vector The direction the branch should start
* @param {number} radius The beginning radius of the branch
* @param {number} numSegments The number of segments the branch should have
* @return {object} An object containing data necessary to construct the tree
**/
function branchGenerator(origin, vector, radius, numSegments){
    // Randomly generate a path using probability cone
    // Branch Vector is the list of vector waypoints the branch has.

    // Start with the beginning of the branch...
    var branchVector = [origin];
    var curPoint = origin;
    var curVector = vector;

    // Propagate down until you have a list of waypoints for the branch.
    for(var iter =0; iter <numSegments; iter++){
        // Generate a length for the given segment.
        length = _lengthHeuristic(_length,_segments,iter);

        // Find next point using probability cone. (it gets buggy at theta<15)
        newPoint = conePoint(curPoint, curVector, length, _branchiness, 15)
        curVector.subVectors(newPoint, curPoint);
        branchVector.push(newPoint);
        curPoint = newPoint;
    }

    // The waypoints must be transformed into a continuous function.
    // with domain 0 to 1. i.e. 0 should give the start of the branch
    // 1 should give the end. Why are we doing this? Because we need to be able
    // to provide the transform for every point in the zigzagged branch,
    // not just the waypoints. This will make those points easy to calculate.
    //
    // bVec: Branch Vector,
    // tVec: Transform Vector

    var bVec = branchVector;
    var tVec =[]
    var branchLength = 0;

    // Take each point in the branch vector, and find its transform vector.
    for(var iter = 1; iter < branchVector.length; iter++){
      var segLength = bVec[iter].distanceTo(bVec[iter - 1]);
      branchLength += segLength;
      tVec.push(branchLength);
    }
    tVec = tVec.map(function(x){ return x/branchLength;})


    // Branches are for some goddamn reason referenced in the middle.
    // We'll need this to find the endpoints.
    var offset = new THREE.Vector3().subVectors(bVec[1],bVec[0])


    function f(t){
        // Using t mapping, find the points which t lies between.

        // Find out between two transformed branch waypoints the point lies.
        var bNum= -1;
        for(var iter = 1; iter < tVec.length; iter++){
          if (t < tVec[iter]){
            bNum = iter-1;
            break;
          }
        }
        bNum = (bNum == -1) ? 1 : bNum;

        // Between these Points
        var p1 = bVec[bNum];
        var p2 = bVec[bNum + 1];

        // Using those points, calculate the magnitude of the query point.
        var point = new THREE.Vector3().subVectors(p2,p1);
        var mag = point.length() * ((t - tVec[bNum]) / (tVec[bNum + 1] - tVec[bNum]));
        point.setLength(mag);

        // Now put the point back in 3d space where it was
        var point =  new THREE.Vector3().addVectors(point, p1);

        // Described above. Offset from branch center to find end.
        var point =  new THREE.Vector3().addVectors(point, offset)

        return point;
    }

    // Using transformed domain, what is the radius at a given point.
    function taper(t){
      return (1.0 - t) * _pointiness;
    }

    // What is the radius at a given joint number. This is important because we
    // spawn new branches at joints, and we want to know how thick they should
    // be.
    function getRadiusAtJoint(n){
        return taper(tVec[n])* radius;
    }

    // Have the tube/cone follow the path described by the transform.
    var Curve = THREE.Curve.create(
        function(scale){// Constructor is meaningless here.
            this.scale == (scale === undefined) ? 1 : scale;
        },
        function(t){ // getPoint();
          return f(t);
        });

    var path = new Curve();

    // Make the branch folowing this path, using this taper.
    var branch = new THREE.TubeGeometry(
      path,//path
      10* numSegments, // segments
      radius, // radius
      10, // radius segments
      false,
      taper);// taper


    return {"geometry":branch, // The Tube geometry object
            "length": branchLength, // The full length of the branch
            "bVec": branchVector, // The branch waypoints.
            "tVec": tVec, // The transformed waypoints
            "radius" : getRadiusAtJoint, // Function finds the radius at joint n
            "taper" : taper, // The taper of each branch.
            "offset": offset}; // The offset to refer to a branch by the center
}



/**
* Constructor for a Tree
* @param { number }x The x coordinate the tree should spawn
* @param { number} y The y coordinate the tree should spawn
* @return { THREE.Group } The tree object
**/
function treeFactory(x,y){
    // Where does the tree start
    var origin = new THREE.Vector3(x,y,-2);

    // Trees grow upwards.
    var vector = new THREE.Vector3(0,0,1);

    // Tree material
    var treeMat = new THREE.MeshPhongMaterial( { color : 0x505050,
                                                 shading : THREE.FlatShading,
                                                 shininess : 20,
                                                 refractionRatio : 0.1 } );


    // Iterative algorithm similar to flower cascade.
    // Essentially a depth first search style construction.
    // for each joint in each branch in buffer, small chance you form branch
    // if you do, put branch on buffer. UNLESS starting radius is too small,
    // Then dont even bother.

    // Holds all generated branches
    var allBranches = []

    // Branch tips have cascades. Just the tips.
    var tips = [];

    // Holds parent branches until all possible children are spawned.
    var buffer = [];


    // Starts the cascade.
    // Create a mesh for the branch and add it to list of branches.
    var branch = branchGenerator(origin, vector,4, 4);
    buffer.push(branch);
    allBranches.push(branch["geometry"]);
    // var branchMesh = new THREE.Mesh( branch["geometry"], treeMat)
    // allBranches.push(branchMesh);


    // While parent branches are still on the buffer, eligible for childbirth
    while(buffer.length > 0){
        var cur = buffer.pop()
        // Go through each joint in the branch
        for(var joint = 1; joint < cur["bVec"].length; joint++){
            // Randomly choose if a branch will spawn at this joint.
            if (bernoulli(_branchProb(joint))){
                    // What would the proposed radius be?
                    var rad = cur["radius"](joint - 1)
                    // If the radius is too small don't spawn the branch.
                    if (rad > _radiusCutoff){
                        // o = Origin = Spacial position of joint.
                        var o = new THREE.Vector3().addVectors(cur["bVec"][joint], cur["offset"])
                        // v = Vector = probability cone centered on parent
                        var v = new THREE.Vector3().subVectors(cur["bVec"][joint],cur["bVec"][joint-1])
                        // r = Radius = slightly smaller than the parent branch.
                        var r = rad * uniform(.6,.9);
                        // n = NumSegments = 1 less than parent.
                        var n = cur["bVec"].length - joint + 1

                        var newBranch = branchGenerator(o,v,r,n);
                        buffer.push(newBranch);

                        allBranches.push(newBranch["geometry"]);


                    }
              }
        }
        tips.push(cur);
    }


    // Make a mesh of the geometries with tree material.

    var tree = new THREE.Object3D();
    tree.addFeatureGeometries("branches", allBranches);
    tree.addFeatureMaterialP("branches", treeMat);

    var blossoms = new THREE.Object3D();

    //tree.add(new THREE.Mesh( treeMeshGeo, treeMat));

    // Used for bugfixing.
    var pushup = new THREE.Vector3(0,0,3);

    for (var iter = 0; iter < tips.length; iter++){
        var cur = tips[iter];

        // This is the technically correct code, I believe.
        //var locus = new THREE.Vector3().addVectors(pushup,cur.bVec[cur.bVec.length - 1])

        // Resolves bug where the last branch segment is poorly articulated,
        // so it spawns blossoms unconnected. Not 100% sure why.
        var locus = new THREE.Vector3().addVectors(pushup,cur.bVec[cur.bVec.length - 2])
        locus.add(cur.offset);

        tree.add( cascadeGenerator(locus, 0xff69b4));
        tree.add( cascadeGenerator(locus, 0xcd6889));
        tree.add( cascadeGenerator(locus, 0xcd3278));
    }
    tree.generateFeatures();
    return tree;
}

function generateCherryTree(x,y){
    var tree = treeFactory(0, 0);
    tree.addToObjectProject( environment.island, x, y );
    return tree;
}

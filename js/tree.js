// HEURISTICS
// What is the length of the branch segment given the joit number.
function _lengthHeuristic(maxlen, maxjoint, curjoint){
  //return maxlen * curjoint/maxjoint - curjoint + randRange(1,4)
  return (curjoint < 2)? randRange(3,5): randRange(2,4)
}

// Probability a branch will spawn at fork
// Always fork at least once.
function _branchProb(joint){return (joint == 1)? 1.0:0.6};

var _branchiness = 40 // How many degrees is the cone which new points are sampled
var _length = 7 // What is the max possible length of a segment
var _pointiness = .7 // How quickly does the radius taper
var _segments = 5 // Number of segments a subBranch can have


var _radiusCutoff = 0.5; // Radius at which to stop spawning off branches


acos = Math.acos
tan = Math.tan

function chance(n){
    return  (Math.random() < n)? true : false
}
//(start point, vector to perturb, length, cone angle)
function conePoint(origin, vector, length, degreeLow, degreeHigh){
     degreeHigh = (!degreeHigh)? 1:degreeHigh;
    // Use axis
    vector.normalize()
    //length = length * randRange(0,1)
    var rl = (Math.PI/180) * degreeLow
    var rh = (Math.PI/180) * degreeHigh
    var a = vector
    var temp = (a.y != 0 || a.z !=0) ?
      new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0);

    var u = new THREE.Vector3();
    u.crossVectors(a, temp).normalize()

    var v = new THREE.Vector3();
    v.crossVectors(a,u).normalize()
    //axis, u, v basis constructed

    var theta = acos(randRange(cos(rl), cos(rh)))
    var phi = randRange(0, 2*Math.PI)

    var x = new THREE.Vector3(
      sin(theta)*(cos(phi) * u.x + sin(phi)* v.x) + cos(theta) *a.x,
      sin(theta)*(cos(phi) * u.y + sin(phi)* v.y) + cos(theta) *a.y,
      sin(theta)*(cos(phi) * u.z + sin(phi)* v.z) + cos(theta) *a.z)
    x.normalize()

    return new THREE.Vector3(
      origin.x + x.x * length,
      origin.y + x.y * length,
      origin.z + x.z * length)
}


function burstGenerator(origin, vector){
    var prop = { transparent : true,
                         opacity : 0.7,
                         color : 0xffffff,
                         side : THREE.DoubleSide,
                         shading : THREE.FlatShading,
                         shininess : 100,
                         emissive : 0xffffff
                       }


    var start = sphereFactory(.5, { transparent : true,
                         opacity : 0.7,
                         color : 0xf66fff,
                         side : THREE.DoubleSide,
                         shading : THREE.FlatShading,
                         shininess : 100,
                         emissive : 0xffffff
                       });






    var origin = new THREE.Vector3(10,10,10)
    var vector = new THREE.Vector3(1,1,1)
    for (var i = 0; i < 250; i++){
             var end = sphereFactory(.1,  prop );
             var loc = conePoint(origin, vector, 10, 45, 20)
             end.position.x = loc.x;
             end.position.y = loc.y;
             end.position.z = loc.z;
             scene.add(end);
    }



    start.position.x = origin.x;
    start.position.y = origin.y;
    start.position.z = origin.z;
    scene.add(start);

    return start;

}

function cascadeGenerator(origin){
    var spreadAngle = 160;
    function degradation(){return randRange(0.2,1) * 60};
    var flowerSize = .2;
    function flowerDist(){return randRange(1,2)};
    var childPerDegree = 4/90;

    var properties = { transparent : true,
      opacity : 0.7,
      color : 0xff69b4,
      side : THREE.DoubleSide,
      shading : THREE.FlatShading,
      shininess : 100,
      emissive : 0xff69b4
    }

    var flowers = [];

    var flowerVector = new THREE.Vector3(0,0,-1);
    var buffer = [];




    var position = conePoint(origin,
                              flowerVector,
                              flowerDist(),
                              spreadAngle)
    var flower = sphereFactory(flowerSize ,properties);
    flower.position.x = position.x;
    flower.position.y = position.y;
    flower.position.z = position.z;

    flowers.push(flower)

    //scene.add(flower)
    var node ={}
    node.position = position;
    node.angle = spreadAngle;
    buffer.push(node);

    while (buffer.length >= 1){
      var parent = buffer.pop()
      var location = parent.position
      var numChildren = Math.floor(parent.angle * childPerDegree)
      var childAngle = Math.max(0,parent.angle - degradation());

      for (var i = 0; i < numChildren; i++){

          var position = conePoint(location,
                                    flowerVector,
                                    flowerDist(),
                                     childAngle)
          var flower = sphereFactory(flowerSize ,properties);
          flower.position.x = position.x;
          flower.position.y = position.y;
          flower.position.z = position.z;
          flowers.push(flower)

      //    scene.add(flower)
          var node ={}
          node.position = position;
          node.angle = childAngle;
          buffer.push(node);
      }
    }
    var flowerMeshGeo = mergeMeshGeometry(flowers);
    var flowerMat = new THREE.MeshPhongMaterial(properties)
    var cluster = new THREE.Group();
    cluster.add(new THREE.Mesh( flowerMeshGeo, flowerMat))

    scene.add(cluster)
}

function branchGenerator(origin, vector, radius, numSegments){
    // Randomly generate a path using probability cone

    var branchVector = [origin];

    var curPoint = origin;
    var curVector = vector;
    for(var iter =0; iter <numSegments; iter++){

      length = _lengthHeuristic(_length,_segments,iter)
      // Put next point in probability cone. BUT, it gets buggy at theta<15
      newPoint = conePoint(curPoint,curVector, length ,_branchiness,15)
      curVector.subVectors(newPoint, curPoint);
      branchVector.push(newPoint);
      curPoint = newPoint;
    }

    // Must take discrete values and return a continuous
    // Piecewise function with domain 0 to 1.
    var bVec = branchVector;
    var tVector =[]
    var branchLength = 0;
    for(var iter = 1; iter < branchVector.length; iter++){
      var segLength = bVec[iter].distanceTo(bVec[iter - 1]);
      branchLength += segLength;
      tVector.push(branchLength);

    }
    for(var iter = 0; iter < tVector.length; iter++){
      tVector[iter] = tVector[iter]/branchLength;
    }



    var offset = new THREE.Vector3().subVectors(bVec[1],bVec[0])


    function f(t){
        // Using t mapping, find the points which t lies between.
        var bNum= -1;

        for(var iter = 1; iter < tVector.length; iter++){
          if (t < tVector[iter]){
            bNum = iter-1;
            break;
          }
        }
        bNum = (bNum == -1) ? 1 : bNum;


        // Between these Points on this vector
        var p1 = bVec[bNum];
        var p2 = bVec[bNum + 1];
        var point = new THREE.Vector3().subVectors(p2,p1);
        //console.log(point);
        // How far doe down this vector is this point?

        var mag = point.length() * ((t - tVector[bNum]) / (tVector[bNum + 1] - tVector[bNum]));

        point.setLength(mag);
        // Now put the point back in 3d space where it was
        var point2 =  new THREE.Vector3().addVectors(point, p1);
        // return point

        // Except we are also using IdiotEngine.js, and this shit is positioned
        // from the center of each segment instead of a pole.
        // So we need to trick it into offsetting.

        return new THREE.Vector3().addVectors(point2, offset)

    }

    function taper(t){
      return (1.0 - t) * _pointiness //* branchLength * tan(_pointiness)
    }

    function getRadiusAtJoint(n){
        return taper(tVector[n])* radius;
    }


    var Curve = THREE.Curve.create(
        function(scale){//Herp Derp Constructor
            this.scale == (scale === undefined) ? 1 : scale;
        },
        function(t){ // getPoint();
          return f(t);
        });

    var path = new Curve();


    var branch = new THREE.TubeGeometry(
      path,//path
      10* numSegments, // segments
      radius, // radius
      10, // radius segments
      false,
      taper);// taper


    return {"geometry":branch,
            "length": branchLength,
            "tVector": tVector,
            "radius" : getRadiusAtJoint,
            "taper" : taper,
            "bVec": branchVector,
            "offset": offset};

}

function treeFactory(){

    var origin = new THREE.Vector3(10,10,-2);
    var vector = new THREE.Vector3(0,0,1);
    var treeMat = new THREE.MeshPhongMaterial( { color : 0x505050,
                                                 shading : THREE.FlatShading,
                                                 shininess : 20,
                                                 refractionRatio : 0.1 } );

    //Must do a random tree traversal (LOLOLOL so Punny).
    // for each joint in each branch in buffer, small chance you form branch
    // if you do, put branch on buffer. UNLESS starting radius is too small,
    // Then dont even bother.
    var allBranches = []
    var buffer = [];

    var branch = branchGenerator(origin, vector,4, 4);

    buffer.push(branch);
    allBranches.push(new THREE.Mesh( branch["geometry"], treeMat));

    while(buffer.length > 0){
        var cur = buffer.pop()
        for(var joint = 1; joint < cur["bVec"].length; joint++){
              if (chance(_branchProb(joint))){
                    // what would its radius be?
                    var rad = cur["radius"](joint - 1)
                    if (rad > _radiusCutoff){
                        var o = new THREE.Vector3().addVectors(cur["bVec"][joint], cur["offset"])
                        var v = new THREE.Vector3().subVectors(cur["bVec"][joint],cur["bVec"][joint-1])
                        var r = rad * randRange(.6,.9)
                        var n = cur["bVec"].length - joint + 1
                        var newBranch = branchGenerator(o,v,r,n)
                        buffer.push(newBranch)
                        allBranches.push(new THREE.Mesh( newBranch["geometry"], treeMat))
                    }
              }
        }
    }



    var treeMeshGeo = mergeMeshGeometry(allBranches);
    var tree = new THREE.Group();
    tree.add(new THREE.Mesh( treeMeshGeo, treeMat))

    cascadeGenerator(new THREE.Vector3(10,10,10))

    return tree;
}

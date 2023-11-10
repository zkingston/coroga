function TerraformerEngine(input) {
    //this.placementEngine = placementEngine;
    this.env = input;
    this.makeSand = function(island) {
        var cfg = features.island.sand;
        var width = island.userData.width;
        var height = island.userData.height;
        // Mathematical Representation used for transferability and bounds
        var border = 8;
        // ONLY WORKS WITHIN X< 10000;
        // It's the most efficent polygon bounding test, I swear.
        var sandInequality = (function() {
            var a = (width - border);
            var b = (height - border);
            // selects consecutive points on curve. turns them into line segments.
            var numEdges = 40;
            var arc = pi * 2 / numEdges;
            var orderedPoints = new CLL();
            var lineSegs = [];
            //generate ordered points of perimeter
            for (var e = 0; e < numEdges; e++) {
                var t = e * arc;
                var p = new THREE.Vector3(a * cos(t), b * sin(t),
                0);
                orderedPoints.push(p);
            }
            //transform the ellipse
            //pick random point
            var startIndex = discreteUniform(0, numEdges - 1);
            var spliceLength = floor(numEdges / 2);
            var endIndex = (startIndex + spliceLength) % numEdges;
            var start = orderedPoints.get(startIndex);
            var end = orderedPoints.get(endIndex);
            //Push everything towards roughly center
            var centerOffset = new THREE.Vector3()
                .subVectors(end, start);
            centerOffset.setLength(continuousUniform(.4, .6) *
                centerOffset.length());
            if (startIndex < endIndex) {
                orderedPoints.data = orderedPoints.data.splice(
                    startIndex, endIndex - startIndex);
            }
            if (startIndex > endIndex) {
                orderedPoints.data.splice(endIndex, startIndex -
                    endIndex);
            }
            for (var iter = 0; iter < orderedPoints.getLength() *
                2; iter++) {
                var newPoint = smoothenCurve(
                    orderedPoints.get(iter - 1),
                    orderedPoints.get(iter),
                    orderedPoints.get(iter + 1)
                );
                orderedPoints.set(iter, newPoint);
            }
            //generate line segments from points
            for (var e = 0; e < orderedPoints.getLength(); e++) {
                var ip = e;
                var iq = (e + 1) % orderedPoints.getLength();
                lineSegs.push({
                    "p": orderedPoints.get(ip),
                    "q": orderedPoints.get(iq)
                });
            }
            // Membership function.
            // If a ray originating from the test point, extending to infinity
            // collides with the linesegments an odd number of times, it lies
            // within the polygon. infinity is approximately equal to 10000
            return function(x, y) {
                // Check all line segs
                var counter = 0;
                for (var i = 0; i < lineSegs.length; i++) {
                    var p1 = lineSegs[i].p;
                    var p2 = lineSegs[i].q;
                    var q1 = new THREE.Vector3(x, y, 0);
                    var q2 = new THREE.Vector3(x, 10000, 0);
                    if (intersects(p1, p2, q1, q2)) {
                        counter += 1;
                    }
                }
                return ((counter % 2) == 1);
            };
        })();
        // TODO Fix this;
        // This is a hardcoded parametric ellipse bounds checker.
        // Do the same line segment bounds checker as above.
        var islandCurve = function(x, y) {
            var xr = width;
            var yr = height;
            if (((x * x) / (xr * xr)) + ((y * y) / (yr * yr)) < 1) {
                return true
            } else {
                return false;
            }
        }
        // TODO: Fix. Grass isnt necessarily where island is, but sand isnt.
        var grassInequality = function(x, y) {
            if (!(sandInequality(x, y)) && islandCurve(x, y)) {
                return true;
            }
            return false;
        }
        island.userData.curves = {};
        island.userData.curves["island"] = islandCurve;
        island.userData.curves["sand"] = sandInequality;
        island.userData.curves["grass"] = grassInequality;
        // Make the sand
        var rakeModifier = 6;
        var rakeHeight = 0.125;
        var sandRandom = 0.08;
        var sideRakeBuffer = 5;
        var sand = new THREE.Object3D();
        var sandGeometry = new THREE.PlaneGeometry(width * 2, height * 2,
            width * 4, height * 4);
        //Cut out all face not inside the bounding ellipse
        sandGeometry.cut(function(face) {
            var centroid = sandGeometry.faceCentroid(face);
            return sandInequality(centroid.x / 3, centroid.y / 3);
        });
        // CYLINDRICAL COORDINATES BITCHES
        // Randomly generate sand rake spiral centers.
        var spiralCenters = [];
        while (spiralCenters.length < 6) {
            var x = continuousUniform(-1 * width, width);
            var y = continuousUniform(-1 * height, height);
            if (sandInequality(x, y)) {
                spiralCenters.push(new THREE.Vector3(x, y, 0));
            }
        }
        var d2 = function(a, b) {
            return pow2(a.x - b.x) + pow2(a.y - b.y)
        }
        sandGeometry.vertices.map(function(vertex) {
            // find closest spiral center
            var o = spiralCenters.reduce(function(prev, cur) {
                if (prev === null) {
                    return cur;
                }
                return (d2(prev, vertex) < d2(cur,
                    vertex)) ? prev : cur;
            }, null)
            // rake your vertex accordingly.
            vertex.z = 1;
            var dx = vertex.x - o.x;
            var dy = vertex.y - o.y
            var r = sqrt(pow2(dx) + pow2(dy))
            var theta = atan2(dy, dx);
            var s = 1 // Sand base height
            var a = .25; // amplitude of rake;
            var k = 1 /
            3; // number of spiral arms divided bydensity (3 for triskele)
            var f = 3; // sprial density.
            //For the love of god, please use integers, unless you set the sprical
            // arm number to a multiple of the reciprocal of the density.
            // Basically if the trig function below has f*k*theta not
            // be a multiple of theta, you will get join artifacts at theta = 0;
            // That multiple is how many arms you will have.
            // Please math responsibly
            // every radial cross section represents a sin wave. the wave is phase shifted
            // by a linear function proportional to theta. resulting in a spiral.
            vertex.z = s + a * sin(f * (r + k * theta));
        });
        sand.addFeatureGeometry('sand', sandGeometry);
        sand.addFeatureMaterialP('sand', {
            color: 0xfcfbdf,
            shading: THREE.FlatShading,
            shininess: 10,
            refractionRatio: 0.5
        });
        sand.generateFeatures();
        sand.addToObject(island, 0, 0, 0);
        environment.sand = sand;
        island.userData.sand = [];
        //TODO Make this a closure
        var windMagnitude = function(t) {
            var windDirection = new THREE.Vector3(3, 2, 0);
            var magnitude = function(t) {
                return bound(.25 + sin(t / 100) * .5, -0.25, 1);
            }
            // why? so that it reaches max power, and then recoils slightly below 0
            // so that things look elastic.
            return windDirection.setLength(magnitude(t))
        };
        environment.wind = windMagnitude;
        return island;
    };
    this.rakeSand = function() {}
    this.terraform = function(berg) {
        // Raise Sand/Lower ground
        // Add Water body TODO;
        // Mark sand or in placement engine.
        this.makeSand(berg);
        berg.generateFeatures();
        return berg
    }
}
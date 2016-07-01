var velStart = 0.1;

function createMotes() {
    // create the particle variables
    var particleCount = 10,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
          color: 0x000000,//0x241E02,
          size: 2,
          //map: THREE.ImageUtils.loadTexture("images/particle.png"),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

    var genDist = 50;
    var velocities = []

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      var pX = Math.random() * genDist - genDist / 2,
          pY = Math.random() * genDist - genDist / 2,
          pZ = Math.abs(Math.random() * 2),
          particle = new THREE.Vector3(pX, pY, pZ);

      // add it to the geometry
      particles.vertices.push(particle);
      var vel = {"x": 0, "y": 0, "z": 0};
      vel["x"] = Math.random() * velStart - velStart/2;
      vel["y"] = Math.random() * velStart - velStart/2;
      vel["z"] = Math.random() * velStart;
      console.log(vel["x"] + ", " + vel["y"]);
      velocities.push(vel);
    }

    // create the particle system
    var particleSystem = new THREE.Points(
        particles,
        pMaterial);

    environment.motes = particleSystem;
    environment.moteVelocities = velocities;
    return particleSystem;
}

function updateMotes() {
    //environment.motes.rotation.z += 0.001;

    var vel = environment.moteVelocities;

    var pCount = 10;

    var particleGeo = environment.motes.geometry;
    while (pCount--) {
        var particle = particleGeo.vertices[pCount];
        if (particle.z < -1) {
            particle.z = 3;
            vel[pCount]["x"] = Math.random() * velStart - velStart/2;
            vel[pCount]["y"] = Math.random() * velStart - velStart/2;
            vel[pCount]["z"] = Math.random() * velStart;
            particle.x = Math.random() * 50 - 25;
            particle.y = Math.random() * 50 - 25;
            particle.z = Math.random() * 2;
        }
        else {
            //updateVelocities(vel[pCount]);
            if (vel[pCount]["z"] < 0) {
                vel[pCount]["z"] -= 0.005;
            }
            else {
                vel[pCount]["x"] *= 1.01;
                vel[pCount]["y"] *= 1.01;
                vel[pCount]["z"] -= 0.01;
            }
            particle.x += vel[pCount]["x"];
            particle.y += vel[pCount]["y"];
            particle.z += vel[pCount]["z"];
        }
    }
    particleGeo.verticesNeedUpdate = true;
}

function updateVelocities(vector) {
    vector["x"] = Math.random() * velStart - velStart/2;
    vector["y"] = Math.random() * velStart - velStart/2;
    vector["y"] = Math.random();
}

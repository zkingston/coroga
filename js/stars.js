function createStars() {
    // create the particle variables
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 5,
          map: THREE.ImageUtils.loadTexture("images/particle.png"),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
      var pX = Math.random() * 1000 - 500,
          pY = Math.random() * 1000 - 500,
          pZ = Math.random() * 1000 - 500,
          particle = new THREE.Vector3(pX, pY, pZ);

      if (pZ < 0 || Math.pow(pX, 2) + Math.pow(pY, 2) < 5000) {
        p--;
        continue;
      }
      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);
    return particleSystem;
}

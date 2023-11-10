function createStars() {
    // create the particle variables
    var particleCount = 2200,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 8,
            map: THREE.ImageUtils.loadTexture("images/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true
        });
    var genDist = 2200;
    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {
        // create a particle with random
        var pX = Math.random() * genDist - genDist / 2,
            pY = Math.random() * genDist - genDist / 2,
            pZ = Math.abs(Math.random() * genDist - genDist / 2),
            particle = new THREE.Vector3(pX, pY, pZ);
        if (Math.pow(pX, 2) + Math.pow(pY, 2) < 240000) {
            p--;
            continue;
        }
        // add it to the geometry
        particles.vertices.push(particle);
    }
    // create the particle system
    var particleSystem = new THREE.Points(
        particles,
        pMaterial);
    return particleSystem;
}
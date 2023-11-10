var mothProperties = {
    size: 0.15,
    flightRadius: 1.5,
    velocity: 0.05
};

function mothFactory(lantern) {
    var m = mothProperties;
    var moth = new THREE.Object3D();
    moth.addFeatureGeometry('moth', new THREE.SphereGeometry(m.size));
    moth.addFeatureMaterialP('moth', {
        transparent: true,
        opacity: 0.7,
        color: 0xffffff,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        shininess: 100,
        emissive: 0xffffff
    });
    moth.generateFeatures();
    moth.addToObject(lantern);
    moth.userData.wave = Math.random() * 100;
    moth.addUpdateCallback(function(obj) {
        x = (moth.userData.wave + tick) * m.velocity;
        // Triple Cardiod/Rose Curve
        moth.position.x = (1.5 * Math.cos(x) - Math.cos(4 * x)) * m
            .flightRadius;
        moth.position.y = (1.5 * Math.sin(x) - Math.sin(4 * x)) * m
            .flightRadius;
        moth.position.z = Math.sin(x) * m.flightRadius;
    });
    moth.addAudio('audio/wings.ogg', 0.3, true, 5);
    moth.playAudio();
    return moth;
}
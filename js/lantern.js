var lanternIntensity = 0.5;

function lanternFactory(width, height, depth) {
    var lantern = new THREE.Object3D();
    lantern.addFeatureGeometry('light',
        new THREE.BoxGeometry(width / 2,
            height / 2,
            depth / 2));
    lantern.addFeatureMaterialP('light', {
        transparent: true,
        opacity: 0.7,
        color: 0xff9900,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        shininess: 100,
        emissive: 0xff9900
    });
    var lightBase = new THREE.BoxGeometry(3 * width / 4,
        3 * height / 4,
        depth / 8);
    var lightTop = lightBase.clone();
    lightTop.translate(0, 0, depth / 4);
    lightBase.translate(0, 0, -depth / 4);
    var lightBracket1 = new THREE.BoxGeometry(width / 16,
        height / 16,
        depth / 2);
    lightBracket1.translate(width / 4, height / 4, 0);
    var lightBracket2 = lightBracket1.clone();
    lightBracket2.translate(-width / 4, height / 4, 0);
    var lightBracket3 = lightBracket1.clone();
    lightBracket3.translate(width / 4, -height / 4, 0);
    var lightBracket4 = lightBracket1.clone();
    lightBracket4.translate(-width / 4, -height / 4, 0);
    var lightPole = new THREE.BoxGeometry(width / 8,
        height / 8,
        depth);
    lightPole.translate(0, 0, -3 * depth / 4);
    lantern.addFeatureGeometries('post', [lightTop,
        lightBase,
        lightBracket1,
        lightBracket2,
        lightBracket3,
        lightBracket4,
        lightPole
    ]);
    lantern.addFeatureMaterialP('post', {
        color: 0x996633,
        shading: THREE.FlatShading,
        shininess: 5,
        refractionRatio: 0.1
    });
    var light = new THREE.PointLight(0xff9900, lanternIntensity, 50);
    light.userData.wave = Math.random() * 100;
    lantern.add(light);
    lantern.addUpdateCallback(function(obj) {
        light.intensity = lanternIntensity + 0.03 * Math.sin((light
            .userData.wave + tick + Math.random() * 150) * 0.15);
    });
    lantern.generateFeatures();
    return lantern;
}
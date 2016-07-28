function createSkybox() {
    var imagePrefix = "images/background-";
    var directions  = ["front", "back", "right", "left", "top", "bottom"];
    var imageSuffix = ".jpeg";
    var skyGeometry = new THREE.CubeGeometry( 2000, 2000, 2000 );

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    return skyBox;
}

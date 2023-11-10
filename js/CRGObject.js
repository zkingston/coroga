/**
 * CRGObject.js - A set of extensions to the THREE.Object3D class to help with
 * the construction of complex geometries and scene graph structures.
 *
 * The main addition is the notion of a 'feature', which is a pair of geometry
 * and material associated with a name key. The actual mesh construction is
 * abstracted away from the user for a feature, and is created and added with
 * generateFeatures().
 *
 * Other utility functions are added to help with recursive traversal, such as
 * scene update functions and vertex traversal.
 *
 * Standard workflow looks like this:
 *
 *     var o = new THREE.Object3D();
 *     o.addFeatureGeometry( 'myFeature', new THREE.BoxGeometry( 1, 1, 1 ) );
 *     o.addFeatureMaterialL( 'myFeature', { color : 0x000000 } );
 *     o.generateFeatures();
 *     o.addToObject( scene, 0, 0, 0 );
 *
 * Which creates a box under the 'myFeature' feature, generates the mesh, and
 * adds it to the scene.
 *
 * For optimization purposes, o.bufferizeFeature( 'myFeature' ); could be done
 * before generateFeatures() to transform the existing geometry into a
 * THREE.BufferGeometry().
 */
/**
 * Retrieves a feature object. Features are an object with a pair of keys
 * 'geometry' and 'material'. By default these are 'undefined'.
 * 
 * @param  { string } feature The feature key to get
 * 
 * @return { Object } The feature under 'feature'
 */
THREE.Object3D.prototype.getFeature = function(feature) {
    // Check if we have already made the features container
    if (typeof this.userData.features === 'undefined')
        this.userData.features = {};
    // Check if we have not already made this feature
    if (!(feature in this.userData.features))
        this.userData.features[feature] = {
            geometry: undefined,
            material: undefined
        };
    return this.userData.features[feature];
};
/**
 * Adds a geometry object to a feature. If the feature has preexisting geometry,
 * the union of the existing geometry and the new is taken and added to the
 * feature.
 * 
 * @param { string }         feature  Feature to add geometry to
 * @param { THREE.Geometry } geometry New geometry to add to feature
 * 
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addFeatureGeometry = function(feature, geometry) {
    var f = this.getFeature(feature);
    if (typeof f.geometry === 'undefined')
        f.geometry = geometry;
    else
        f.geometry = f.geometry.mergeGeometry([geometry]);
    return this;
}
/**
 * Takes the union of an array of geometries with the existing geometry of the
 * feature.
 *
 * @param { string }           feature    Feature to add geometries to
 * @param { THREE.Geometry[] } geometries An array of geometries to add
 * 
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addFeatureGeometries = function(feature, geometries) {
    var f = this.getFeature(feature);
    if (typeof f.geometry === 'undefined')
        f.geometry = new THREE.Geometry();
    f.geometry = f.geometry.mergeGeometry(geometries);
    return this;
}
/**
 * Transforms existing geometry of a feature into THREE.BufferGeometry for
 * optimization purposes.
 *
 * @param { string } feature Feature to bufferize geometry
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.bufferizeFeature = function(feature) {
    var f = this.getFeature(feature);
    f.geometry = new THREE.BufferGeometry()
        .fromGeometry(f.geometry);
    return this;
}
/**
 * Updates the geometry of the features contained recursively in the object.
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.updateFeatures = function() {
    // Recursively traverse the object
    this.traverse(function(o) {
        // Skip simple meshes - we have the reference already in the feature
        if (o.type === 'mesh')
            return;
        // Iterate through features
        for (var f in o.userData.features) {
            g = o.userData.features[f].geometry;
            // BufferGeometry is practically immutable - don't worry about it
            if (g.type !== 'BufferGeometry') {
                g.verticesNeedUpdate = true;
                g.computeFaceNormals();
                g.computeVertexNormals();
            }
        }
    });
    return this;
}
/**
 * Adds a Lambert material to a feature with specified attributes.
 *
 * @param { string } feature    Feature to add material to
 * @param { Object } attributes Attributes to initialize material with
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addFeatureMaterialL = function(feature, attributes) {
    var f = this.getFeature(feature);
    f.material = new THREE.MeshLambertMaterial(attributes);
    return this;
}
/**
 * Adds a Phonic material to a feature with specified attributes.
 *
 * @param { string } feature    Feature to add material to
 * @param { Object } attributes Attributes to initialize material with
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addFeatureMaterialP = function(feature, attributes) {
    var f = this.getFeature(feature);
    f.material = new THREE.MeshPhongMaterial(attributes);
    return this;
}
/**
 * Generate the meshes for the features held by this object. Must be called
 * or nothing will be displayed in the scene.
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.generateFeatures = function() {
    for (var c in this.children) {
        if (c.type == 'mesh')
            this.remove(c);
    }
    this.updateFeatures();
    for (var f in this.userData.features) {
        f = this.userData.features[f];
        var mesh = new THREE.Mesh(f.geometry, f.material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.type = 'mesh';
        this.add(mesh);
    }
    return this;
}
/**
 * Adds an update callback function that is called on every refresh of the scene,
 * allowing for animation or updates on events.
 *
 * @param { function( THREE.Object3D ) } callback Callback function to add
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addUpdateCallback = function(callback) {
    if (typeof this.userData.update === 'undefined')
        this.userData.update = [];
    this.userData.update.push(callback);
    return this;
}
/**
 * Clears the update callback list of an object.
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.clearUpdateCallbacks = function() {
    this.userData.update = [];
    return this;
}
/**
 * Recursively calls the update callbacks added to an Object3D.
 */
THREE.Object3D.prototype.update = function() {
    this.traverse(function(obj) {
        if (typeof obj.userData.update !== 'undefined')
            for (var i = 0; i < obj.userData.update.length; ++i)
                obj.userData.update[i](obj);
    });
}
/**
 * Adds this object to another object at a specified location.
 *
 * @param { THREE.Object3D } object The object to add this to
 * @param { number }         x      Relative x coordinate
 * @param { number }         y      Relative y coordinate
 * @param { number }         z      Relative z coordinate
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addToObject = function(object, x, y, z) {
    if (typeof x !== 'undefined')
        this.position.x = x;
    if (typeof y !== 'undefined')
        this.position.y = y;
    if (typeof z !== 'undefined')
        this.position.z = z;
    object.add(this);
    this.updateMatrixWorld();
    return this;
}
/**
 * Traverses overall all vertices contained inside an object's feature.
 *
 * @param { string }                    feature  Feature to traverse
 * @param { function( THREE.Vector3 ) } callback Callback function
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.traverseFeatureGeometry = function(feature, callback) {
    var f = this.getFeature(feature);
    if (f.geometry.type !== 'BufferGeometry')
        for (var i = 0, l = f.geometry.vertices.length; i < l; i++)
            callback(f.geometry.vertices[i]);
    this.updateFeatures();
    return this;
}
/**
 * Traverses overall all vertices contained inside an object.
 *
 * @param { function( THREE.Vector3 ) } Callback function called for every vertex
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.traverseGeometry = function(callback) {
    this.traverseVisible(function(obj) {
        for (var f in obj.userData.features)
            obj.traverseFeatureGeometry(f, callback);
    });
    this.updateFeatures();
    return this;
}
/**
 * Calculate the bounding circle for an Object3D at its greatest extent. Returns
 * an object containing the center coordinate and radius of the bounding circle.
 *
 * @returns { Object }        bound        The bounding circle of the object
 * @returns { THREE.Vector3 } bound.center The center of the bounding circle
 * @returns { number }        bound.radius The radius of the bounding circle
 */
THREE.Object3D.prototype.boundingCircle = function() {
    var center = new THREE.Vector3();
    var outer = new THREE.Vector3();
    var n = 0;
    // Calculate centroid of object (average of all vertices)
    this.traverseGeometry(function(v) {
        center.add(v);
        n++;
    });
    center.divideScalar(n);
    center.z = 0;
    var ca = center.abs();
    // Find the point farthest from the centroid to determine radius
    var m = 0;
    this.traverseGeometry(function(v) {
        var t = v.clone();
        t.z = 0;
        var d = t.sub(ca)
            .l2();
        if (d > m) {
            m = d;
            outer.copy(t);
        }
    });
    var r = outer.abs()
        .sub(center.abs());
    return {
        center: center,
        radius: r.l2()
    };
}
/**
 * Creates a floating text label above the object.
 * Adapted from https://bocoup.com/weblog/learning-three-js-with-real-world-challenges-that-have-already-been-solved
 *
 * @param { string } text The text to display in the label
 * 
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.setText = function(text) {
    if (typeof this.userData.text !== 'undefined')
        this.remove(this.userData.text);
    var fontface = 'Helvetica';
    var fontsize = 20;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;
    // get size data (height depends only on font size)
    var metrics = context.measureText(text);
    var textWidth = metrics.width;
    // text color
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(text, 0, fontsize);
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    this.add(sprite);
    this.userData.text = sprite;
    return this;
}
/**
 * Adds this object to another object at a specified location, projected onto
 * the other object's surface.
 *
 * @param { THREE.Object3D } object The object to add this to
 * @param { number }         x      Relative x coordinate
 * @param { number }         y      Relative y coordinate
 * @param { THREE.Vector3 }  vector Direction of projection. Negative Z by default
 *
 * @throws { string } Error is thrown if object does not intersect with other object
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addToObjectProject = function(object, x, y, vector) {
    if (typeof vector === 'undefined')
        vector = new THREE.Vector3(0, 0, -1);
    var raycaster = new THREE.Raycaster();
    // Total hack with the Z value. Should really try to see maximum extent from bounding box.
    raycaster.set(object.localToWorld(new THREE.Vector3(x, y, 100)),
        vector);
    var intersects = raycaster.intersectObject(object, true);
    if (intersects.length) {
        var position = object.worldToLocal(intersects[0].point);
        var orientation = intersects[0].face.normal;
        this.addToObject(object, x, y, position.z);
        return this;
    }
    throw "Projection error: No intersection";
}
/*
 * Add an audio file to an object. This audio file can then be played for fun
 * positional audio effects. Note that if you are running the rock garden
 * locally you need to host the files through a server or you are going to get
 * hit with CORS problems.
 *
 * @param { string }  source   URL for audio source file
 * @param { number }  volume   Volume gain of source. Between 0 and 1 inclusive
 * @param { boolean } loop     Does this audio source loop?
 * @param { number }  distance Reference distance for reducing volume. If
 *                             undefined assumes global ambient audio source
 *
 * @return { THREE.Object3D } This
 */
THREE.Object3D.prototype.addAudio = function(source, volume, loop, distance) {
    var sound;
    if (typeof distance === 'undefined') {
        sound = new THREE.Audio(listener);
    } else {
        sound = new THREE.PositionalAudio(listener);
    }
    try {
        audioLoader.load(
            source,
            function(buffer) { // On Load
                sound.setBuffer(buffer);
                sound.setLoop(loop);
                sound.setVolume(volume);
                if (typeof distance !== 'undefined')
                    sound.setRefDistance(distance);
                if (sound.playOnLoad)
                    sound.play();
            },
            function(xhr) { // In Progress
                console.log("Audio file {0} {1}% loaded.".format(source,
                    xhr.loaded / xhr.total * 100));
            },
            function(xhr) { // On Error (I.E. CORS is borked)
                alertWarning(
                    "Failed to load audio file {0}. CORS is probably broken."
                    .format(source));
            });
        this.userData.sound = sound;
        sound.addToObject(this);
    } catch (e) {
        alertWarning(e);
    }
}
/**
 * Plays attached audio source.
 */
THREE.Object3D.prototype.playAudio = function() {
    var sound = this.userData.sound;
    if (typeof sound !== 'undefined') {
        if (sound.sourceType === 'empty')
            sound.playOnLoad = true;
        else
            this.userData.sound.play();
    }
}
/**
 * Pauses attached audio source.
 */
THREE.Object3D.prototype.pauseAudio = function() {
    var sound = this.userData.sound;
    if (typeof sound !== 'undefined')
        this.userData.sound.pause();
}
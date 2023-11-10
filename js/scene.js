// Application Globals
var camera, controls, scene, renderer, clock, stats, listener, audioLoader;
var garbage = [];
var lock = false;
var environment = {}; 
var tick = 0;

var kernel = new CommandLine(environment);

// Configurable Variables
var userData = {
    season: 0, // 0-3 
    time: 15, // 0-24
    weather: "rain", // [clear, rain, clouds, ice]
    temp: 69,
    location: null
}
// "Mode" variables
var speedMode = true;
var weathermode = true;
var nightMode = false;
var windmode = false;

init();
render();
animate();

// Shove everything into uber environment object.
function createUI() {
    stats = new Stats();
    stats.showPanel(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.display = 'none';
    stats.domElement.style.margin = '10px 15px auto';
    document.body.appendChild(stats.domElement);
    $("#command-line")
        .attr("value", "")
        .attr("type", "text")
        .attr("enable", true);
    $("#command-line")
        .css({
            "visibility": "visible",
            "height": "30px",
            "text-align": "left"
        })
    $("#command-line")
        .click(function() {
            $("#command-line")
                .focus()
        })
    $("#command-line")
        .keypress(function(e) {
            if (e.which == 13) {
                $("#regenerator")
                    .click();
            }
        });
    $("#regenerator")
        .attr("text", "Regenerate")
        .attr("enable", true);
    $("#regenerator")
        .click(function() {
            var rval = $("#command-line")
                .val();
            console.log(rval)
            $("#command-line")
                .val("")
            kernel.parse(rval);
            createEnvironment(70, 50, 2);
        })
    $("#regenerator")
        .css({
            "text-align": "center",
            "height": "30px"
        })
    $("#help")
        .css({
            "padding-left": "2px",
            "height": "30px",
            "text-align": "center",
            "border-radius": "50%"
        })
    $("#help")
        .click(function() {
            document.getElementById("mySidenav")
                .style.width = "50%";
        })
    $("#help-text")
        .css({
            "text-align": "left"
        })
    $.get("https://raw.githubusercontent.com/zkingston/coroga/arpha/README.md",
        function(response) {
            document.getElementById("help-text")
                .innerHTML = "<pre>" + response + "</pre>";
        });
}

function videoKilledTheRadioStar() {
    environment.sand.traverse(function(obj) {
        var sound = obj.userData.sound;
        if (typeof sound !== 'undefined') {
            sound.disconnect();
            delete sound;
        }
    });
}

function init() {
    createUI();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window
        .innerHeight, 1, 1000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(0, -200, 50);
    camera.lookAt(0, 0, 0);
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    controls = new THREE.OrbitControls(camera);
    var angleOffset = Math.PI / 32;
    controls.minDistance = 5;
    controls.maxDistance = 500;
    controls.minPolarAngle = 0 + angleOffset;
    controls.maxPolarAngle = Math.PI / 2 - angleOffset;
    controls.addEventListener('change', render);
    container = document.getElementById('canvas');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    createBase();
    createEnvironment(70, 50, 2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function block() {} //SICK HACKS, DONT REMOVE
function animate() {
    stats.begin();
    render();
    tick++;
    setTimeout(block, 17);
    scene.update();
    controls.update();
    for (var i = 0; i < garbage.length; ++i) scene.remove(garbage[i]);
    stats.end();
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

function initializeLights() {
    var sceneLight = new THREE.HemisphereLight(0xc2c2dd, 0x40c2c2, .1);
    scene.add(sceneLight);
    environment.hemiLight = sceneLight;
    var lamp = new THREE.DirectionalLight(0xdddddd, 0.5);
    lamp.position.set(0, 10, 30);
    lamp.castShadow = true;
    scene.add(lamp);
    environment.lamp = lamp;
}

function createBase(width, height, depth) {
    scene = new THREE.Scene();
    initializeLights();
    // scene.addAudio( 'audio/ambiance.ogg', 0.1, true );
    // scene.playAudio();
    environment.width = width;
    environment.height = height;
    environment.depth = depth;
    environment.radius = Math.sqrt(height * height / 4 + width * width / 4);
}

function createEnvironment(width, height, depth) {
    if (lock) {
        return;
    }
    if (typeof environment.island !== 'undefined') {
        var destructor = new DestructorEngine()
        destructor.predestruct()
        islandSwitch();
        destructor.postdestruct()
        var terraformer = new TerraformerEngine(environment);
        terraformer.terraform(environment.island);
    } else {
        var cfg = features.island;
        var islandWidth = discreteUniform(cfg.width.min, cfg.width.max);
        var islandHeight = discreteUniform(cfg.height.min, cfg.height.max);
        var island = islandCreate(islandWidth, islandHeight);
        var terraformer = new TerraformerEngine(environment);
        island = terraformer.terraform(island);
        island.addToObject(scene);
        environment.island = island;
        environment.width = islandWidth;
        environment.height = islandHeight;
    }
    if (typeof environment.sand !== 'undefined') {
        videoKilledTheRadioStar();
        scene.remove(environment.sand);
    }
    if (nightMode) {
        scene.fog = new THREE.FogExp2(0x001331, 0.0025);
        renderer.setClearColor(0x001331, 1);
        environment.lamp = new THREE.DirectionalLight(0x292929, 0.5);
        if (typeof environment.stars === 'undefined') {
            stars = createStars();
            environment.stars = stars;
            scene.add(stars);
        } else {
            scene.add(environment.stars);
        }
    } else {
        scene.fog = new THREE.FogExp2(0xaaccff, 0.005);
        renderer.setClearColor(0xaaccff, 1);
        environment.lamp = new THREE.DirectionalLight(0xdddddd, 0.5);
    }
    var weather = new WeatherEngine();
    weather.thundergodsOracle();
    var placer = new PlacementEngine(environment, scene);
    placer.runRandomTileEngine();
}
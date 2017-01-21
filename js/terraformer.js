function TerraformerEngine(input)
{
    //this.placementEngine = placementEngine;

    this.env= input;

    this.makeSand = function ( island ) {

        var cfg = features.island.sand;

        var width = island.userData.width;
        var height = island.userData.height;


        // Mathematical Representation used for transferability and bounds

        var border = 10;

        var sandInequality = (function(){
            var a = (width - border);
            var b = (height - border);
            var t = continuousUniform(0, 2 * pi)
            var h = width * cos(t);
            var k = height * sin(t);
            var radius = (sqrt(pow2(h) + pow2(k)));



            return function (x, y){
                if( //inclusion
                    (pow2(x)/pow2(a)+ pow2(y)/(pow2(b)) < 1) &&
                    //exclusion
                    (pow2(x-h)/pow2(radius)+ pow2(y-k)/(pow2(radius)) > 1)
                ){
                    return true;
                }
                return false;
            };
        })();



        // TODO Fix this;
        // This is a hardcoded parametric ellipse bounds checker.
        // Eventually this needs to be passed in.

        var islandCurve = function(x,y){

            var xr = width;
            var yr = height;

            if (((x*x)/(xr*xr))+((y*y)/(yr*yr))<1){
                return true
            }else{
                return false;
            }
        }



        // TODO: Fix. Grass isnt necessarily where island is, but sand isnt.
        var grassInequality = function(x,y){
            if (!(sandInequality(x,y)) && islandCurve(x,y)){
                return true;
            }
            return false;
        }

        island.userData.curves = {};

        island.userData.curves["island"] = islandCurve;
        island.userData.curves["sand"] = sandInequality;
        island.userData.curves["grass"] = grassInequality;



        var rakeModifier = 6;
        var rakeHeight = 0.125;
        var sandRandom = 0.08;
        var sideRakeBuffer = 5;

        var sand = new THREE.Object3D();
        var sandGeometry = new THREE.PlaneGeometry( width*2, height*2,
                                            width*2, height*2 );


        //Cut out all face not inside the bounding ellipse
        sandGeometry.cut( function ( face ) {
            var centroid = sandGeometry.faceCentroid( face );
            return sandInequality (centroid.x/3, centroid.y/3);
        } );

        // Rake the sand
        sandGeometry.vertices.map( function ( vertex ) {
            vertex.z = Math.sin( vertex.x * cfg.modifier ) * cfg.height + 2;
        } );

        sand.addFeatureGeometry( 'sand', sandGeometry ) ;
        sand.addFeatureMaterialP( 'sand', { color : 0xfcfbdf,
                                           shading : THREE.FlatShading,
                                           shininess : 10,
                                           refractionRatio : 0.5 } );


        sand.generateFeatures();
        sand.addToObject( island,0,0,0 );

        environment.sand = sand;


        island.userData.sand = [];




        return island;
    };

    this.rakeSand = function (sand)
    {

    }


    this.terraform = function (berg)
    {


        // Raise Sand/Lower ground
        // Add Water body TODO;
        // Mark sand or in placement engine.
        this.makeSand(berg);
        berg.generateFeatures();
        return berg
    }
}

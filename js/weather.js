function WeatherEngine()
{
    this.atmoData = {
      season : 0, // 0-3 TODO: perhaps make this location based. for our southern hemisphere clientele
      time : 12, // 0-24
      weather : "clear", //[clear, rain, clouds, ice]
      temp : 69  // Murica units
    }; //Random or weather based.

    this.skyColors = [
      0xaaccff, //light
      0x88aee8,
      0x4372b7,
      0x244f91,
      0x123568,
      0x001331  //dark
    ];
    this.skyColor = function(hour){

      var bucket = round(this.skyColors.length * abs(hour - 12)/12);
      if(bucket == this.skyColors.length){bucket-=1;}

      return this.skyColors[bucket];
    }

    this.setAtmoData = function(){
      if (weathermode == true){
        var date = new Date();
        this.atmoData.dateObject = date;
        this.atmoData.time = date.getHours();
      }

    }
    this.thundergodsOracle = function(){
        this.setAtmoData();
        // Season
        // Weather
        // Check for seasonal or atmospheric overrides


        // else, default to time of day

        var hour = this.atmoData.time
        console.log("TIME", hour)
        var color = this.skyColor(hour)

        renderer.setClearColor( color, 1 );
        scene.fog = new THREE.FogExp2( color, 0.0025 );
        environment.lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );

        var night = false;
        if((hour >= 0 && hour <= 4)||(hour <= 24 && hour >= 20)){night = true;}
        console.log(night);
        if (night){
              //if (!environment.stars) {
                  var stars = createStars();
                  environment.stars = stars;
                  scene.add(stars);
                  environment.lamp = new THREE.DirectionalLight( 0x292929, 0.5 )

        }else{scene.remove(environment.stars);}


        //   nightMode = false;
        //
        // if (nightMode) {
        //     scene.fog = new THREE.FogExp2( 0x001331, 0.0025 );
        //     renderer.setClearColor( 0x001331, 1 );
        //     environment.lamp = new THREE.DirectionalLight( 0x292929, 0.5 );
        //     if (typeof environment.stars === 'undefined') {
        //         stars = createStars();
        //         environment.stars = stars;
        //         scene.add(stars);
        //     }
        //     else {
        //         scene.add(environment.stars);
        //     }
        // }
        // else {
        //     scene.fog = new THREE.FogExp2( 0xaaccff, 0.005 );
        //     renderer.setClearColor( 0xaaccff, 1 );
        //     environment.lamp = new THREE.DirectionalLight( 0xdddddd, 0.5 );
        // }
        //










    }


}

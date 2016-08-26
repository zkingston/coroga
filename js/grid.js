/**
* Overlays a positive grid starting from the bottom left corner of the map.
* This grid is a matrix indexing from [0][0]. Goes from 0 to +X and 0 to +Y
* If the garden is of an irregular shape, this grid should cover the smallest
* rectangle that surrounds the garden, and the unusable tiles marked.
*
* For example a garden with x range -35,35 and y range -25,25,
* [0][0] would be -35,-25
*
* Right now the system uses a sparse representation of the matrix.
*
* @param {number} xlow The lowerbound of the garden's bounding box x
* @param {number} xhigh The upperbound of the garden's bounding box x
* @param {number} ylow The lowerbound of the garden's bounding box y
* @param {number} yhigh The upperbound of the garden's bounding box y
**/

function Grid(xlow, xhigh, ylow, yhigh, curve) {

    this.xlow = xlow;
    this.xhigh = xhigh;
    this.ylow =  ylow;
    this.yhigh = yhigh;
    this.curve = curve;
    this.tiles = [];


    if(xhigh < xlow || yhigh < ylow){
        console.log("Error in environment dimensions. Grid.js");
    }

    /** Maps from the matrix representation to the continuous scene coords
    * @param {number} x The integer x column of the grid
    * @param {number} x The integer y column of the grid
    *
    * @return {object} an object that represents the transformed point.
    **/
    this.mapping = function (x,y) {
        return {
            "x" : x + xlow,
            "y" : y + ylow
        }
    }

    // Backup Plan
    // var xRange = xhigh - xlow;
    // var yRange = yhigh - ylow;
    //this.grid = Array(xRange).fill(Array(yRange).fill(null));

    /**
    * Given two rectangle representations of the bottom left corner position
    * and the length and width, do the rectangles intersect?
    *
    * @param {object} t1 The first rectangle
    * @param {object} t2 The second rectangle
    * @return{boolean} do they intersect
    *
    **/

    this.checkIntersection = function(t1,t2){
        if( ((t1.yPos + t1.ySize) <= t2.yPos) ||
            (t1.yPos >= (t2.yPos + t2.ySize)) ||
            ((t1.xPos + t1.xSize) <= t2.xPos) ||
            (t1.xPos >= (t2.xPos + t2.xSize)) )
        {
            return false;
        }
        return true;
    }

    this.markUnavailable = function(xIn, xSize, yIn, ySize){
        // Turn the coords into the grid format and add the region.
        var region = {
            "xPos" : max(0,floor(xIn - xlow)),
            "xSize" : xSize,
            "yPos" : max(0,floor(yIn - ylow)),
            "ySize" : ySize
        };
        this.tiles.push(region);
    }
    // Lazily and greedily tries to find space.
    // TODO make XCOM quilt zones possibly. idk.
    // TODO make space finding algorithm not stupid.
    /**
    * Given the area of a proposed tile, this function returns a position
    * that is available for it to occupy. This can be substituted with a more
    * complex allocation algorithm.
    * @param {number} xSizeIn The width of the region to be allocated
    * @param {number} ySizeIn The length of the region to be allocated
    * @return {object} The position of the bottom left corner of the region
    **/
    this.allocate = function(xSizeIn, ySizeIn){
        // Try 10 times to find a good spot for it.
        // Obviously there is a complete and exact solution
        // But this should prove concept.
        for(var tries = 0; tries < 20; tries++){

            var candidate = {
                "xPos" : uniform(0, xhigh - xlow - xSizeIn),
                "xSize" : xSizeIn,
                "yPos" : uniform(0, yhigh - ylow - ySizeIn),
                "ySize" : ySizeIn
            };

            // Check if this is even on solid land
            // See if all verteces are in the map.
            var c = candidate;
            if(
                (curve(c.xPos,c.yPos) &&
                curve(c.xPos + c.xSize, c.yPos) &&
                curve(c.xPos, c.yPos + c.ySize) &&
                curve(c.xPos + c.xSize, c.yPos + c.ySize)) == false
            ){
                continue;
            }

            // If there is nothing allocated yet, there is no conflict
            if (this.tiles.length == 0){
                return this.mapping(candidate.xPos,candidate.yPos);
            }

            // If there is stuff allocated, Find a free tile.
            for(var tile = 0; tile < this.tiles.length; tile++){
                if(this.checkIntersection(candidate, this.tiles[tile]) == false){
                    this.tiles.push(candidate);
                    return this.mapping(candidate.xPos,candidate.yPos);
                }
            }
        }
        // Tried and failed.
        return null;
    }
}

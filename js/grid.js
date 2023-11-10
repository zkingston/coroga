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
function Grid(xlow, xhigh, ylow, yhigh, curves) {
    this.xlow = xlow;
    this.xhigh = xhigh;
    this.ylow = ylow;
    this.yhigh = yhigh;
    this.curves = curves;
    this.tiles = [];
    console.log("Dimensions", this.xlow, this.xhigh, this.ylow, this.yhigh)
    if (xhigh < xlow || yhigh < ylow) {
        console.log("Error in environment dimensions. Grid.js");
    }
    /** Maps from the matrix representation to the continuous scene coords
     * @param {number} x The integer x column of the grid
     * @param {number} x The integer y column of the grid
     *
     * @return {object} an object that represents the transformed point.
     **/
    this.mapping = function(x, y) {
        return {
            "x": x - xhigh,
            "y": y - yhigh
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
    this.checkIntersection = function(t1, t2) {
        if (((t1.y2) <= t2.y1) ||
            (t1.y1 >= (t2.y2)) ||
            ((t1.x2) <= t2.x1) ||
            (t1.x1 >= (t2.x2))) {
            return false;
        }
        return true;
    }
    this.markUnavailable = function(xIn, xSize, yIn, ySize) {
        // Turn the coords into the grid format and add the region.
        var region = {
            "xPos": max(0, floor(xIn - xlow)),
            "xSize": xSize,
            "yPos": max(0, floor(yIn - ylow)),
            "ySize": ySize
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
    this.allocate = function(xSizeIn, ySizeIn, buffer, terrain) {
        // Try 10 times to find a good spot for it.
        // Obviously there is a complete and exact solution
        // But this should prove concept.
        //var curve = this.curve;
        // TODO: Efficiently generate candidates
        function candidate() {
            // this.x1 = uniform(0, xhigh - xlow - xSizeIn);
            // this.y1 = uniform(0, yhigh - ylow - ySizeIn);
            this.x1 = uniform(0, xhigh - xlow);
            this.y1 = uniform(0, yhigh - ylow);
            this.x2 = this.x1 + xSizeIn;
            this.y2 = this.y1 + ySizeIn;
            return this;
        };
        var checkCurve = function(curve, c) {
            var ca = {
                x1: c.x1 + xlow,
                x2: c.x2 + xlow,
                y1: c.y1 + ylow,
                y2: c.y2 + ylow,
            };
            return (curve(ca.x1, ca.y1) &&
                curve(ca.x2, ca.y1) &&
                curve(ca.x1, ca.y2) &&
                curve(ca.x2, ca.y2));
        }
        // for(var test = 0; test<100; test++){
        //     var c = new candidate();
        //     if(checkCurve(this.curves.sand, c)){
        //         debugBall(this.mapping(c.x1, c.y1).x,this.mapping(c.x1, c.y1).y,10);
        //     }
        // }
        for (var tries = 0; tries < 20; tries++) {
            var c = new candidate();
            // debugBall(this.mapping(c.x1, c.y1).x,this.mapping(c.x1, c.y1).y,10);
            // Check if this is even on solid land
            // See if all verteces are in the map.
            if (checkCurve(this.curves.island, c) == false) {
                continue;
            }
            var valid = false;
            for (var t = 0; t < terrain.length; t++) {
                curve = curves[terrain[t]];
                if (checkCurve(curve, c) == true) {
                    valid = true;
                    break;
                }
            }
            if (valid == false) {
                continue;
            }
            var cbuffered = {
                x1: c.x1 - buffer,
                y1: c.y1 - buffer,
                x2: c.x2 + buffer,
                y2: c.y2 + buffer,
            }
            // If there is nothing allocated yet, there is no conflict
            if (this.tiles.length == 0) {
                this.tiles.push(cbuffered);
                return this.mapping(c.x1, c.y1);
            }
            // If there is stuff allocated, Find a free tile.
            for (var tile = 0; tile < this.tiles.length; tile++) {
                if (this.checkIntersection(c, this.tiles[tile]) == true) {
                    valid = false;
                    break;
                }
            }
            if (valid == true) {
                this.tiles.push(cbuffered);
                return this.mapping(c.x1, c.y1);
            }
        }
        // Tried and failed.
        return null;
    }
}
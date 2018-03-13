
var grobjects = grobjects || [];

var Trunk = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

// constructor for tree truk
Trunk = function Trunk(name, position, size, color) {
    this.name = name;
    this.position = position || [0,0,0];
    this.size = size || 1.0;
    this.color = color || [0.647,0.165,0.165];
};
Trunk.prototype.init = function(drawingState) {
    var gl=drawingState.gl;
    if (!shaderProgram) {
        shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
    }
    if (!buffers) {
        var arrays = {
            vpos : { numComponents: 3, data: [
                -.10,-1.0,-.10,  .10,-1.0,-.10,  .10, 1.0,-.10,        -.10,-1.0,-.10,  .10, 1.0,-.10, -.10, 1.0,-.10,
                -.10,-1.0, .10,  .10,-1.0, .10,  .10, 1.0, .10,        -.10,-1.0, .10,  .10, 1.0, .10, -.10, 1.0, .10,
                -.10,-1.0,-.10,  .10,-1.0,-.10,  .10,-1.0, .10,        -.10,-1.0,-.10,  .10,-1.0, .10, -.10,-1.0, .10,
                -.10, 1.0,-.10,  .10, 1.0,-.10,  .10, 1.0, .10,        -.10, 1.0,-.10,  .10, 1.0, .10, -.10, 1.0, .10,
                -.10,-1.0,-.10, -.10, 1.0,-.10, -.10, 1.0, .10,        -.10,-1.0,-.10, -.10, 1.0, .10, -.10,-1.0, .10,
                .10,-1.0,-.10,  .10, 1.0,-.10,  .10, 1.0, .10,         .10,-1.0,-.10,  .10, 1.0, .10,  .10,-1.0, .10
            ] },
            vnormal : {numComponents:3, data: [
                0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
            ]}
        };
        buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }

};
Trunk.prototype.draw = function(drawingState) {
    for (var i = 0; i < 8; i++) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    }
};
Trunk.prototype.center = function(drawingState) {
    return this.position;
};
})();
// add a tree trunks to scene
grobjects.push(new Trunk("trunk1",[-1.5,1,0],1));
grobjects.push(new Trunk("trunk1",[2.5,1,0],1));
// I'm reusing this for the umbrella pole :)
grobjects.push(new Trunk("trunk1",[3,0.65,3],0.65,[0.6,0.6,0.6]));
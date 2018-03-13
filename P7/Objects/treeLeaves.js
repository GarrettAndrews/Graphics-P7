
var grobjects = grobjects || [];

var Leaves = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Leaves
    Leaves = function Leaves(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [0,1,0];
        this.range = 0;
        this.flipflop = 1;
    };
    Leaves.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.025,-.5,-.025,  .025,-.5,-.025,  .025, .5,-.025,        -.025,-.5,-.025,  .025, .5,-.025, -.025, .5,-.025,
                    -.025,-.5, .025,  .025,-.5, .025,  .025, .5, .025,        -.025,-.5, .025,  .025, .5, .025, -.025, .5, .025,
                    -.025,-.5,-.025,  .025,-.5,-.025,  .025,-.5, .025,        -.025,-.5,-.025,  .025,-.5, .025, -.025,-.5, .025,
                    -.025, .5,-.025,  .025, .5,-.025,  .025, .5, .025,        -.025, .5,-.025,  .025, .5, .025, -.025, .5, .025,
                    -.025,-.5,-.025, -.025, .5,-.025, -.025, .5, .025,        -.025,-.5,-.025, -.025, .5, .025, -.025,-.5, .025,
                    .025,-.5,-.025,  .025, .5,-.025,  .025, .5, .025,         .025,-.5,-.025,  .025, .5, .025,  .025,-.5, .025
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
    Leaves.prototype.draw = function(drawingState) {
        for (var i = 0; i < 8; i++) {
            var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
            if (i%2 === 0) {
                twgl.m4.rotateX(modelM, 2*i+this.range, modelM);
            }
            else {
                twgl.m4.rotateZ(modelM, 2*i+this.range, modelM);
            }
            twgl.m4.setTranslation(modelM,this.position,modelM);
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
            twgl.setUniforms(shaderProgram,{
                view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
                cubecolor:this.color, model: modelM });
            twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        }
        if (this.range >= 0.2 && this.flipflop === 1) {
            this.flipflop = 0;
            this.range -= 0.01;
        }
        else if (this.range <= 0 && this.flipflop === 0) {
            this.flipflop = 1;
            this.range += 0.01;
        }
        else if (this.range > 0 && this.flipflop === 0) {
            this.range -= 0.01;
        }
        else if (this.range < 0.2 && this.flipflop === 1) {
            this.range += 0.01;
        }

    };
    Leaves.prototype.center = function(drawingState) {
        return this.position;
    };
})();

// tree 1 leaves
var offset = -1.5;
for (var k = 0; k < 6.5;) {
    grobjects.push(new Leaves("leaves"+k,[offset+Math.cos(k),3+Math.sin(k),0],1));
    grobjects.push(new Leaves("leaves"+k,[offset+Math.cos(k)/2,3+Math.sin(k)/2,0],1));
    k += 0.1;
}

// tree 2 leaves
var offset = 2.5;
for (var k = 0; k < 7; k++) {
    if (k === 0) {
        for (var j = 0; j < 3;) {
            grobjects.push(new Leaves("leaves"+k+","+j,[offset+Math.cos(j)+1,2+Math.sin(j),0],1));
            j += 0.15
        }
    }
    if (k === 2) {
        for (var j = 0; j < 3;) {
            grobjects.push(new Leaves("leaves"+k+","+j,[offset,2+Math.sin(j),Math.cos(j)+1],1));
            j += 0.15
        }
    }
    if (k === 4) {
        for (var j = 0; j < 3;) {
            grobjects.push(new Leaves("leaves"+k+","+j,[offset+Math.cos(j)-1,2+Math.sin(j),0],1));
            j += 0.15
        }
    }
    if (k === 6) {
        for (var j = 0; j < 3;) {
            grobjects.push(new Leaves("leaves"+k+","+j,[offset,2+Math.sin(j),Math.cos(j)-1],1));
            j += 0.15
        }
    }
}



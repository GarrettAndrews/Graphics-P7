
var grobjects = grobjects || [];

var Smoke = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    Smoke = function Smoke(name, position, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = [1.0,1.0,1.0];
        this.range = 0.0;
    };
    Smoke.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["smoke-vs", "smoke-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.0, 1.0,  0.0
                ] },
                vnormal : {numComponents:3, data: [
                    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Smoke.prototype.draw = function(drawingState) {
        this.position[1] = this.position[1]+0.01;
        if (this.position[1] >= 3) {
            this.range = this.range + 0.01;
        }
        if (this.position[1] > 6) {
            // reset when it reaches a max height
            this.position[1] = 0;
            this.range = 0.0;
        }
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/600.0;
        // I was testing if rotating might add some cool effects to the smoke, but it did not really...
        /*twgl.m4.rotateY(modelM, theta, modelM);
        twgl.m4.rotateX(modelM, theta, modelM);
        twgl.m4.rotateZ(modelM, theta, modelM);*/
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, transparencyOffset: this.range});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

    };
    Smoke.prototype.center = function(drawingState) {
        return this.position;
    };

})();
// add lots of smoke!
// this needs some work for the next version... Maybe having some high-poly cloud object would be better
for (var k = 0; k < 120; k++) {
    var random1 = Math.random();
    var random2 = Math.random()*6;
    var random3 = Math.random();
    grobjects.push(new Smoke("smoke1",[-1+random1,0+random2,-6+random3],0.25));
}


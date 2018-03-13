
var grobjects = grobjects || [];

var Umbrella = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

// constructor for a mountain
    // this is mostly a test to see how creating a model in Google Sketchup works for importing into the project.
    Umbrella = function Umbrella(name, position, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = [0,0,1];
    };
    Umbrella.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["alt-vs", "alt-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    2.53629261421211,1.9,-11.1448915069603,-35.1937070988956,1.9,-31.1383184680617,0.986108414680756,23.5,-53.8167432238419,0.986108414680756,23.5,-53.8167432238419,-36.7438912984269,1.9,-73.8101701849432,-0.564075784850592,1.9,-96.4885949407233,37.165923928257,1.9,-76.495167979622,0.986108414680756,23.5,-53.8167432238419,-0.564075784850592,1.9,-96.4885949407233,38.7161081277884,1.9,-33.8233162627405,0.986108414680756,23.5,-53.8167432238419,37.165923928257,1.9,-76.495167979622,38.7161081277884,1.9,-33.8233162627405,2.53629261421211,1.9,-11.1448915069603,0.986108414680756,23.5,-53.8167432238419,0.986108414680756,23.5,-53.8167432238419,-35.1937070988956,1.9,-31.1383184680617,-36.7438912984269,1.9,-73.8101701849432
                ] },
                vnormal : {numComponents:3, data: [
                    0.236162096163344,-0.863486565580137,-0.445666260107668,0.236162096163344,-0.863486565580137,-0.445666260107668,0.236162096163344,-0.863486565580137,-0.445666260107668,0.267877254781172,-0.863486565580136,0.427355504742274,0.267877254781172,-0.863486565580136,0.427355504742274,0.267877254781172,-0.863486565580136,0.427355504742274,-0.236162096163344,-0.863486565580136,0.445666260107669,-0.236162096163344,-0.863486565580136,0.445666260107669,-0.236162096163344,-0.863486565580136,0.445666260107669,-0.504039350944516,-0.863486565580136,0.0183107553653952,-0.504039350944516,-0.863486565580136,0.0183107553653952,-0.504039350944516,-0.863486565580136,0.0183107553653952,-0.267877254781173,-0.863486565580137,-0.427355504742273,-0.267877254781173,-0.863486565580137,-0.427355504742273,-0.267877254781173,-0.863486565580137,-0.427355504742273,0.504039350944516,-0.863486565580136,-0.0183107553653946,0.504039350944516,-0.863486565580136,-0.0183107553653946,0.504039350944516,-0.863486565580136,-0.0183107553653946
                    ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };
    Umbrella.prototype.draw = function(drawingState) {
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
    Umbrella.prototype.center = function(drawingState) {
        return this.position;
    };
})();
// add a mountain
grobjects.push(new Umbrella("umbrella1",[3,1.25,4],0.02));
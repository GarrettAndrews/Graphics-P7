
var grobjects = grobjects || [];
var Rock = undefined;

(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;
    var normalMap = null;

    Rock = function Rock(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.texture = null;
        this.normalMap = null;
    };
    Rock.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (texture == null) {
            this.texture = new Texture("https://farm5.staticflickr.com/4536/38553422521_4a3c0fc2aa_z.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        if (normalMap == null) {
            this.normalMap = new Texture("https://c1.staticflickr.com/1/690/30651358784_2cd11832ef_o.png", gl, 1);
            normalMap = this.normalMap;
        }
        else {
            this.normalMap = normalMap;
        }

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rock-vs", "rock-fs"]);
        }
        if (!buffers) {
            var arrays = bucket_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            shaderProgram.program.normalMap = gl.getUniformLocation(shaderProgram.program, "normalMap");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
            gl.uniform1i(shaderProgram.program.normalMap, 1);
            initTextureThenDraw(this.normalMap);
        }
    };
    Rock.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        console.log();
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM, normalM: twgl.m4.transpose(twgl.m4.inverse(modelM))});
        gl.activeTexture(gl.TEXTURE0);
        this.texture.bindTexture();
        gl.activeTexture(gl.TEXTURE1);
        this.normalMap.bindTexture();
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Rock.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

grobjects.push(new Rock("rock1",[0,0,0],1));


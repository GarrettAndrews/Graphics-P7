
var grobjects = grobjects || [];

// make the two constructors global variables so they can be used later
var Skybox = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var skyboxBuffers = undefined;
    var texture = null;
    /*var skybox_posx = LoadedImageFiles["right.jpg"];
    var skybox_negx = LoadedImageFiles["left.jpg"];
    var skybox_posz = LoadedImageFiles["front.jpg"];
    var skybox_negz = LoadedImageFiles["back.jpg"];
    var skybox_posy = LoadedImageFiles["top.jpg"];
    var skybox_negy = LoadedImageFiles["bot.jpg"];*/
    var skybox_posx = LoadedImageFiles["skybox_posx.png"];
    var skybox_negx = LoadedImageFiles["skybox_negx.png"];
    var skybox_posz = LoadedImageFiles["skybox_posz.png"];
    var skybox_negz = LoadedImageFiles["skybox_negz.png"];
    var skybox_posy = LoadedImageFiles["skybox_posy.png"];
    var skybox_negy = LoadedImageFiles["skybox_negy.png"];

    Skybox = function Skybox(name) {
        this.name = name;
        this.position = [0,0,0];    // will be set in init
    };
    Skybox.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
        }
        if (!skyboxBuffers) {
            var arrays = cube(1000);
            skyboxBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);

            var texID = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texID);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
    };
    Skybox.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,twgl.m4.transformPoint(drawingState.camera, [0, 0, 0]),modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            projection:drawingState.proj, modelview: drawingState.view, modelM: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,skyboxBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, skyboxBuffers);
    };
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    };

    function cube(side) {
        var s = (side || 1)/2;
        var coords = [];
        var normals = [];
        var texCoords = [];
        var indices = [];
        function face(xyz, nrm) {
            var start = coords.length/3;
            var i;
            for (i = 0; i < 12; i++) {
                coords.push(xyz[i]);
            }
            for (i = 0; i < 4; i++) {
                normals.push(nrm[0],nrm[1],nrm[2]);
            }
            texCoords.push(0,0,1,0,1,1,0,1);
            indices.push(start,start+1,start+2,start,start+2,start+3);
        }
        face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
        face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
        face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
        face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
        face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
        face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );
        return {
            vertexPositions: new Float32Array(coords),
            vertexNormals: new Float32Array(normals),
            vertexTextureCoords: new Float32Array(texCoords),
            indices: new Uint16Array(indices)
        }
    }

})();

grobjects.push(new Skybox("skybox"));
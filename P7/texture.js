
function Texture(src, gl, textureNum) {
    this.src = src;
    this.image = new Image(); // New image object
    this.texture = gl.createTexture(); // Create texture object
    this.gl = gl; // Drawing context
    this.textureNum = textureNum;
}

Texture.prototype.bindTexture = function() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
}

Texture.prototype.getTexture = function() {
    return this.texture;
}

function setActiveTexture(texture, gl) {
    switch (texture) {
        case 0:
            gl.activeTexture(gl.TEXTURE0);
        case 1:
            gl.activeTexture(gl.TEXTURE1);
        case 2:
            gl.activeTexture(gl.TEXTURE2);
        case 3:
            gl.activeTexture(gl.TEXTURE3);
    }
}

function initTextureThenDraw(texture)
{
	// Fill the texture with garbage data
	setActiveTexture(texture.textureNum, texture.gl);
	texture.gl.bindTexture(texture.gl.TEXTURE_2D, texture.texture);
	texture.gl.texImage2D(texture.gl.TEXTURE_2D, 0, texture.gl.RGBA, 1, 1, 0, texture.gl.RGBA, texture.gl.UNSIGNED_BYTE, null);

	texture.image.onload = function() { LoadTexture(texture.texture, texture.image, texture.gl, texture.textureNum) };
	texture.image.crossOrigin = "anonymous";
	texture.image.src = texture.src;

	window.setTimeout(console.log("TIMEOUT"), 5000);
}

function LoadTexture(texture, image, gl, textureNum) {
	    console.log("LOAD THE TEXTURE");
        console.log(gl);
        console.log(texture);
        console.log(image);
        console.log(textureNum);
        setActiveTexture(textureNum, gl);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Option 1 : Use mipmap, select interpolation mode
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // Option 2: At least use linear filters
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Optional ... if your shader & texture coordinates go outside the [0,1] range
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function finishTextureInit(gl) {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}
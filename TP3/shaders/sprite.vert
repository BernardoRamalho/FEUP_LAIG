attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float maxX;
uniform float maxY;
uniform float x;
uniform float y;



void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord;
    vTextureCoord.x = vTextureCoord.x/maxX + x/maxX;
    vTextureCoord.y = vTextureCoord.y/maxY + y/maxY;
}
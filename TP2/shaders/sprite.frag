#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler; //fazer setActiveShader({param1 : uSampler, param2 : uSampler2})
uniform sampler2D uSampler2;

//Isto ja mete as cores direito no ecra
//O vert so precismos de fazer se quisermos algum tipo de relevo
void main() {
    //vec4 colorFilter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
    vec4 color = texture2D(uSampler, vTextureCoord);
    gl_FragColor = color;
}
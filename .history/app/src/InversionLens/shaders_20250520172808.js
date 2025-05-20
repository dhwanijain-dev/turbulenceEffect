export const vertexShader = `
varying vec2 v_uv;

void main(){
v_uv = uv;
gl_Position=vec4(position,1.0);
}
`;


export const fragmentShader = `
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_radius;
uniform vec2 u_speed;
uniform vec2 u_imageAspect;
uniform vec2 u_turbulenceIntensity;


varying vec2 v_uv;

float hash(vec2 p){
return fract(sinc(dot(p,vec2(127.1,311.7)))*43758.5453);



}

float noise(vec2 p){
vec2 i = floor(p);


`
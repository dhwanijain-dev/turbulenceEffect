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
vec2 f = fract(p);
vec2 u = f*f*(3.0-2.0*f);
return mix(
mix(hash(i+vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)),u.x),
mix(hash(i+vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)),u.x),
u.y
);
}

float turbulence(vec2 p){
float t = 0.0;
float w= 0.5;

for(int i = 0; i< 8 ;i++){
t+=abs(noise(p)) * w;
p *= 2.0;
w *= 0.5;
}
return t;
}


void main() {
vec2 uv = v_uv;
float screenAspect = u
}


`
export const vertexShader = `
varying vec2 v_uv;

void main(){
v_uv = uv;
gl_Position=vec4(position,1.0);
}
`;


export const fragmentShader = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;


`
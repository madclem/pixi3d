export default
`
attribute vec3 position;
attribute vec2 uvs;
attribute vec3 normals;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 eye;
varying vec3 lightDir;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = uvs;
    lightDir = vec3(vec3(uLightPosition.xy, .15) - vec3(uModelMatrix * vec4(position, 1.0)).xyz);
    // lightDir = vec3(vec3(0., 0., .15) - vec3(uModelMatrix * vec4(position, 1.0)).xyz);
    eye = vec3(- vec3(uViewMatrix * uModelMatrix * vec4(position, 1.0)).xyz);
    vNormal = normals;
}
`;

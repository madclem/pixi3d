export default `
    attribute vec3 position;
    attribute vec3 normals;

    varying vec3 vNormal;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {

        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.);

        vNormal = normals;
    }
`;
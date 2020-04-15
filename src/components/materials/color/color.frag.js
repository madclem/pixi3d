

export default `
uniform vec3 color;
varying vec3 vNormal;

void main()
{
    gl_FragColor = vec4(vec3(1., 0., 0.), 1.);// + (vNormal * 0.3), 1.);
}
`
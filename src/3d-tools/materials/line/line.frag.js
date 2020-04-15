
export default
`
uniform float alpha;
uniform sampler2D texture;

varying float vCounters;
varying vec2 vUV;

void main() {

  vec4 color = mix(vec4(138./255., 218./255., 252./255., 1.), vec4(1.), 1. - vCounters);

  gl_FragColor = color;
  gl_FragColor.a = (1.0 - vCounters);
//   gl_FragColor.a = 1.0;
}
`
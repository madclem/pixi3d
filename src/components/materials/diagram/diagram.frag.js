
export default
`
uniform float uTime;
uniform float uNbSeconds;
// uniform vec3 uLightPos;

varying vec2 vTextureCoord;
varying vec3 vNormal;

varying vec3 eye;
varying vec3 lightDir;

float diffuse(vec3 n, vec3 l) {
    float d = dot(normalize(n), normalize(l));
    return max(d, 0.0);
}

float diffuse(vec3 n, vec3 l, float t) {
    float d = dot(normalize(n), normalize(l));
    return mix(1.0, max(d, 0.0), t);
}

void main(void) {

    vec2 uvs = vTextureCoord * 2.0 - 1.0;
    float alpha = 1. - distance(vec2(0.5), abs(vec2(vTextureCoord)));


    // vec3 deltaPos = vec3( (uLightPos.xy - gl_FragCoord.xy) / vec2(1800., 800.), 10. );
    // vec3 lightDir = normalize(deltaPos);
    // float d = diffuse(vNormal, lightDir);

    // float d = diffuse(vNormal, vec3(uLightPos.xy, 1.));

    vec3 n = normalize(vNormal);
    vec3 l = normalize(lightDir);
    vec3 e = normalize(eye);
    
    float d = 0.;
    float intensity = max(dot(n,l), 0.0);
    if (intensity > 0.0) {
        vec3 h = normalize(l + e);
        float intSpec = max(dot(h,n), 0.0);
        d = pow(intSpec, 4.);
    }
    // float col = floor(fract(vTextureCoord.x * 5. - 0.02) + 0.04);	// faded stripes
    float col = floor(fract(vTextureCoord.x * uNbSeconds - 0.01 / 2. + uTime) + 0.01);	// faded stripes
    
    // vec4 colorCols = vec4(vec3(col) * vec3(0.5804, 0.5765, 0.5765), smoothstep(.15, 1.0, alpha * col) * 0.1);
    vec4 colorCols = vec4(vec3(col) * vec3(0.5804, 0.5765, 0.5765), smoothstep(.15, 1.0, alpha * col) * 0.1);
    vec4 colorLight = vec4(d * 1.05);
    vec4 color = colorCols * colorLight + colorLight;

    gl_FragColor = color;
    // gl_FragColor.a = smoothstep(.05, 1.0, alpha * col) * d;

    // gl_FragColor = vec4(d, 1.0);
    // gl_FragColor = vec4(vec3(0.5), smoothstep(.55, 1.0, alpha));
    // gl_FragColor.rgb *= alpha;
    // gl_FragColor = vec4(1., 0., 0., 1.);
    // gl_FragColor = vec4(smoothstep(.5, 1.0, alpha));
}
`
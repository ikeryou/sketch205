uniform float seed;
uniform float alpha;
uniform vec3 color;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main(void) {
  float no = random(fract(vUv + seed));

  gl_FragColor = vec4(color, no * alpha);
}

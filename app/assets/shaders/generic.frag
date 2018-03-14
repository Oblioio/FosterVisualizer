
uniform sampler2D map;
uniform float u_bright;

#ifdef TRANS 
uniform float u_opacity;
#endif

#ifdef ALPHATEST 
uniform float u_alphaTest;
#endif


varying vec2 vUv;

void main( void ) {
	vec4 diffuseColor = texture2D( map, vUv );
	
	#ifdef ALPHATEST 
		if ( diffuseColor.a < ALPHATEST ) discard;
	#endif
	
	#ifdef TRANS 
		gl_FragColor = vec4(diffuseColor.rgb*u_bright, diffuseColor.a*u_opacity);
	#else   
		gl_FragColor = vec4(diffuseColor.rgb*u_bright, diffuseColor.a);
	#endif
	
}
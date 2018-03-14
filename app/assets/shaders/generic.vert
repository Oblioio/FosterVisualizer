
#ifdef UVRECT 

uniform vec4 u_uvRect;

#endif

uniform vec2 u_offset;
varying vec2 vUv;

void main() {

	#ifdef UVRECT 
		vUv = (vec2(uv.x,1.-uv.y)*u_uvRect.zw)+u_uvRect.xy;
		vUv.y = 1.-vUv.y;
	#else   
		vUv = uv+u_offset;
	#endif
	
	vec3 transformed = vec3( position );
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );	
	gl_Position = projectionMatrix * mvPosition;
}
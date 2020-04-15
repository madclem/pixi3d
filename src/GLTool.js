import { DRAW_MODES, State } from 'pixi.js'
import { mat3, mat4 } from 'gl-matrix';

// import { renderer } from './Application'

class GlTool {
  constructor() {
    this.identityMatrix          = mat4.create();
		this._normalMatrix           = mat3.create();
		this._inverseModelViewMatrix = mat3.create();
		this._modelMatrix            = mat4.create();
		this._matrix                 = mat4.create();
    this.defaultState = new State();

    this.camera = null;
  }

  setMatrices (camera) {
    this.camera = camera;
    this.rotate(this.identityMatrix);
  }

  rotate (mRotation) {
    mat4.copy(this._modelMatrix, mRotation);
		mat4.multiply(this._matrix, this.camera.matrix, this._modelMatrix);
		mat3.fromMat4(this._normalMatrix, this._matrix);
		mat3.invert(this._normalMatrix, this._normalMatrix);
		mat3.transpose(this._normalMatrix, this._normalMatrix);
		

		mat3.fromMat4(this._inverseModelViewMatrix, this._matrix);
		mat3.invert(this._inverseModelViewMatrix, this._inverseModelViewMatrix);
  }

  draw(mesh, renderer) {

    renderer.batch.flush();
    const geometry = mesh.geometry;
    const material = mesh.material;
    const state = mesh.state || this.defaultState;
    const uniforms = material.uniforms;
    
    // update material matrices

    if(this.camera) {
      
			material.uniforms.uProjectionMatrix = this.camera.projection;
			material.uniforms.uViewMatrix = this.camera.matrix;
    }
    
    // uniforms.model = entity.transform.worldTransform;
		
		uniforms.uModelMatrix =  this._modelMatrix;
		uniforms.uNormalMatrix = this._normalMatrix;
    uniforms.uModelViewMatrixInverse = this._inverseModelViewMatrix;

    const mapFrame = uniforms.uMapFrame;

    if (mapFrame)
    {
        const bt = uniforms.uMap.baseTexture;
        const tFrame = uniforms.uMap.frame;

        mapFrame.x = tFrame.x / bt.width;
        mapFrame.y = tFrame.y / bt.height;

        mapFrame.width = (tFrame.width / bt.width);
        mapFrame.height = (tFrame.height / bt.height);
    }
        
    renderer.shader.bind(material);
    renderer.state.set(state);

    renderer.geometry.bind(geometry);
    renderer.geometry.draw(geometry.drawType || DRAW_MODES.TRIANGLES, geometry.size, geometry.start, geometry.instanceCount);

    renderer.renderTexture.bind(null);
  }
}


export const GLTool = new GlTool();
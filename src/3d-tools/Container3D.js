import { DRAW_MODES, Rectangle, State } from 'pixi.js';
import { mat3, mat4 } from 'gl-matrix';

import { Container } from 'pixi.js';

class Container3D {
  constructor() {
    this.identityMatrix          = mat4.create();
		this._normalMatrix           = mat3.create();
		this._inverseModelViewMatrix = mat3.create();
		this._modelMatrix            = mat4.create();
		this._matrix                 = mat4.create();
    this.defaultState = new State();

    this.camera = null;

    this.entities = []
    this.dummy = new Container();
    this.dummy.filterArea = new Rectangle(0, 0, 10000, 10000);
    this.dummy._render = this._render.bind(this); // hijack the render to render our 3d
  }

  init (stage) {
    stage.addChild(this.dummy); // so we can go into the render
  }

  addChild (entity) {
    if (entity.material && entity.geometry) {
      this.entities.push(entity);
    }
  }

  setCamera(camera) {
    this.camera = camera;
    this.setMatrices(this.identityMatrix);
  }

  setMatrices (modelMatrix) {
    mat4.copy(this._modelMatrix, modelMatrix);
		mat4.multiply(this._matrix, this.camera.matrix, this._modelMatrix);
		mat3.fromMat4(this._normalMatrix, this._matrix);
		mat3.invert(this._normalMatrix, this._normalMatrix);
		mat3.transpose(this._normalMatrix, this._normalMatrix);

		mat3.fromMat4(this._inverseModelViewMatrix, this._matrix);
		mat3.invert(this._inverseModelViewMatrix, this._inverseModelViewMatrix);
  }

  _render (renderer) {
    renderer.batch.flush();

    this.setMatrices(this.identityMatrix);

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      
      const geometry = entity.geometry;
      const material = entity.material;
      const state = entity.state || this.defaultState;
      const matrix = entity.matrix;
      
      const uniforms = material.uniforms;
    
    // update material matrices
      if(this.camera) {
        material.uniforms.uProjectionMatrix = this.camera.projection;
        material.uniforms.uViewMatrix = this.camera.matrix;
      }
    
		  if (matrix) this.setMatrices(matrix);
      else this.setMatrices(this.identityMatrix);
      
      uniforms.uModelMatrix =  this._modelMatrix;
		  uniforms.uNormalMatrix = this._normalMatrix;
      uniforms.uModelViewMatrixInverse = this._inverseModelViewMatrix;

      const mapFrame = uniforms.uMapFrame;

      if (mapFrame) {
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
}

export const container3D = new Container3D();
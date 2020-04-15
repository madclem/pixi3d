// ViewLine.js

import DiagramMaterial from './DiagramMaterial';
import Entity3D from '../../3d-tools/objects/Entity3D';
import PlaneGeometry from '../../3d-tools/geometries/PlaneGeometry';
import { smoothstep } from '../../utils';

class ViewDiagramBg extends Entity3D {

	constructor(scene, nbSecondScreen) {

    const s = 1;
    super({ material: new DiagramMaterial(), geometry: new PlaneGeometry(s, s, 1, 1)})

		this.time = 0;
    this.paused = false;
    this.nbSeconds = nbSecondScreen;
    this.scene = scene;
    this.speedX = 0.01666;
	}

	changeNbSeconds(seconds) {
    this.nbSeconds = seconds;

    // this.speedX = 0.01;

    this.speedX = this.scaleX / seconds * 0.01666;
  }
  
  pause () {
    this.paused = true;
  }

  resume () {
		this.paused = false;
	}


	update() {
    
    if (!this.paused) {

      this.time += 1 / 60;
      // this.x = this.scene.vLine.points[0][0];
      this.x += this.scene.vLine.speedX;
    }
    
      const y = this.scene.vLine.points[0][1];
      const pY = smoothstep(0.25, 1., Math.abs(y / this.scaleY) * 2)

      this.targetY = pY * y;

      this.y += (this.targetY - this.y) * (this.paused ? 1 : 0.05);
      this.scene.orbitalControl.center[1] = this.y;
      this.scene.orbitalControl.positionOffset[1] = this.y;
      // this.x += this.scene.vLine.points[0][0];
    // }
		

		this.material.uniforms.uTime = this.time;
		this.material.uniforms.uNbSeconds = this.nbSeconds;
    this.material.uniforms.uLightPosition = this.scene.vLine.points[0];
	}


}

export default ViewDiagramBg;
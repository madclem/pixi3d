import { Application } from 'pixi.js'
import CameraPerspective from './3d-tools/cameras/CameraPerspective';
import OrbitalControl from './3d-tools/helpers/OrbitalControl';
import { container3D } from './3d-tools'
import { mat4 } from 'gl-matrix'

export let renderer = null;

export default class App {
  constructor () {
    this._matrixIdentity = mat4.create();

    this.app = new Application({
      width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1, antialias: true
    });
    renderer = this.app.renderer;
    document.body.appendChild(this.app.view);
    this.stage = this.app.stage;

    // set camera
    this.camera = new CameraPerspective();
    this.camera.setPerspective(45 * Math.PI / 180, window.innerWidth / window.innerHeight, 0.1, 100);
		this.orbitalControl          = new OrbitalControl(this.camera, window, 15);
		this.orbitalControl.radius.value = 10;
    
    
    this.app.ticker.add(this.update.bind(this));
    
    window.addEventListener('resize', this.resize.bind(this))

    setTimeout(()=>{
      this.resize(window.innerWidth, window.innerHeight);
    }, 10)

    container3D.init(this.stage);
    container3D.setCamera(this.camera);
  }

  update() {
	}

  resize(w, h) {
    renderer.resize(w, h);
	}
}
import { Application, Container, Rectangle } from 'pixi.js'

import CameraPerspective from './components/CameraPerspective';
import { GLTool } from './GLTool'
import OrbitalControl from './components/OrbitalControl';
import { mat4 } from 'gl-matrix'

export let renderer = null;

export default class App {
  constructor () {
    this._matrixIdentity = mat4.create();

    this.app = new Application({
      width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1, antialias: true
    });
    document.body.appendChild(this.app.view);
    
    this.stage = this.app.stage;

    renderer = this.app.renderer;

    
    this.camera = new CameraPerspective();
    this.camera.setPerspective(45 * Math.PI / 180, window.innerWidth / window.innerHeight, 0.1, 100);
		this.orbitalControl          = new OrbitalControl(this.camera, window, 15);
		this.orbitalControl.radius.value = 10;

    
    this.app.ticker.add(this._loop.bind(this));

    const container = new Container();
    container.filterArea = new Rectangle(0, 0, 100000, 100000);
    container._render = this.render.bind(this); // very important
    this.stage.addChild(container);

    window.addEventListener('resize', this.resize.bind(this))

    setTimeout(()=>{
      this.resize(window.innerWidth, window.innerHeight);
    }, 10)
  }

  _loop() {
		//	RESET CAMERA
		GLTool.setMatrices(this.camera);

		this._renderChildren();
		this.update();
	}

  _renderChildren (){
    GLTool.rotate(this._matrixIdentity);
  }

  render() {
  }

  update (){
  }

  resize(w, h) {
    renderer.resize(w, h);
	}
}
import { Container, Text } from 'pixi.js';

import Application from './Application';
import BoxGeometry from './components/geometries/BoxGeometry';
import ColorMaterial from './components/materials/color/ColorMaterial';
import Entity3D from './components/Entity3D';
import {GLTool} from './GLTool';
import ViewDiagramBg from './views/ViewDiagramBg';
import ViewLine from './views/ViewLine';
import { getCameraDistance } from './utils'

export class Scene extends Application {
  constructor () {
    super();

    this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0;
    this.orbitalControl.radius.value = 5;
    
    this.tick = 0;
    this.container = new Container();
    this.stage.addChild(this.container);

    const text = new Text('TEST');
    text.position.x = 200;
    text.position.y = 200;
    this.container.addChild(text);

    this.obj = new Entity3D({
      geometry: new BoxGeometry(0.1, 0.1, 0.1),
      material: new ColorMaterial(),
    })


    this.vLine = new ViewLine(this, 10);
    this.vDiagramBg = new ViewDiagramBg(this, 10);

    

    
  }

  render (renderer) {
    this.tick++;
    this.obj.x = Math.cos(this.tick / 100) * 1;

    this.vLine.render(renderer);
    this.vDiagramBg.render(renderer);
    
    // GLTool.rotate(this.obj.matrix);
    // GLTool.draw(this.obj, renderer);
  }
  
  update () {
    // this.container.rotation += 0.01;
  }

  resize () {
    super.resize(window.innerWidth, window.innerHeight);

    // this.camera.setAspectRatio();
		const scaleW = getCameraDistance(this.camera, this.orbitalControl, 1, true, 1);
		const scaleH = getCameraDistance(this.camera, this.orbitalControl, 1, false, 1);
		this.vDiagramBg.scaleX = scaleW;
		this.vDiagramBg.scaleY = scaleH;

		this.vLine.changeSpeed(scaleW, this.vDiagramBg.nbSeconds);
  }
}
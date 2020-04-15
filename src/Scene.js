import { Container, Text } from 'pixi.js';

import Application from './Application';
import ViewDiagramBg from './views/ViewDiagramBg';
import ViewLine from './views/ViewLine';
import { container3D } from './3d-tools';
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

    this.vLine = new ViewLine(this, 10);
    container3D.addChild(this.vLine);
    this.vDiagramBg = new ViewDiagramBg(this, 10);
    container3D.addChild(this.vDiagramBg);
  }

  update () {
    this.vLine.update();
    this.vDiagramBg.update();
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
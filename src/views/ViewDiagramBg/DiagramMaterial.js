import { Program, Shader, UniformGroup } from 'pixi.js';

import frag from './diagram.frag';
import vert from './diagram.vert';

export default class DiagramMaterial extends Shader
{
    constructor()
    { 
      const uniforms = UniformGroup.from({ 
        uTime: 0,
        uNbSeconds: 10,
        uLightPosition: [0,0,0]
      });

      super(Program.from(vert, frag), uniforms);
    }

}

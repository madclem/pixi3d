import { Program, Shader, UniformGroup } from 'pixi.js';

import frag from './line.frag.js';
import vert from './line.vert.js';

export default class LineMaterial extends Shader
{
    constructor(color = 0xFF0000)
    { 
      const uniforms = UniformGroup.from({ 
          thickness: 0.1,
          aspect: 1,
          resolutions: 1
          // color: PIXI.utils.hex2rgb(color, new Float32Array(3)) 
        });

        super(Program.from(vert, frag), uniforms);
    }

}

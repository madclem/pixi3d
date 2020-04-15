import * as PIXI from 'pixi.js';

import frag from './color.frag';
import vert from './color.vert';

export default class ColorMaterial extends PIXI.Shader
{
    constructor(color = 0xFF0000)
    {
        const uniforms = PIXI.UniformGroup.from({ color: PIXI.utils.hex2rgb(color, new Float32Array(3)) });

        super(PIXI.Program.from(vert, frag), uniforms);

        this._color = color;
    }

    set color(color = 0xFF0000)
    {
        this._color = color;
        this.uniforms.color = PIXI.utils.hex2rgb(color, this.uniforms.color);
    }

    get color()
    {
        return this._color;
    }
}

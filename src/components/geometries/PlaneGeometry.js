import { Geometry } from 'pixi.js';

/**
 * The Plane allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 *
 * let plane = PlaneGeometry(10, 10, 4, 4);
 *
 * ```
 *
 * @class
 * @extends PIXI.Mesh
 * @ geometry
 */
export default class PlaneGeometry extends Geometry
{
    /**
     * @param {PIXI.Texture} texture - The texture to use on the Plane.
     * @param {number} verticesX - The number of vertices in the x-axis
     * @param {number} verticesY - The number of vertices in the y-axis
     * @param {object} opts - an options object - add meshWidth and meshHeight
     */
    constructor(width = 1, height = 1, quadWidth = 1, quadHeight = 1)
    {
        super();

        const positions = [];
        const uvs = [];
        const normals = [];
        const indices = [];

        for (let y = 0; y <= quadHeight; ++y)
        {
            const v = y / quadHeight;

            for (let x = 0; x <= quadWidth; ++x)
            {
                const u = x / quadWidth;

                positions.push((u * width) - (width / 2), (v * height) - (height / 2), 0);
                uvs.push(u, v);
                normals.push(0, 0, 1);
            }
        }

        const rowSize = (quadWidth + 1);

        for (let y = 0; y < quadHeight; ++y)
        {
            const rowOffset0 = (y + 0) * rowSize;
            const rowOffset1 = (y + 1) * rowSize;

            for (let x = 0; x < quadWidth; ++x)
            {
                const offset0 = rowOffset0 + x;
                const offset1 = rowOffset1 + x;

                indices.push(offset0, offset0 + 1, offset1);
                indices.push(offset1, offset0 + 1, offset1 + 1);
            }
        }

        this.addAttribute('position', positions)
            .addAttribute('normals', normals)
            .addAttribute('uvs', uvs)
            .addIndex(indices);
    }
}

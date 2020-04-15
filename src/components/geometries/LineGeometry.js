import { Geometry } from "pixi.js";
import { addDataToBufferAttribute } from '../../utils'
let tempArray1 = [];
let tempArray2 = [];

class LineGeometry extends Geometry {
  constructor(vertices, c) {
    super();
    this.widthCallback = c;

    let vert = [
      [0, 0, 0],
      [100 / 800, 250 / 800, 0],
      [50 / 800, 200 / 800, 0],
      [0, 200 / 800, 0],
      [-100 / 800, 220 / 800, 0],
      [-70 / 800, 300 / 800, 0]
    ];

    this.positions = [];
    this.directions = [];
    this.indicesArray = [];
    this.counters = [];
    this.width = [];
    this.uvs = [];
    this.previous = [];
    this.next = [];

    this.vert = vertices || vert;

    this.line(true);
  }

  line(needsUpdate = true) {
    let v = this.vert;

    this.positions.length = v.length * 2;
    this.counters.length = v.length * 2;

    var index = 0;
    var indexC = 0;

    this.previous.length = this.positions.length;
    this.next.length = this.positions.length;

    for (var i = 0; i < v.length; i++) {
      if (needsUpdate) {
        var c = i / v.length;
        this.counters[indexC++] = c;
        this.counters[indexC++] = c;
      }

      // console.log(this.positions.length);
      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];

      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];
    }

    this.process(needsUpdate);
  }

  process(needsUpdate) {
    const compareV3 = (a, b) => {
      var aa = a * 6;
      var ab = b * 6;

      return (
        this.positions[aa] === this.positions[ab] &&
        this.positions[aa + 1] === this.positions[ab + 1] &&
        this.positions[aa + 2] === this.positions[ab + 2]
      );
    };

    const copyV3 = (a, out) => {
      if (!out) out = tempArray1;

      var aa = a * 6;

      out[0] = this.positions[aa];
      out[1] = this.positions[aa + 1];
      out[2] = this.positions[aa + 2];
    };

    var l = this.positions.length / 6;

    var index = 0,
      indexN = 0;

    if (compareV3(0, l - 1)) {
      copyV3(l - 2);
    } else {
      copyV3(0);
    }

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];

    for (var i = 0; i < l; i++) {
      // caluclate pos and next
      copyV3(i, tempArray1);

      if (i > 0) {
        // we can fill the nexts
        this.next[indexN++] = tempArray1[0];
        this.next[indexN++] = tempArray1[1];
        this.next[indexN++] = tempArray1[2];

        this.next[indexN++] = tempArray1[0];
        this.next[indexN++] = tempArray1[1];
        this.next[indexN++] = tempArray1[2];

        this.previous[index++] = tempArray2[0];
        this.previous[index++] = tempArray2[1];
        this.previous[index++] = tempArray2[2];

        this.previous[index++] = tempArray2[0];
        this.previous[index++] = tempArray2[1];
        this.previous[index++] = tempArray2[2];
      }

      tempArray2[0] = tempArray1[0];
      tempArray2[1] = tempArray1[1];
      tempArray2[2] = tempArray1[2];
    }

    if (compareV3(l - 1, 0)) {
      copyV3(1, tempArray1);
    } else {
      copyV3(l - 1, tempArray1);
    }

    this.next[indexN++] = tempArray1[0];
    this.next[indexN++] = tempArray1[1];
    this.next[indexN++] = tempArray1[2];

    this.next[indexN++] = tempArray1[0];
    this.next[indexN++] = tempArray1[1];
    this.next[indexN++] = tempArray1[2];

    index = 0;

    addDataToBufferAttribute(this, 'aVertexPosition', new Float32Array(this.positions), 3);
    addDataToBufferAttribute(this, 'aNext', new Float32Array(this.next), 3);
    addDataToBufferAttribute(this, 'aPrevious', new Float32Array(this.previous), 3);
    
    // this.bufferFlattenData(this.positions, "aVertexPosition", 3);
    // this.bufferFlattenData(this.next, "aNext", 3);
    // this.bufferFlattenData(this.previous, "aPrevious", 3);

    if (needsUpdate) {
      index = 0;
      this.uvs = [];
      let w;
      for (var j = 0; j < l; j++) {
        if (this.widthCallback) {
          w = this.widthCallback(j / (l - 1));
        } else {
          w = 0.1;
        }

        this.width[index++] = w;
        this.width[index++] = w;
        this.uvs.push(j / (l - 1), 0);
        this.uvs.push(j / (l - 1), 1);
      }

      index = 0;
      this.indicesArray = [];
      for (var j = 0; j < l - 1; j++) {
        var n = j * 2;

        this.indicesArray[index++] = n;
        this.indicesArray[index++] = n + 1;
        this.indicesArray[index++] = n + 2;

        this.indicesArray[index++] = n + 2;
        this.indicesArray[index++] = n + 1;
        this.indicesArray[index++] = n + 3;
      }

      index = 0;
      this.directions = [];
      for (var i = 0; i < this.positions.length / 3; i++) {
        if (i % 2 === 0) {
          this.directions[index++] = 1;
        } else {
          this.directions[index++] = -1;
        }
      }

      addDataToBufferAttribute(this, 'aTextureCoord', new Float32Array(this.uvs), 2);
      addDataToBufferAttribute(this, 'aDirection', new Float32Array(this.directions), 1);
      addDataToBufferAttribute(this, 'aCounters', new Float32Array(this.counters), 1);

      if (this.indexBuffer) {
        this.bufferIndex.update(this.indicesArray)
      } else {
        this.addIndex(new Uint16Array(this.indicesArray));
      }

      // this.bufferIndex(this.indicesArray);
      // this.bufferFlattenData(this.directions, "aDirection", 1);

      // this.bufferTexCoord(this.uvs);
      // this.bufferFlattenData(this.counters, "aCounters", 1);
    }
  }

  render(points, needsUpdate = false) {
    this.vert = points || this.vert;

    this.line(needsUpdate);
  }
}

export default LineGeometry;

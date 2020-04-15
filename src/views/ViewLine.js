// ViewLine.js

import {GLTool} from '../GLTool';
import LineGeometry from '../components/geometries/LineGeometry';
import LineMaterial from '../components/materials/line/LineMaterial';
import { getControlPoints } from '../utils';

function getBezierXY(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
	return [Math.pow(1 - t, 3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x 
			+ 3 * t * t * (1 - t) * cp2x + t * t * t * ex,
	Math.pow(1 - t, 3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y 
			+ 3 * t * t * (1 - t) * cp2y + t * t * t * ey
	];
}

const tempArray = [];
class ViewLine {

	constructor(scene) {
		this.material = new LineMaterial();
		this.paused = false;
		this.freq = 60;
		this.time = 0;
		this.heartbeat = 0;
		this.heartbeatTarget = 0;
		this.nbSeconds = 10;

		// this.hbPoints = [[0, 0, 0], [0, 0, 0], [(this.time + this.freq) * 0.01, 0, 0], [(this.time + this.freq * 2) * 0.01, 0, 0]];
		this.hbPoints = [[0, 0]];
		this.lineCoords = [];
		this.speedX = 0.01666;
		
		this.posNextHeartbeat = 0;
		
		this.heartbeats = [0];
    this.scene = scene;
    

		this.points = [];
		for (let i = 0; i < 250; i++) {
			this.points.push([0, 0, 0]);
		}
		this.geometry = new LineGeometry(this.points);

	}
	
	changeSpeed(width, nbSeconds) {
		this.nbSeconds = nbSeconds;
		this.speedX = width / this.nbSeconds * 0.01666;
		
	}

	pause () {
		this.paused = true;
	}

	resume () {
		this.paused = false;
	}


	
	getHB() {
		this.heartbeatTarget = 0 + Math.floor((Math.random() * 2 - 2 / 2) * 100) / 100; // 60 + Math.random() * 10 - 10 / 2;
	}
	
	movePoints() {
		const speed = this.speedX;
		const len = this.heartbeats.length - 1;
		
		const scaleY = 1;//10 / this.nbSeconds;
		const totalDuration = this.nbSeconds / 2 * 60;
		const totalDistance = totalDuration * speed;
		const distFromEachOther = totalDistance / this.points.length;
		let earliestHB = 0;
		for (let i = 0; i < this.points.length; i++) {
			const ptPrev = this.points[i - 1];
			const pt = this.points[i];

			if (ptPrev) {
				pt[0] = ptPrev[0] - distFromEachOther;

			} else {
				if (!this.paused) pt[0] += speed;
			}
			
			const hbDist = distFromEachOther / speed * i;

			if (earliestHB < hbDist) earliestHB = hbDist;

			let y = this.heartbeats[len - hbDist];
			if (!isNaN(y)) {
				pt[1] = y * scaleY;
			} else {
				const modulo = hbDist % 1;

				const hbBefore = this.heartbeats[len - Math.floor(hbDist)];
				const hbAfter = this.heartbeats[len - Math.ceil(hbDist)];
				y = hbBefore + (hbAfter - hbBefore) * modulo;
				pt[1] = y * scaleY;

			}			
		}

		this.geometry.render(this.points);
	}

	updateLine() {
		const firstHb = this.hbPoints[0];
		const secondHb = this.hbPoints[1];
		this.lineCoords = [
			[firstHb[0], firstHb[1]],
		];

		let firstControlPt = [];
		if (secondHb) {
			firstControlPt = [
				firstHb[0] + (secondHb[0] - firstHb[0]) / 3,
				firstHb[1] + (secondHb[1] - firstHb[1]) / 3,
			];
		} else {
			firstControlPt = [...firstHb]
		}

		this.lineCoords.push(firstControlPt);

		const tension = 0.33;
		
		for (let i = 0; i < this.hbPoints.length; i++) {
			const p1 = this.hbPoints[i];
			const p2 = this.hbPoints[i + 1]
			const p3 = this.hbPoints[i + 2]

			if (p3) {
				const cPs = getControlPoints(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], tension);

				this.lineCoords.push([cPs[0], cPs[1]], [p2[0], p2[1]], [cPs[2], cPs[3]]);
			} else if (p2) {
				// const cp1 = [
				// 	p1[0] + (p2[0] - p1[0]) / 3,
				// 	p1[1] + (p2[1] - p1[1]) / 3,
				// ];

				const cp2 = [
					p2[0] + (p1[0] - p2[0]) * tension,
					p2[1] + (p1[1] - p2[1]) * tension,
				];

				this.lineCoords.push(cp2, [p2[0], p2[1]]);
			} else {
				// this.line.push([p1[0], p1[1]]);
			}

		}
	}

	render(renderer) {
		
		// return;
		if (!this.paused) {
			this.time++;
		}


		if (this.time % this.freq === 0) {
			
			this.getHB();

			
			this.hbPoints.push([(this.time + this.freq) * 0.01, this.heartbeatTarget, 0]);

			this.updateLine();
		}


		let x = 0;
		let y = 0;
		if (this.hbPoints.length > 1) {
			const hbIndex = (Math.floor(this.time / 60) - 1) * 3;

			const p1 = this.lineCoords[hbIndex]
			const cp1 = this.lineCoords[hbIndex + 1]
			const cp2 = this.lineCoords[hbIndex + 2]
			const p2 = this.lineCoords[hbIndex + 3]

			const t =  (this.time % 60) / 60;

			const coord = getBezierXY(t, p1[0], p1[1], p1[0], p1[1], p2[0], p2[1], p2[0], p2[1]);

			x = coord[0];
			y = coord[1];

			

			// const duration = 0.1;

			

			// this.heartbeat += (this.hbPoints[hbIndex][1] - this.heartbeat) * 0.05;

			// console.log(this.heartbeat)

		}

		if (!this.paused) {
			this.heartbeats.push(y);
		}

		// const isPair = hbIndex === 0 ? 0 : 0;
		
		// const pt1 = this.hbPoints[hbIndex + -1] || [0, 0, 0];
		// this._bBallHbPt1.draw(pt1, [0.12, 0.12, 0.12], [0, 1, 1])

		// const pt2 = [...this.hbPoints[hbIndex] || [0, 0, 0]];
		// pt2[1] += 0.05;
		// this._bBallHbCtrlPt.draw(pt2 || [0, 0, 0], [0.1, 0.1, 0.1], [1, 0, 1])

		// const pt3 = [...this.hbPoints[hbIndex + 1] || [0, 0, 0]];
		// pt3[1] += 0.05;
		// this._bBallHbPt2.draw(pt3 || [0, 0, 0], [0.1, 0.1, 0.1], [1, 1, 0]);

		// console.log
		


		// const isPair = this.hbPoints.length % 2 === 0 ? 0 : -1;
		// const pt1 = this.hbPoints[this.hbPoints.length - 3 + isPair] || [0, 0, 0];
		// this._bBallHbPt1.draw(pt1, [0.12, 0.12, 0.12], [0, 1, 1]);

		// const ptCtrol = [...this.hbPoints[this.hbPoints.length - 2 + isPair] || [0, 0, 0]];
		// ptCtrol[1] += 0.05;
		// this._bBallHbCtrlPt.draw(ptCtrol || [0, 0, 0], [0.1, 0.1, 0.1], [1, 0, 1]);

		// const pt2 = [...this.hbPoints[this.hbPoints.length - 1 + isPair] || [0, 0, 0]];
		// pt2[1] += 0.05;
		// this._bBallHbPt2.draw(pt2 || [0, 0, 0], [0.1, 0.1, 0.1], [1, 1, 0]);



		// console.log(t)
		// const x = (1 - t) * (1 - t) * pt1[0] + 2 * (1 - t) * t * ptCtrol[0] + t * t * pt2[0];
		// const y = (1 - t) * (1 - t) * pt1[1] + 2 * (1 - t) * t * ptCtrol[1] + t * t * pt2[1];
		// const t =  (this.time % 60) / 60; // given example value
		
		// const cPs = getControlPoints(pt1[0], pt1[1], pt2[0], pt2[1], pt3[0], pt3[1], 0.5);


		

		// const coord = getBezierXY(t, pt1[0], pt1[1], cPs[0], cPs[1], cPs[2], cPs[3], pt2[0], pt2[1]);




		// const y = Math.pow(1-t, 2) * pt1[1] + 2 * (1-t) * t * ptCtrol[1] + Math.pow(t, 2) * pt2[1];
		
		
		
		this.movePoints();
		const firstPoint = this.points[0];
		// this._bBall.draw([firstPoint[0], firstPoint[1], 0], [0.05, 0.05, 0.05], [1, 1, 1]);
		// this._bBall.draw([hbIndex + this.time[0], y, 0], [0.1, 0.1, 0.1], [1, 0, 0])

		// const lastPoint = this.points[this.points.length - 1];

		// console.log(this.points.length);
		
		this.scene.orbitalControl.center[0] = firstPoint[0];
		// this.scene.orbitalControl.center[1] = firstPoint[1];
		this.scene.orbitalControl.positionOffset[0] = firstPoint[0];
		// this.scene.orbitalControl.positionOffset[1] = firstPoint[1];

		this.material.uniforms.thickness =  .1;
		this.material.uniforms.aspect =  window.innerWidth / window.innerHeight;
		this.material.uniforms.resolutions =  [window.innerWidth, window.innerHeight];
		GLTool.draw(this, renderer);

	}


}

export default ViewLine;
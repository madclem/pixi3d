// CameraPerspective.js

import { mat4, vec3 } from 'gl-matrix';

import Camera from './Camera';

class CameraPerspective extends Camera {

	constructor(mFov, mAspectRatio, mNear, mFar) {
		super();
		
		if(mFov) {
			this.setPerspective(mFov, mAspectRatio, mNear, mFar);
		}
	}

	setPerspective(mFov, mAspectRatio, mNear, mFar) {
		
		this._fov         = mFov;
		this._near        = mNear;
		this._far         = mFar;
		this._aspectRatio = mAspectRatio;
		mat4.perspective(this._projection, mFov, mAspectRatio, mNear, mFar);

		// this._frustumTop = this._near * Math.tan(this._fov * 0.5);
		// this._frustumButtom = -this._frustumTop;
		// this._frustumRight = this._frustumTop * this._aspectRatio;
		// this._frustumLeft = -this._frustumRight;
	}


	setAspectRatio(mAspectRatio) {
		this._aspectRatio = mAspectRatio;
		mat4.perspective(this.projection, this._fov, mAspectRatio, this._near, this._far);
	}
}


export default CameraPerspective;
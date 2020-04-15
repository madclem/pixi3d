
const getCameraDistance = (camera, orbitalControl, elementHeight, isWidth = false, fillHeight = 1, objectY = 0) => {
	const fov = camera._fov;
	const distCameraToCube = orbitalControl.radius.targetValue - objectY;

	const height = 2 * Math.tan(fov / 2) * distCameraToCube;
	const totalHeight = fillHeight * (isWidth ? (window.innerWidth / window.innerHeight) : 1);
  console.log('totalHeight', totalHeight)
	const finalScaleH = totalHeight / (1 / height);

	return (finalScaleH / elementHeight);
};

export { getCameraDistance };


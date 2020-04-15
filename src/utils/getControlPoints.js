function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
	// http://scaledinnovation.com/analytics/splines/splines.html
	//  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
	//  x2,y2 is the next knot -- not connected here but needed to calculate p2
	//  p1 is the control point calculated here, from x1 back toward x0.
	//  p2 is the next control point, calculated here and returned to become the 
	//  next segment's p1.
	//  t is the 'tension' which controls how far the control points spread.
  
	//  Scaling factors: distances from this knot to the previous and following knots.
	const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	const d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
 
	const fa = t * d01 / (d01 + d12);
	const fb = t - fa;

	const p1x = x1 + fa * (x0 - x2);
	const p1y = y1 + fa * (y0 - y2);

	const p2x = x1 - fb * (x0 - x2);
	const p2y = y1 - fb * (y0 - y2);  
  
	return [p1x, p1y, p2x, p2y];
}

export { getControlPoints }
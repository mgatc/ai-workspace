/**
 *	An container to hold a point as part of path
 *	by Matthew Graham
 */

goog.provide( 'mcc.pathfinding.Element' );
 
 
 
mcc.pathfinding.Element = function( point, parent=null ){
	this.point = point;
	this.parent = parent;
	if( parent ) {
		this.goal = parent.goal;
		this.g = this.parent.g + mcc.map.distanceBetween( this.parent.point, this.point );
		this.h = mcc.map.distanceBetween( this.point, this.goal );
	} else {
		this.goal = null;
		this.g = 0;
		this.h = 0;
	}
};

mcc.pathfinding.Element.prototype.f = function() {
	return this.g + this.h;
};
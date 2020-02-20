/**
 *	Implements the a-star algorithm
 * 	by Matthew Graham
 */
goog.provide( 'mcc.pathfinding.Astar' ); 

goog.require( 'mcc.pathfinding.Element' );
goog.require( 'goog.structs.PriorityQueue' ); 


	
/**
 * Runs the astar pathfinding algorithm 
 * @param {Map} map The map of the space
 * @constructor
 */
mcc.pathfinding.Astar = function( ctrl ) {
	this.setMap( ctrl.map ); 
	//console.log(this.map);
	
	this.open = new goog.structs.PriorityQueue(); 
	this.closed = [];
	if( ctrl.isConstrained.checked ) 
		this.c = ctrl.constraint.value;
	this.speed = ctrl.speed.value; // speed from 0-100
	this.frameDelay = ( 100 - this.speed ) * 4; // calculate delay in ms

	this.run();
}


/**
 * Run the algorithm.
 */
mcc.pathfinding.Astar.prototype.run = function() {

	if( ! this.map ) {
		console.log( 'no map defined' );
		return;
	}

	var best = new mcc.pathfinding.Element( this.map.start );
	var self = this;
	
	best.goal = this.map.goal;

	this.open.enqueue( 0, best );
	
	var delay = setInterval( function() {
		best = self.open.dequeue(); 	// remove the top element 
		
			//console.log(best);
		if( best.parent != null ) {
			// throw an event for a listener to catch and draw outside of Astar
			var event = new CustomEvent( 'newPath', {
				detail: {
					p1: best.point, 
					q1: best.parent.point
				}
			} );
			window.dispatchEvent( event );
		}
		
		self.closed.push( best.point );	// put it in closed
		
		self.action( best );
		
		if( mcc.map.pointIsEqual( best.point, self.map.goal ) ) { // goal test
			clearInterval( delay );
			console.log( best.f() );
			// instead of directly drawing the segment, throw an event for a listener to catch and draw outside of Astar
			var event = new CustomEvent( 'goalPath', {
				detail: {
					goal: best
				}
			} );
			window.dispatchEvent( event );
		} else if( self.open.isEmpty() ) { // No path found
			clearInterval( delay );
			var event = new CustomEvent( 'goalPath', {
				detail: {
					
				}
			} );
			window.dispatchEvent( event );
		} 
	}, this.frameDelay );
	
// The version before setInterval was added to animate search
//
// 	while( ! mcc.map.pointIsEqual( best.point, this.map.goal ) && ! this.open.isEmpty() ) {
// 		
// 		best = this.open.dequeue(); 	// remove the top element 
// 		if( best.parent != null ) {
// 			this.map.drawSegment( best.point, best.parent.point ); // show the segment on the board
// 		}
// 		
// 		this.closed.push( best.point );	// put it in closed
// 		
// 		this.action( best );
// 	}
// 	
// 	if( mcc.map.pointIsEqual( best.point, this.map.goal ) ) {
// 		this.map.drawChosenPath( best );
// 	}
}



/**
 * Run the algorithm.
 * @param {Element} el The node to expand
 */
mcc.pathfinding.Astar.prototype.action = function( el ) {

	var p1 = el.point;
	
	points: for( var i=0; i<this.map.P.length; i++ ) { // loop through points
	//points: for( var i=0; i<5; i++ ) { // loop through some points

		var q1 = this.map.P[i];						// candidate point to visit
		
		//console.log(q1, ! this.closed.includes( q1 ));
		
		if( ! this.closed.includes( q1 ) ) {	// is the candidate already visited?
			var child = new mcc.pathfinding.Element( q1, el );
			
			if( this.c && child.f() > this.c ) { // Check for constaint condition
				continue points;
			}
			// if segment does NOT intersect with any line in E, add q1 to open
			edges: for( var j=0; j<this.map.E.length; j++ ) {
				var p2 = this.map.E[j][0],
					q2 = this.map.E[j][1];
				//console.log((! mcc.map.onEndpoint(  p1, q1, p2, q2 )), mcc.map.doIntersect( p1, q1, this.map.E[j][0], this.map.E[j][1] ));
				if( (! mcc.map.onEndpoint(  p1, q1, p2, q2 ) 
				   		&& mcc.map.doIntersect( p1, q1, this.map.E[j][0], this.map.E[j][1] ) )
				   	    			|| p1 == q1 ) {
					continue points;
				} 
			}
			this.open.enqueue( child.f(), child ); // add the point to the PQ
		}
	}
}
/**
 * Calculate the heuristic cost for the given point
 * @param {Array} point The point
 */
mcc.pathfinding.Astar.prototype.h = function( point ) {
	return mcc.map.distanceBetween( point, this.map.goal );
}
 
/**
 * Sets the map for this instance, and updates the start and goal values
 * @param {Map} map The map to run the algorithm in
 */
mcc.pathfinding.Astar.prototype.setMap = function( map ) {
	this.map = map;
	this.map.updateSandG();
}
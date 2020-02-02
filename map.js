goog.provide( 'mcc.map' );
goog.provide( 'mcc.map.Map' );

/**
 *	Draws a map of polygons using the JSXGraph library
 */

mcc.map.Map = function( element_id ) {
	this.canvas_id = element_id;
	this.canvas = document.getElementById( this.canvas_id ); // the size of the element on the page	
	mcc.map.Map.prototype.E = [];
	mcc.map.Map.prototype.P = [];
	mcc.map.Map.prototype.bounding_box = [0,0,20,20];
	mcc.map.Map.prototype.padding = 1;
}
	
mcc.map.Map.prototype.board; // the JSXGraph object to draw on
mcc.map.Map.prototype.obstacles;
mcc.map.Map.prototype.start;
mcc.map.Map.prototype.goal;
mcc.map.Map.prototype.big_box;
		
		
		
mcc.map.Map.prototype.draw = function( coordinates ) {
	this.setCoordinates( coordinates );
	this.getAllPoints();
	
	this.resetBoard();
	
	this.getAllEdges();
	for( var i=0; i<this.obstacles.length; i++ ) {
		var p = this.board.create( 'polygon', this.obstacles[i], { fixed: true } );
		for( const property in p.ancestors ) {
			p.ancestors[property].setAttribute({ size: 0, fixed: true }); // set point attributes
		}
	}
	this.startPoint = this.board.create( 'point', this.start, { name: 'S', snapToGrid: true, size: 7 } );
	this.goalPoint = this.board.create( 'point', this.goal, { name: 'G', snapToGrid: true, size: 7, fillColor: '#00cc00', strokeColor:'#00cc00' } );
	//console.log(this.board);
}
mcc.map.Map.prototype.setCoordinates = function( coord ) {
	this.obstacles = coord.obstacles;
	this.start = coord.start;
	this.goal = coord.goal;
}
mcc.map.Map.prototype.getBounds = function() {
	// include the goal and start in the bounds check
	var xmin = Math.min( this.start[0], this.goal[0] ),
		ymin = Math.min( this.start[1], this.goal[1] );
		
	var xmax = Math.max( this.start[0], this.goal[0] ),
		ymax = Math.max( this.start[1], this.goal[1] );
		
		
	for( var i=0; i<this.P.length; i++ ) { 
	
		xmin = Math.min( xmin, this.P[i][0] );
		ymin = Math.min( ymin, this.P[i][1] );
		
		xmax = Math.max( xmax, this.P[i][0] );
		ymax = Math.max( ymax, this.P[i][1] );
	}
	
	this.bounding_box = [
		xmin,
		ymin,
		
		xmax,
		ymax
	];
	//console.log( this.bounding_box );
}

mcc.map.Map.prototype.getStart = function() {
	this.start = [ this.startPoint.coords.usrCoords[1], this.startPoint.coords.usrCoords[2] ];
	return this.start;
}
mcc.map.Map.prototype.getGoal = function() {
	this.goal = [ this.goalPoint.coords.usrCoords[1], this.goalPoint.coords.usrCoords[2] ];
	return this.goal;
}
	
mcc.map.Map.prototype.calcBoxSize = function() {
	this.getBounds();	// get the bounds for the specified obstacles
	
	var x = this.bounding_box[2]-this.bounding_box[0]; // length of the bounding box
	var y = this.bounding_box[3]-this.bounding_box[1]; // height of the bounding box

	return [
		this.bounding_box[0]-this.padding-(1/2)*(y-x)*(x<y), // xmin
		this.bounding_box[1]-this.padding-(1/2)*(x-y)*(x>y), // ymin
		
		this.bounding_box[2]+this.padding+(1/2)*(y-x)*(x<y), // xmax
		this.bounding_box[3]+this.padding+(1/2)*(x-y)*(x>y)  // ymax
	];
}
	
mcc.map.Map.prototype.getAllEdges = function() {
	for( var i=0; i<this.obstacles.length; i++ ) { 			// loop through obstacles
	
		// Connect all other vertices in obstacles
		for( var j=0; j<this.obstacles[i].length-1; j++ ) {		 // loop through vertices
			for( var k=j+1; k<this.obstacles[i].length; k++ ) { // loop through vertices
				// make a segment between j and k
				this.E.push( [ this.obstacles[i][j], this.obstacles[i][k] ] );
				
				// Only use this for debugging, otherwise, comment out
				//this.drawSegment( this.obstacles[i][j], this.obstacles[i][k] );
			}
		}
	}
}
	
mcc.map.Map.prototype.getAllPoints = function() {
	for( var i=0; i<this.obstacles.length; i++ ) { // loop through obstacles
		this.P = this.P.concat( this.obstacles[i] );
	}
}

mcc.map.Map.prototype.drawSegment = function( p1, p2, isGoal = false ) {
	var attr = { 
		withLabel: false,
		fixed: true
	};
	if( isGoal ) {
		attr.strokeColor = "#000000";
		attr.fillColor = "#000000";
	} else {
		attr.strokeColor = "#bbbbbb";
		attr.fillColor = "#bbbbbb";
	}
	p1 = this.board.create( 'point', p1, attr );
	p2 = this.board.create( 'point', p2, attr );
	this.board.create( 'segment', [p1, p2], attr );

}


mcc.map.Map.prototype.drawChosenPath = function( curr ) {
	while( curr.parent != null ) {
		this.drawSegment( curr.point, curr.parent.point, true );
		curr = curr.parent;
	}
}

mcc.map.Map.prototype.resetBoard = function () {
	// if( this.board ) {
// 		JXG.JSXGraph.freeBoard( this.board ); 
// 	}
	this.board = JXG.JSXGraph.initBoard( this.canvas_id, {
		boundingbox: this.calcBoxSize()		// size of the board
	});
}

mcc.map.Map.prototype.updateSandG = function() {
	this.getStart();
	this.getGoal();
	
	this.P.push( this.start );
	this.P.push( this.goal );
}






mcc.map.onEndpoint = function( p1, q1, p2, q2 ) {
	var onEndpoint = 
		   ( p1[0] == p2[0] && p1[1] == p2[1] )
		|| ( p1[0] == q2[0] && p1[1] == q2[1] )
		|| ( q1[0] == p2[0] && q1[1] == p2[1] )
		|| ( q1[0] == q2[0] && q1[1] == q2[1] );
		
// 		if( onEndpoint ) {
// 			//console.log('onEndpoint returns true');
// 		}
	return onEndpoint;
}
mcc.map.distanceBetween = function( p1, p2 ) {
	var x = p1[0] - p2[0];
	var y = p1[1] - p2[1];
	return Math.sqrt( (x * x) + (y * y));
}

mcc.map.floatIsEqual = function( num1, num2 ) {
	//console.log("|" + num1 + "-" + num2 + "|=" + Math.abs(num1-num2));
	return Math.abs( num1 - num2 ) < this.EPSILON;
}
mcc.map.pointIsEqual = function( p1, p2 ) {
	return p1[0]==p2[0] && p1[1]==p2[1];
}	


/*
 *	ADAPTED: The following functions adapted from 
 *  https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
 */
	mcc.map.onSegment = function( p, q, r ) {
		return Math.min(p[0], r[0]) <= q[0] && q[0] <= Math.max(p[0], r[0])
			&& Math.min(p[1], r[1]) <= q[1] && q[1] <= Math.max(p[1], r[1]);
	}
	mcc.map.orientation = function( p, q, r ) {
		// See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
		// for details of below formula. 
		var val = (q[1] - p[1]) * (r[0] - q[0]) - 
				  (q[0] - p[0]) * (r[1] - q[1]); 

		if ( val == 0 ) return 0;  // colinear 

		return (val > 0) ? 1 : 2; // clock or counterclock wise 
	}
	mcc.map.doIntersect = function( p1, q1, p2, q2 ) {
		var o1 = mcc.map.orientation( p1, q1, p2 );
		var o2 = mcc.map.orientation( p1, q1, q2 ); 
		var o3 = mcc.map.orientation( p2, q2, p1 ); 
		var o4 = mcc.map.orientation( p2, q2, q1 );

		// General case 
		if (o1 != o2 && o3 != o4) 
			return true; 
	
		// Special Cases 
		// p1, q1 and p2 are colinear and p2 lies on segment p1q1 
		if (o1 == 0 && mcc.map.onSegment(p1, p2, q1)) return true; 

		// p1, q1 and q2 are colinear and q2 lies on segment p1q1 
		if (o2 == 0 && mcc.map.onSegment(p1, q2, q1)) return true; 

		// p2, q2 and p1 are colinear and p1 lies on segment p2q2 
		if (o3 == 0 && mcc.map.onSegment(p2, p1, q2)) return true; 

		 // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
		if (o4 == 0 && mcc.map.onSegment(p2, q1, q2)) return true; 

		//console.log(p1,q1,p2,q2);
		return false; // Doesn't fall in any of the above cases 
	}
// END ADAPTED FUNCTIONS
	


// 
// Implementation prior to Google Closure adaptation
// Keep until adaptation tests successfully.
// 
// /**
//  *	Draws a map of polygons using the JSXGraph library
//  */
// 
// class Map {
// 	EPSILON = 0.001; // floating-point tolerance
// 	canvas_id = 'jxgbox';
// 	canvas = document.getElementById( this.canvas_id ); // the size of the element on the page	
// 	board; // the JSXGraph object to draw on
// 	obstacles;
// 	E = [];
// 	P = [];
// 	start;
// 	goal;
// 	big_box;
// 	bounding_box = [0,0,20,20];
// 	padding = 1;
// 	
// 	constructor() {
// 	
// 	}
// 		
// 	draw() {
// 		this.getAllPoints();
// 		
// 		this.board = JXG.JSXGraph.initBoard( this.canvas_id, {
// 			boundingbox: this.calcBoxSize()		// size of the board
// 		});
// 		this.getAllEdges();
// 		for( var i=0; i<this.obstacles.length; i++ ) {
// 			this.board.create( 'polygon', this.obstacles[i] );
// 		}
// 		this.board.create( 'point', this.start, { name: 'S' } );
// 		this.board.create( 'point', this.goal, { name: 'G' } );
// 		//console.log(this.board);
// 	}
// 	
// 	getBounds() {
// 		var xmin = this.P[0][0],
// 			ymin = this.P[0][1];
// 			
// 		var xmax = this.P[0][0],
// 			ymax = this.P[0][1];
// 			
// 			
// 		for( var i=0; i<this.P.length; i++ ) { 
// 		
// 			xmin = Math.min( xmin, this.P[i][0] );
// 			ymin = Math.min( ymin, this.P[i][1] );
// 			
// 			xmax = Math.max( xmax, this.P[i][0] );
// 			ymax = Math.max( ymax, this.P[i][1] );
// 		}
// 		
// 		this.bounding_box = [
// 			xmin,
// 			ymin,
// 			
// 			xmax,
// 			ymax
// 		];
// 		//console.log( this.bounding_box );
// 	}
// 	
// 	calcBoxSize() {
// 		this.getBounds();	// get the bounds for the specified obstacles
// 		
// 		var x = this.bounding_box[2]-this.bounding_box[0]; // length of the bounding box
// 		var y = this.bounding_box[3]-this.bounding_box[1]; // height of the bounding box
// 
// 		return [
// 			this.bounding_box[0]-this.padding-(1/2)*(y-x)*(x<y), // xmin
// 			this.bounding_box[1]-this.padding-(1/2)*(x-y)*(x>y), // ymin
// 			
// 			this.bounding_box[2]+this.padding+(1/2)*(y-x)*(x<y), // xmax
// 			this.bounding_box[3]+this.padding+(1/2)*(x-y)*(x>y)  // ymax
// 		];
// 	}
// 	
// 	getAllEdges() {
// 		for( var i=0; i<this.obstacles.length; i++ ) { 			// loop through obstacles
// 		
// 			// Connect all other vertices in obstacles
// 			for( var j=0; j<this.obstacles[i].length-1; j++ ) {		 // loop through vertices
// 				for( var k=j+1; k<this.obstacles[i].length; k++ ) { // loop through vertices
// 					// make a segment between j and k
// 					this.E.push( [ this.obstacles[i][j], this.obstacles[i][k] ] );
// 					
// 					// Only use this for debugging, otherwise, comment out
// 					//this.drawSegment( this.obstacles[i][j], this.obstacles[i][k] );
// 				}
// 			}
// 		}
// 	}
// 	
// 	getAllPoints() {
// 		for( var i=0; i<this.obstacles.length; i++ ) { // loop through obstacles
// 			this.P = this.P.concat( this.obstacles[i] );
// 		}
// 		this.P.push( this.start );
// 		this.P.push( this.goal );
// 	}
// 	drawSegment( p1, p2 ) {
// 		p1 = this.board.create( 'point', p1 );
// 		p2 = this.board.create( 'point', p2 );
// 		this.board.create( 'segment', [p1, p2] );
// 	}
// 
// 
// 
// 
// 	// STATIC METHODS
// 	
// 	static onEndpoint( p1, q1, p2, q2 ) {
// 		var onEndpoint = 
// 			   ( p1[0] == p2[0] && p1[1] == p2[1] )
// 			|| ( p1[0] == q2[0] && p1[1] == q2[1] )
// 			|| ( q1[0] == p2[0] && q1[1] == p2[1] )
// 			|| ( q1[0] == q2[0] && q1[1] == q2[1] );
// 			
// 		if( onEndpoint ) {
// 			//console.log('onEndpoint returns true');
// 		}
// 		return onEndpoint;
// 	}
// 	static distanceBetween( p1, p2 ) {
// 		var x = p1[0] - p2[0];
// 		var y = p1[1] - p2[1];
// 		return Math.sqrt( (x * x) + (y * y));
// 	}
// 	
// 	static floatIsEqual( num1, num2 ) {
// 		//console.log("|" + num1 + "-" + num2 + "|=" + Math.abs(num1-num2));
// 		return Math.abs( num1 - num2 ) < this.EPSILON;
// 	}
// 	static pointIsEqual( p1, p2 ) {
// 		return Map.floatIsEqual( Map.distanceBetween( p1, p2 ), 0 );
// 	}
// 	
// 	
// 	
// 	
// 	/*
// 	 *	ADAPTED: The following functions adapted from 
// 	 *  https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
// 	 */
// 		static onSegment( p, q, r ) {
// 			return Math.min(p[0], r[0]) <= q[0] && q[0] <= Math.max(p[0], r[0])
// 				&& Math.min(p[1], r[1]) <= q[1] && q[1] <= Math.max(p[1], r[1]);
// 		}
// 		static orientation( p, q, r ) {
// 			// See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
// 			// for details of below formula. 
// 			var val = (q[1] - p[1]) * (r[0] - q[0]) - 
// 					  (q[0] - p[0]) * (r[1] - q[1]); 
//   
// 			if ( val == 0 ) return 0;  // colinear 
//   
// 			return (val > 0) ? 1 : 2; // clock or counterclock wise 
// 		}
// 		static doIntersect( p1, q1, p2, q2 ) {
// 			var o1 = Map.orientation( p1, q1, p2 );
// 			var o2 = Map.orientation( p1, q1, q2 ); 
// 			var o3 = Map.orientation( p2, q2, p1 ); 
// 			var o4 = Map.orientation( p2, q2, q1 );
// 	
// 			// General case 
// 			if (o1 != o2 && o3 != o4) 
// 				return true; 
// 		
// 			// Special Cases 
// 			// p1, q1 and p2 are colinear and p2 lies on segment p1q1 
// 			if (o1 == 0 && Map.onSegment(p1, p2, q1)) return true; 
//   
// 			// p1, q1 and q2 are colinear and q2 lies on segment p1q1 
// 			if (o2 == 0 && Map.onSegment(p1, q2, q1)) return true; 
//   
// 			// p2, q2 and p1 are colinear and p1 lies on segment p2q2 
// 			if (o3 == 0 && Map.onSegment(p2, p1, q2)) return true; 
//   
// 			 // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
// 			if (o4 == 0 && Map.onSegment(p2, q1, q2)) return true; 
//   
//   			//console.log(o1,o2,o3,o4);
// 			return false; // Doesn't fall in any of the above cases 
// 		}
// 	// END ADAPTED FUNCTIONS
// }	





// 
// //Random generation functions
// 
// function drawMapOnCanvas( map, size, canvas ) {
// 	if( canvas.getContext ) {
// 		var c = canvas.getContext( '2d' );
// 		c.clearRect( 0, 0, canvas.width, canvas.height );
// 		for( var i=0; i<map.length; i++ ) {
// 			for( var j=0; j<map[i].length; j++ ) {
// 				if( map[i][j] == 1 ) {
// 					var x = i * size;
// 					var y = j * size;
// 					c.fillRect( x, y, size, size );
// 				}
// 			}
// 		}
// 	}
// }
// function generateRandomMap( attr ) {
// 	number of rows/cols in the map
// 	var cols = Math.floor( CANVAS_SIZE / attr.obSize );
// 	the number of obstacles in the map
// 	var n = Math.floor( cols * cols * attr.obDensity / 100 );
// 	the locations of obstacles in the map
// 	var gridNums = randomPermutation( cols * cols );
// 	gridNums = gridNums.slice(0, n);
// 	
// 	var map = new Array();
// 	
// 	for( var i=0; i<cols; i++ ) {
// 		map.push( new Array() );
// 		for( var j=0; j<cols; j++ ) {
// 			if( gridNums.includes( i * cols + j ) ) {
// 				map[i].push(1);
// 			} else {
// 				map[i].push(0);
// 			}
// 		}
// 	}
// 	return map;
// }
// function randomPermutation( n ) {
// 	if( n <= 0 ) {
// 		return;
// 	}
// 	var perm = new Array(n);
// 	for( var i=0; i<n; i++ ) {
// 		perm[i] = i;
// 	}
// 	perm = shuffle( perm );
// 	return perm;
// }
// function shuffle(array) {
//     var i = array.length,
//         j = 0,
//         temp;
// 
//     while (i--) {
// 
//         j = Math.floor(Math.random() * (i+1));
// 
//         swap randomly chosen element with current element
//         temp = array[i];
//         array[i] = array[j];
//         array[j] = temp;
// 
//     }
// 
//     return array;
// }

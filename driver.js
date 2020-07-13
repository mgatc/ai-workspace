goog.require( 'mcc.map.Map' );
goog.require( 'mcc.pathfinding.Astar' );

var ctrl = {
	map: new mcc.map.Map( 'jxgbox' ),			// map
	mapName: document.getElementById( 'mapName' ), // mapNameDD
	speed: document.getElementById( 'speed' ), // 0-100
	isConstrained: document.getElementById( 'isConstrained' ), // is there a constraint on the search
	constraint: document.getElementById( 'constraint' ), // the value for the constraint
	run: document.getElementById( 'apply' ), // btn
};

// constrained by default for assignment 2
//ctrl.isConstrained.checked = true;
if( ctrl.isConstrained.checked ) {
	ctrl.constraint.type = 'text'; // toggle c textbox
	ctrl.constraint.style.width = '30px';
}



// DEFINE MAPS

var maps = new Object(); 

maps.assignment1 = { // ASSIGNMENT 1 MAP
	start: [ 1,8],					// shortest path = 20.390
	goal:  [18,0],
	obstacles: [					// Coordinates for the polygons to be placed 
		[[2,10],[2,8],[10,8],[10,10]],	// in the map. Each polygon must be convex.
		[[4,7],[6,4],[4,1],[1,4],[2,6]],
		[[6,7],[8,7],[7,3]],
		[[11,9],[12,8],[10,6]],
		[[9,4],[9,1],[11,1],[12,3]],
		[[13,6],[15,6],[15,1],[13,1]],
		[[18,7],[18,3],[17,2],[16,3]],
		[[17,10],[17,8],[16,7],[14,8],[14,10],[16,11]] 
	]
}; // END ASSIGNMENT 1 



maps.assignment2 = { // ASSIGNMENT 2 MAP
	start: [ 22,-3],				// shortest path = 66.847
	goal:  [11,4],
	obstacles: [
		rect( [23,-2], [25,-1] ), 	// 1
		rect( [23,-2], [24,1] ), 	// 2
		rect( [23,0], [27,1] ), 	// 3
		rect( [26,0], [27,24] ), 	// 4
		rect( [0,23], [27,24] ), 	// 5
		rect( [0,0], [1,24] ), 		// 6
		rect( [0,0], [21.5,1] ), 		// 7
		rect( [21,-2 ], [22,5] ), 	// 8
		rect( [20,-2 ], [22,-1] ), 	// 9
		rect( [21,6 ], [22,20] ), 	// 10
		rect( [17,6 ], [22,7] ), 	// 11
		rect( [17,2 ], [18,7] ), 	// 12
		rect( [0,2 ], [18,3] ), 	// 13
		rect( [12,2 ], [13,11] ), 	// 14 
		rect( [9,4 ], [10,7] ), 	// 15
		rect( [9,4 ], [10,7] ), 	// 16
		rect( [3,4 ], [10,5] ), 	// 17
		rect( [3,4 ], [4,12] ), 	// 18
		rect( [0,15 ], [14,16] ), 	// 19
		rect( [3,15 ], [4,20] ), 	// 20
		rect( [6,19], [ 17,20] ), 	// 21
		rect( [16,10], [ 17,20] ), 	// 22
		rect( [6,10], [ 17,11] ), 	// 23
		rect( [15,5], [ 16,11] ), 	// 24
		rect( [6,8], [ 7,11] ), 	// 25
	]
}; // END ASSIGNMENT 2

function rect( p1, p2 ) {
	var v1 = p1;
	var v2 = [ p1[0], p2[1] ];
	var v3 = p2;
	var v4 = [ p2[0], p1[1] ];
	
	return [ v1, v2, v3, v4 ];
}



maps.simple = { // SIMPLE MAP
	start: [ 4,5],
	goal:  [20,5],
	obstacles: [
		[[16,12],[12,4],[8,12]],
	]
}; // END SIMPLE



maps.grid = { // GRID MAP
	start: [0,-1],
	goal:  [9, 6],
	obstacles: []
}; 

for( var i=0; i<4; i++ ) {
	for( var j=0; j<3; j++ ) {
		maps.grid.obstacles.push( [
			[2*i+1, 2*j+1], 
			[2*i+2, 2*j+1], 
			[2*i+2, 2*j+2],
			[2*i+1, 2*j+2]
		] );
		
	}
}
// END GRID



ctrl.map.draw( maps[ctrl.mapName.value] ); // draw the default map



// ADD EVENT LISTENERS

// Map change from dropdown
ctrl.mapName.addEventListener( 'change', function(e)  {
	JXG.JSXGraph.freeBoard( ctrl.map.board );
	ctrl.map = new mcc.map.Map( 'jxgbox' );
	ctrl.map.draw( maps[e.target.value] );
} );
// Option - Constraint
ctrl.isConstrained.addEventListener( 'change', function(e) {
	//console.log(ctrl.constraint);
	ctrl.constraint.type = e.target.checked ? 'text' : 'hidden'; // toggle c textbox
	ctrl.constraint.style.width = '30px';
} );
// Run
ctrl.run.addEventListener( 'click', function(e) { 	   // add an onclick to the apply button
	document.getElementById( "message" ).innerHTML = '';
	
	
	JXG.JSXGraph.freeBoard( ctrl.map.board );
	ctrl.map = new mcc.map.Map( 'jxgbox' );
	ctrl.map.draw( maps[ctrl.mapName.value] );
	
	const astar = new mcc.pathfinding.Astar( ctrl );
} ); 
// Print a new candidate path
window.addEventListener( 'newPath', function(e) {  // listen for the algorithm to trigger a newPath event
	ctrl.map.drawSegment( e.detail.p1, e.detail.q1 );   // show the segment on the board
} );
// Print the found goal path
window.addEventListener( 'goalPath', function(e) { // listen for the algorithm to trigger a goalPath event
	if( e.detail.goal ) {
		ctrl.map.drawChosenPath( e.detail.goal ); 		   // show the chosen path on the board
	} else {
		document.body.style.backgroundColor = "#d23";
		window.setTimeout( function() {
			document.body.style.backgroundColor = "#000";
		}, 200 );
		var message = "No path found that meets the given constraint.";
		document.getElementById( "message" ).innerHTML = message;
	}
} );


 



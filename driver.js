goog.require( 'mcc.map.Map' );
goog.require( 'mcc.pathfinding.Astar' );

var btn = document.getElementById( 'apply' );
var mapNameDD = document.getElementById( 'mapName' );
var map = new mcc.map.Map( 'jxgbox' );

var maps = new Object(); 

maps.assignment1 = { // ASSIGNMENT 1 MAP
	start: [ 1,8],
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



map.draw( maps[mapNameDD.value] );

mapNameDD.addEventListener( 'change', function( event )  {
	JXG.JSXGraph.freeBoard( map.board );
	map = new mcc.map.Map( 'jxgbox' );
	
	map.draw( maps[event.target.value] );
	//console.log(map);
} );

btn.addEventListener( 'click', function() { 	   // add an onclick to the apply button
	const astar = new mcc.pathfinding.Astar( map );
} ); 

window.addEventListener( 'newPath', function(e) {  // listen for the algorithm to trigger a newPath event
	map.drawSegment( e.detail.p1, e.detail.q1 );   // show the segment on the board
} );

window.addEventListener( 'goalPath', function(e) { // listen for the algorithm to trigger a goalPath event
	map.drawChosenPath( e.detail.goal ); 		   // show the chosen path on the board
} );



 






// Obsolete functions from original implementation. 
// Some may be of potential use in the future, so hang on to it for now.
//
//
//
// function drawMap() {
// 	var attr = getMapControls();	// get attributes
// 	return generateMap( attr );		// get map based on attributes
// }
// function getMapControls() {
// 	var attr = new Object();
// 	
// 	attr.mapType = document.getElementById( 'mapType' ).value;
// 	//attr.obSize = document.getElementById( 'obSize' ).value;
// 	//attr.obDensity = document.getElementById( 'obDensity' ).value;
// 	attr.frameDelay = document.getElementById( 'frameDelay' ).value;
// 	
// 	return attr;
// }
// function generateMap( attr ) {
// 	switch( attr.mapType ) {
// 		case 'random':
// 			return generateRandomMap( attr );
// 		case 'assignment1':
// 			return generateAssignment1Map();
// 	}
// }
// function generateAssignment1Map() {
// 	board = JXG.JSXGraph.initBoard( 'jxgbox', {
//         boundingbox: [0,-3,19,16]
//     });
//     
//     var obstacles = [
//     	//board.create( 'polygon', [[0,12],[0,0],[19,0],[19,12]] ),
//     	board.create( 'polygon', [[2,10],[2,8],[10,8],[10,10]] ),
//     	board.create( 'polygon', [[4,7],[6,4],[5,1],[1,3],[2,6]] ),
//     	board.create( 'polygon', [[6,7],[8,7],[7,3]] ),
//     	board.create( 'polygon', [[11,9],[12,8],[10,6]] ),
//     	board.create( 'polygon', [[9,4],[9,1],[11,1],[12,3]] ),
//     	board.create( 'polygon', [[13,6],[15,6],[15,1],[13,1]] ),
//     	board.create( 'polygon', [[18,7],[18,3],[17,2],[16,3]] ),
//     	board.create( 'polygon', [[17,10],[17,8],[16,7],[14,8],[14,10],[16,11]] )
//     ];
//     
//     
//     var start = board.create( 'point', [1,9], { name: 'S' } );
//     var goal =  board.create( 'point', [18,1], { name: 'G' } );
// 	
// 	return { obstacles: obstacles, start: start, goal: goal };
// }
// 
// 
// 
// 

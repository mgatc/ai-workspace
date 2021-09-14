# A* Workspace


This project is meant to provide a browser-based workspace for the development and 
demonstration of pathfinding algorithms. 

A live version is available at https://mgatc.github.io/ai-workspace/. Use Google Chrome for best results.



------------
Dependencies
------------

1.	JSXGraph.  A javascript geometry library for visualization. 
	https://jsxgraph.uni-bayreuth.de/wp/index.html
	
2.	Google Closure Library.  Used for Priority Queue.
	https://developers.google.com/closure/library
	
	
	
----------------------
Potential Improvements
----------------------

1.	Current implementation uses naive collision detection methods, slowing performance in environments with a large number of obstacles. Implementing a physics engine could improve this project.
2.	The UI could be improved to maximize the size of the user viewpoint into the search world. See https://mgatc.github.io/bounded-degree-plane-spanners/.

require(["jquery", "html5shiv", "models/chromosome"], function($) {
    $(function() {
    	var chromosome = new ChromosomeSection();
    	var height = 400, width = 800, graph = $('#chromosomeGraph .data');

    	graph.css({
    		height: height,
    		width: width
    	});
    	console.log(graph);

    	var i, items = chromosome.getData().items, 
    		start = chromosome.getData().section.x1,
    		end = chromosome.getData().section.x2, domItems = [];
    	for(i in chromosome.getData().items){
    		var item = items[i];
    		var point = $('div', {"class":"point"});
    		var css = {
    			left : item.start - start,
	    		width : item.end - start,
	    		top : (1 - item.y) * height,
	    		height : 5,
	    		position : 'relative'
	    	};
    		point.css(css);
    		domItems.push(point);
    	}
    	console.log(domItems);
    	$('#chromosomeGraph .data').append(domItems);
    });
});

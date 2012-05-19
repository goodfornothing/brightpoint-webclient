$(function() {
	

    var chromosomeSection = new SectionAdapter();
    $.ajax({
    	url: 'http://brightpoint.herokuapp.com/api/v1/subjects.json',
    	type: 'GET',
    	dataType: 'json',
    	success: function(data){
    		console.log(data);
    		chromosomeSection.setData(data[0]);
    		plotGraph(chromosomeSection.getData());
    	}
    });
    
});

function plotGraph(chromosome){
	// console.log(chromosome.data_points);
	var axisx = [],
        axisy = [],
        maxY = 0, minY = 0,
        maxX = 0, minX = 0;
    $.each(chromosome.data_points, function(i, item){
    	console.log(item);
		if(item.y > maxY) maxY = item.y;
		if(item.y < minY) minY = item.y;
		var x = item.end + item.start / 2;
		if(x > maxX) maxX = x;
		if(x < minX) minX = x;
    });
    // Draw
    var width = 2100,
        height = 360,
        leftgutter = 100,
        bottomgutter = 30,
        topgutter = 30,
        contentWidth = width - leftgutter,
        contentHeight = height - topgutter - bottomgutter;
        r = Raphael("chart", width, height),
        txt = {"font": 'Nokia Pure Text, Arial', stroke: "none", fill: "#fff"},
        color = $("#chart").css("color"),
        deltaX = (maxX - minX) / 10,
        deltaY = (maxY - minY) / 20;
    for (var y = 0; y <= 20; y++ ) {
        r.text(25, topgutter + (y * (contentHeight) / 21), roundNumber(((y * deltaY) - maxY), 4 ) ).attr(txt);
    }
    for (var x = 0; x <= 10; x++ ) {
        r.text( leftgutter + (x * contentWidth / 11), height - 10, Math.round((x * deltaX) + minX)).attr(txt);
    }
    // console.log(chromosome.data_points.length);
    $.each(chromosome.data_points, function(i, item){
    	var pointX = item.end + item.start / 2;
    	var x = leftgutter +((pointX - minX) / (maxX - minX) * contentWidth);
    	var y = topgutter + (maxY - item.y) / (maxY - minY) * contentHeight;
    	r.circle(x, y, 2).attr({stroke: "none", fill: "#000", opacity: 1});;
    });

}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
$(function() {
	

    var chromosomeSection = new ChromosomeSection(), chromosome = chromosomeSection.getData();
    console.log(chromosome);
    var axisx = [],
        axisy = [],
        maxY = 0, minY = 0,
        maxX = chromosome.section.x2, minX = chromosome.section.x1;
    $.each(chromosome.items, function(i, item){
		if(item.y > maxY) maxY = item.y;
		if(item.y < minY) minY = item.y;
    });
    // Draw
    var width = 1300,
        height = 760,
        leftgutter = 100,
        bottomgutter = 30,
        topgutter = 30;
        r = Raphael("chart", width, height),
        txt = {"font": 'Nokia Pure Text, Arial', stroke: "none", fill: "#fff"},
        color = $("#chart").css("color"),
        deltaX = (maxX - minX) / 10,
        deltaY = (maxY - minY) / 20;
    for (var y = 0; y <= 20; y++ ) {
        r.text(25, topgutter + (y * (height - bottomgutter - topgutter) / 21), roundNumber(((y * deltaY) - maxY), 4 ) ).attr(txt);
    }
    for (var x = 0; x <= 10; x++ ) {
        r.text( leftgutter + (x * width / 11), 750, (x * deltaX) + minX).attr(txt);
    }
    console.log(chromosome.items.length);
    $.each(chromosome.items, function(i, item){
    	console.log(item);
    	console.log(' - - - - ');
    	var x = leftgutter +((item.start - minX) / (maxX - minX) * width);
    	console.log((maxY - minY));
    	console.log((maxY - item.y));
    	var y = topgutter + (maxY - item.y) / (maxY - minY) * height;
    	console.log(y);
    	r.circle(x, y, 2).attr({stroke: "none", fill: "#000", opacity: 1});;
    });
});

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
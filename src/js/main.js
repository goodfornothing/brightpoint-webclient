$(function() {
	

    var chromosomeSection = new ChromosomeSection(), chromosome = chromosomeSection.getData();
    console.log(chromosome);
    var axisx = [],
        axisy = [],
        maxY = 0, minY = 0, yDepth = 1000,
        maxX = chromosome.section.x2, minX = chromosome.section.x1;
    $.each(chromosome.items, function(i, item){
		if(item.y > maxY) maxY = item.y;
		if(item.y < minY) minY = item.y;
    });
    var yD = (maxY - minY) / yDepth;
    // Draw
    var width = 1200,
        height = 800,
        leftgutter = 80,
        bottomgutter = 30,
        r = Raphael("chart", width, height),
        txt = {"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#fff"},
        // X = (width - leftgutter) / chromosome.items.length,
        // Y = (height - bottomgutter) / yDepth,
        color = $("#chart").css("color"),
        deltaX = (maxX - minX) / 10,
        deltaY = (maxY - minY) / 30;
    for (var x = 0; x < 10; x++) {
        r.text(leftgutter + (x * (width - leftgutter) / 10), 794, Math.round(deltaX * x)).attr(txt);
    }
    for (var y = maxY; y > minY; y=y - deltaY ) {
        r.text(25, bottomgutter + (((y * -1) - minY) * (height / 2)), roundNumber(y, 5)).attr(txt);
    }
    var centreY = (minY * -1) * (height / 2);
    $.each(chromosome.items, function(i, item){
    	console.log(item);
    	console.log('height: ' + height);
    	var x = item.start / deltaX;
    	var y = centreY + (item.y * height / 2) ;
    	r.circle(x, y, 2).attr({stroke: "none", fill: "#000", opacity: 1});;
    });
    // var o = 0;
    // for (var i = 0, ii = axisy.length; i < ii; i++) {
    // 	console.log('i: '+ i);
    //     for (var j = 0, jj = axisx.length; j < jj; j++) {
    // 		console.log('j: '+ j);
    //         r.circle(20, 20);
    //         o++;
    //     }
    // }
});

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
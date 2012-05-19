$(function() {
	

    var chromosomeSection = new ChromosomeSection(), chromosome = chromosomeSection.getData();
    var axisx = [],
        axisy = [];
    $.each(chromosome.items, function(i, item){
    	// console.log(item);
		axisy.push(item.y);
		axisx.push(item.start);
    });
    console.log(axisx);
    console.log(axisy);
    // Draw
    var width = 800,
        height = 300,
        leftgutter = 30,
        bottomgutter = 20,
        r = Raphael("chart", width, height),
        txt = {"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#fff"},
        X = (width - leftgutter) / axisx.length,
        Y = (height - bottomgutter) / axisy.length,
        color = $("#chart").css("color");
        max = Math.round(X / 2) - 1;

    for (var i = 0, ii = axisx.length; i < ii; i++) {
        r.text(leftgutter + X * (i + .5), 294, axisx[i]).attr(txt);
    }
    for (var i = 0, ii = axisy.length; i < ii; i++) {
        r.text(10, Y * (i + .5), axisy[i]).attr(txt);
    }
});


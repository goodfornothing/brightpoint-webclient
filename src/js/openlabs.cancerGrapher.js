// jQuery Plugin Cancer Grapger
// Openlabs plugin for making a graph of cancer interesting or something
// by Paul Herve
// #openlabs @Good4Nothing

;(function($) {

    $.fn.cancerGrapher = function(options) {
		return this.each(function() {
      
	        var defaults = {
	            url: 'http://brightpoint.herokuapp.com/api/v1/subjects.json',
	            name: 'chart'
	        }

	        var plugin = this;

	        plugin.settings = {}

	        var init = function() {

	            plugin.settings = $.extend({}, defaults, options);

	            var chromosomeSection = new SectionAdapter();
			    $.ajax({
			    	url: 'http://brightpoint.herokuapp.com/api/v1/subjects.json',
			    	type: 'GET',
			    	dataType: 'json',
			    	success: function(data){
			    		chromosomeSection.setData(data[0]);
			    		plotGraph(chromosomeSection.getData());
			    	},
			    	error: function(){
			    		console.log('failed');
			    		plotGraph(chromosomeSection.getData());
			    	}
			    });

	            // code goes here

	        }

	        var plotGraph = function(chromosome) {
				var axisx = [],
			        axisy = [],
			        maxY = 0, minY = 0,
			        maxX = 0, minX = 9999999;
			    $.each(chromosome.data_points, function(i, item){
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
			        r = Raphael(plugin.settings.name, width, height),
			        txt = {"font": 'Nokia Pure Text, Arial', stroke: "none", fill: "#f22"},
			        color = $("#chart").css("color"),
			        deltaX = (maxX - minX) / 10,
			        deltaY = (maxY - minY) / 20;
			    for (var y = 0; y <= 20; y++ ) {
			        r.text(25, topgutter + (y * (contentHeight) / 21), roundNumber(((y * deltaY) - maxY), 4 ) ).attr(txt);
			    }
			    for (var x = 0; x <= 10; x++ ) {
			        r.text( leftgutter + (x * contentWidth / 11), height - 10, Math.round((x * deltaX) + minX)).attr(txt);
			    }
			    $.each(chromosome.data_points, function(i, item){
			    	var pointX = item.end + item.start / 2;
			    	var x = leftgutter +((pointX - minX) / (maxX - minX) * contentWidth);
			    	var y = topgutter + (maxY - item.y) / (maxY - minY) * contentHeight;
			    	r.circle(x, y, 2).attr({stroke: "none", fill: "#000", opacity: 1});;
			    });
			    $(plugin).find('svg').click(graphEvent());

	        }

	        var selection = 0;

	        var graphEvent = function(){
	        	return function(e){
	        		console.log(e.offsetX, e.offsetY);
	        		var selector = $('<div/>', {
	        			'class': 'selector',
	        			'id': 'selector' + selection
	        		});
	        		console.log(selector);
	        		$(plugin).append(selector);
	        		selector.css({
	        			'left': e.offsetX,
	        			'top': e.offsetY
	        		});
	        		selector.resizable();
	        		selector.draggable();
	        		selector.on('dblclick', function(e){
	        			selector.hide();
	        		})
	        		var go = $('<div>GO</div>', {
	        			'class': 'sumbitInterest',
	        			'id': 'sumbitInterest' + selection
	        		});
	        		selector.append(go);
	        		go.css({
	        			left: '45%',
	        			top: '45%',
	        			position: 'absolute'
	        		})
	        		go.on('click', function(e){
	        			//TODO submit to server the interest
	        			selector.hide();
	        		})
	        		selection++;
	        	}
	        }

	        var roundNumber = function (num, dec) {
				var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
				return result;
			}

        // call the "constructor" method
        init();
		});

    }

})(jQuery);
// jQuery Plugin Cancer Grapger
// Openlabs plugin for making a graph of cancer interesting or something
// by Paul Herve @paullth
// #openlabs @Good4Nothing

;(function($) {

    $.fn.cancerGrapher = function(options) {
		return this.each(function() {
      
	        var defaults = {
	            url: 'http://brightpoint.herokuapp.com/api/v1/subjects.json',
	            name: 'chart',
	            axis: true,
	            topgutter: 30,
	            rightgutter: 0,
	            bottomgutter: 30,
	            leftgutter: 100,
	            height: 360,
	            width: 2100,
	            spotColor: '#443333'
	        }

	        var plugin = this;

	        plugin.settings = {}

	        var init = function() {

	            plugin.settings = $.extend({}, defaults, options);

	            if(!plugin.settings.axis){
	            	plugin.settings.topgutter = 5, plugin.settings.rightgutter = 5, plugin.settings.bottomgutter = 5, plugin.settings.leftgutter = 5;
	            }

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
			    var contentWidth = plugin.settings.width - plugin.settings.leftgutter - plugin.settings.rightgutter,
			        contentHeight = plugin.settings.height - plugin.settings.topgutter - plugin.settings.bottomgutter;
			        r = Raphael(plugin.settings.name, plugin.settings.width, plugin.settings.height),
			        txt = {"font": 'Nokia Pure Text, Arial', stroke: "none", fill: "#f22"},
			        deltaX = (maxX - minX) / 10,
			        deltaY = (maxY - minY) / 20;
			    if(plugin.settings.axis){
				    for (var y = 0; y <= 20; y++ ) {
				        r.text(25, plugin.settings.topgutter + (y * (contentHeight) / 21), roundNumber((((y * deltaY) - maxY) * -1), 4 ) ).attr(txt);
				    }
				    for (var x = 0; x <= 10; x++ ) {
				        r.text( plugin.settings.leftgutter + (x * contentWidth / 11), plugin.settings.height - 10, Math.round((x * deltaX) + minX)).attr(txt);
				    }
				}
			    $.each(chromosome.data_points, function(i, item){
			    	var pointX = item.end + item.start / 2;
			    	var x = plugin.settings.leftgutter +((pointX - minX) / (maxX - minX) * contentWidth);
			    	var y = plugin.settings.topgutter + (maxY - item.y) / (maxY - minY) * contentHeight;
			    	r.circle(x, y, 2).attr({stroke: "none", fill: plugin.settings.spotColor, opacity: 1});;
			    });
	            plugin.settings = $.extend(plugin.settings, {
	            	minX: minX,
	            	minY: minY,
	            	maxX: maxX,
	            	maxX: maxX,
	            	deltaX: deltaX,
	            	deltaY: deltaY,
	            	contentWidth: contentWidth,
	            	contentHeight: contentHeight
	            });
			    $(plugin).find('svg').click(graphEvent());

	        }

	        var selection = 0;

	        var graphEvent = function(){
	        	return function(e){
	        		var selector = $('<div/>', {
	        			'class': 'selector',
	        			'id': 'selector' + selection
	        		});
	        		$(plugin).append(selector);
	        		selector.css({
	        			'left': e.offsetX - 6,
	        			'height': '100%',
	        			'width': '22px'
	        		});
	        		selector.resizable({ 
	        			handles: 'e, w' 
	        		});
	        		selector.draggable({
	        			containment: 'parent' 
	        		});
	        		selector.on('dblclick', function(e){
	        			selector.hide();
	        		});
	        		var go = $('<div>GO</div>', {
	        			'class': 'sumbitInterest',
	        			'id': 'sumbitInterest' + selection
	        		});
	        		selector.append(go);
	        		go.css({
	        			top: '45%',
	        			position: 'absolute'
	        		});
	        		go.on('dblclick', sumbitInterestEvent(selector, go));
	        		selection++;
	        	}
	        }

	        var sumbitInterestEvent = function(selector, go){
	        	return function(e){
	        		var position = selector.position(), xEl = position.left, yEl = position.y;
	        		console.log(plugin.settings.leftgutter);
	        		console.log(plugin.settings.contentWidth);
	        		console.log(plugin.settings.minX);
	        		console.log(xEl);
			    	// var x = plugin.settings.leftgutter +((pointX - minX) / (maxX - minX) * contentWidth);
			    	// var x - plugin.settings.leftgutter = (pointX - minX) / (maxX - minX) * contentWidth;
			    	// var (x - plugin.settings.leftgutter) / contentWidth = (pointX - minX) / (maxX - minX);
			    	// var ((x - plugin.settings.leftgutter) / contentWidth) * (maxX - minX) = (pointX - minX);
			    	// var (((x - plugin.settings.leftgutter) / contentWidth) * (maxX - minX)) + minX = pointX;
			    	var pointX = (((xEl - plugin.settings.leftgutter) / plugin.settings.contentWidth) * (plugin.settings.maxX - plugin.settings.minX)) + plugin.settings.minX;
			    	// var y = plugin.settings.topgutter + (maxY - item.y) / (maxY - minY) * contentHeight;
			    	console.log(pointX);
	        		selector.hide();
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
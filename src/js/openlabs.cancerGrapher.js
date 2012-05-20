// jQuery Plugin Cancer Grapger
// Openlabs plugin for making a graph of cancer interesting or something
// by Paul Herve @paullth
// #openlabs @Good4Nothing

;(function($) {

    $.fn.cancerGrapher = function(options) {
		return this.each(function() {
      
	        var defaults = {
	            dataUrl: 'http://brightpoint.herokuapp.com/api/v1/subjects/next.json',
	            sumbitUrl: 'http://brightpoint.herokuapp.com/api/v1/subjects/1/classifications/new.json',
	            name: 'chart',
	            axis: true,
	            topgutter: 30,
	            rightgutter: 0,
	            bottomgutter: 30,
	            leftgutter: 100,
	            height: 330,
	            width: 2100,
	            spotColor: '#443333',
	            xAxisPoints: 20,
	            yAxisPoints: 20,
	            button: '#submitAnnotations'
	        }

	        var plugin = this;

	        plugin.settings = {}

	        var subject_id, start_point, end_point;
	        var annotations = [];

	        var init = function() {

	            plugin.settings = $.extend({}, defaults, options);

	            if(!plugin.settings.axis){
	            	plugin.settings.topgutter = 5, plugin.settings.rightgutter = 5, plugin.settings.bottomgutter = 5, plugin.settings.leftgutter = 5;
	            }

	            var chromosomeSection = new SectionAdapter();
			    $.ajax({
			    	url: plugin.settings.dataUrl,
			    	type: 'GET',
			    	dataType: 'json',
			    	success: function(data){
			    		chromosomeSection.setData(data);
			    		plotGraph(chromosomeSection.getData());
			    	},
			    	error: function(){
			    		console.log('failed');
			    		plotGraph(chromosomeSection.getData());
			    	}
			    });
			    $(plugin.settings.button).click(function(e){
			    	e.preventDefault();
			    	e.stopPropagation();
			    	submitFinal();
			    })
	            // code goes here

	        }

	        var plotGraph = function(chromosome) {
	        	subject_id = chromosome.id;
				var axisx = [],
			        axisy = [],
			        maxY = 0, minY = 0,
			        maxX = 0, minX = 9999999;
			    $.each(chromosome.metadata.data_points, function(i, item){
					if(item.y > maxY) maxY = item.y;
					if(item.y < minY) minY = item.y;
					var x = (item.end + item.start) / 2;
					if(x > maxX) maxX = item.end;
					if(x < minX) minX = item.start;
			    });
	        	start_point = minX;
	        	end_point = maxX; 
			    // Draw
			    var contentWidth = plugin.settings.width - plugin.settings.leftgutter - plugin.settings.rightgutter,
			        contentHeight = plugin.settings.height - plugin.settings.topgutter - plugin.settings.bottomgutter;
			        r = Raphael(plugin.settings.name, plugin.settings.width, plugin.settings.height),
			        txt = {"font": 'Nokia Pure Text, Arial', stroke: "none", fill: "#f22"},
			        deltaX = (maxX - minX) / plugin.settings.xAxisPoints,
			        deltaY = (maxY - minY) / plugin.settings.yAxisPoints;
			    if(plugin.settings.axis){
				    for (var y = 0; y <= plugin.settings.yAxisPoints; y++ ) {
				        r.text(25, plugin.settings.topgutter + (y * (contentHeight) / (plugin.settings.yAxisPoints + 1)), roundNumber((((y * deltaY) - maxY) * -1), 4 ) ).attr(txt);
				    }
				    for (var x = 0; x <= plugin.settings.xAxisPoints; x++ ) {
				        r.text( plugin.settings.leftgutter + (x * contentWidth / (plugin.settings.xAxisPoints + 1)), plugin.settings.height - 10, Math.round((x * deltaX) + minX)).attr(txt);
				    }
				}
			    $.each(chromosome.metadata.data_points, function(i, item){
			    	var pointX = (item.end + item.start) / 2;
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
	        			left: '45%',
	        			position: 'relative'
	        		});
	        		go.on('dblclick', sumbitInterestEvent(selector, go));
	        		selection++;
	        	}
	        }

	        var sumbitInterestEvent = function(selector, go){
	        	return function(e){
	        		var position = selector.position(), xEl = position.left, yEl = position.y;
			    	var pointX1 = (((xEl - plugin.settings.leftgutter) / plugin.settings.contentWidth) * (plugin.settings.maxX - plugin.settings.minX)) + plugin.settings.minX;
			    	var pointX2 = 12315425;
	        		selector.hide();
	        		annotations.push({
	        			start: pointX1,
	        			end: pointX2
	        		})	
	        	}
	        }

	        var submitFinal = function(){
	        	console.log(annotations);
	        	$(plugin.settings.button).hide();
				var queryString = 
					'subject_id='+subject_id+'&'+
					'started='+start_point+'&'+
					'ended='+end_point+'&';
				$.each(annotations, function(i, annotation){
					queryString += 'annotations[]={start:'+annotation.start+', end:'+annotation.end+'}&';
				});

	        	console.log(queryString);
				$.ajax({
        			url: plugin.settings.sumbitUrl,
    				crossDomain: true,
        			type: 'POST',
        			dataType: 'jsonp',
        			data: queryString,
        			success: function(responseData, textStatus, jqXHR){
	        			$(plugin.settings.button).show();
	        			reInit();
        			},
        			error: function(){
	        			$(plugin.settings.button).show();
	        			$(plugin).parent().append($('<div>error!!!!</div>'));
        			}
        		});
	        }

	        var reInit = function(){
	        	$(plugin).find('svg').remove();
	        	init();
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
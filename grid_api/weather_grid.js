
var weather_grid = (function(){
	var weather_module = {}

	var data      = undefined
	var max_value = 0
	var format    = undefined

	/**
	 * Function to take the data given and store it. Also finds max value overall.
	 *
	 * @param d The data to be displayed in the graph. Array of Dictionaries where
	 * 	    the value to be displayed is tied to the key "data".
	 */
	weather_module.load_data = function(d, threshold){
		data = d
		if (threshold == undefined) {
			for (var i= 0; i < data.length; i++) {
				if (data[i] != undefined && data[i]["data"] > max_value) {
					max_value = data[i]["data"]
				}
			}
		} else {
			max_value = threshold;
		}
	}

	/**
	 * Function to define which format to display the grid. If not defined the 
	 * grid will just display white.
	 *
	 * Supported formats:
	 * 	- heat_map
	 * 	- cool_map
	 *
	 * @param fmt The format to be used. String value
	 */
	weather_module.update_format = function(fmt) {
		format = fmt
	}

	/**
	 * Function to display the grid, the data in the grid, and the 
	 * format(if defined). 
	 * This function needs to be called each time information is updated.
	 *
	 * @param canvasTag The string ID value for the canvas tag to have the info
	 * 		    displayed in.
	 * @param boxSize The size ofthe boxes to be displayed. Default size is 40.
	 */
	weather_module.display = function(canvasTag, boxSize){
		var c = window.document.getElementById(canvasTag)
		var ctx = c.getContext("2d")
		imageObj = new Image();
		imageObj.onload = function(){      
			ctx.drawImage(imageObj,90,110,460,460,0,0,c.width,c.height);
			boxSize = boxSize || 80
			var width = c.width;
			var height = c.height;
			var size = width + height
			var box_size = size/boxSize
			ctx.font = (0.4*box_size) + "px Helvetica"
			var text_pos_y = 0.35*box_size
			var text_pos_x = 0.8*box_size
			count = 0
			for (var i = box_size, j = box_size; j <= size; i += box_size) {
				console.log("for")	
				ctx.fillStyle = "black";
				ctx.strokeStyle = "black";
				ctx.beginPath();
				ctx.moveTo(i, j);
				ctx.lineTo(i-box_size, j);
				ctx.stroke()
				ctx.moveTo(i, j)
				ctx.lineTo(i,j-box_size)
				ctx.stroke()
				ctx.closePath()
				if (count < data.length) {
					var item = data[count]
					if (item != undefined) {
						fill_square(ctx, item["data"], i, j, box_size)
						//draw_value(ctx, item["data"], i-text_pos_x, j-text_pos_y)
					}
				}
				if (i >= width) {
					j += box_size
					i = 0
				}
				count++
			}
		}
		imageObj.src = "https://maps.googleapis.com/maps/api/staticmap?center=11.0,170&zoom=5&size=800x800&maptype=satellite&key=AIzaSyBiJ3S2EtlwwzNw_p9IjofNx2Hwpc-EGzQ";
	}


	var fill_square = function(ctx, value, i, j, box_size) {
		var num_val = Math.floor((value/max_value) * 255);
		if (num_val > 255) {
			num_val = 255;
		}
		if (format == "heat_map") {
			var color_str = "rgba(" + num_val + ",0,0,"+(num_val/400)+")";
			ctx.fillStyle = color_str;
			ctx.fillRect(i-box_size, j-box_size, box_size, box_size)
		} else if (format == "cool_map") {
			var color_str = "rgba(0,0," + num_val + ","+(num_val/400)+")";
			ctx.fillStyle = color_str;
			ctx.fillRect(i-box_size, j-box_size, box_size, box_size)
		}
	}

	var draw_value = function(ctx, text, i, j) {
		ctx.fillStyle = "white";
		ctx.fillText(text, i, j)
	}

	return weather_module
})()

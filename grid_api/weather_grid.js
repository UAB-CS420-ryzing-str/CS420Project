var weather_grid = (function(){
	var weather_module = {}

	var data = undefined
	var max_value = 0
	var format = undefined

	function boxSelect() {

	}

	/**
	 * Function to take the data given and store it. Also finds max value overall.
	 *
	 * @param d The data to be displayed in the graph. Array of Dictionaries where
	 * 	    the value to be displayed is tied to the key "data".
	 */
	weather_module.load_data = function(d){
		data = d
		for (var i= 0; i < data.length; i++) {
			if (data[i] != undefined && data[i]["data"] > max_value) {
				max_value = data[i]["data"]
			}
		}
	}

	/**
	 * Function to define which format to display the grid. If not defined the 
	 * grid will just display white.
	 *
	 * Supported formats:
	 * 	- heat_map
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
		boxSize = boxSize || 40
		var c = window.document.getElementById(canvasTag)
		var width = c.width;
		var height = c.height;
		var ctx = c.getContext("2d")
		var size = width + height

		var box_size = size/boxSize
		ctx.font = (0.4*box_size) + "px Helvetica"
		var text_pos_y = 0.35*box_size
		var text_pos_x = 0.8*box_size
		count = 0
		for (var i = box_size, j = box_size; j <= size; i += box_size) {
			
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
					draw_value(ctx, item["data"], i-text_pos_x, j-text_pos_y)
				}
			}
			if (i >= width) {
				j += box_size
				i = 0
			}
			count++
		}
	
	}

	var fill_square = function(ctx, value, i, j, box_size) {
		if (format == "heat_map") {
			var num_val = Math.floor((value/max_value) * 255); 
			var color_str = "rgb(" + num_val + ",0,0)";
			ctx.fillStyle = color_str;
			ctx.fillRect(i-box_size, j-box_size, box_size, box_size)
			if (num_val < 100) {
				ctx.fillStyle = "white"
			} else {
				ctx.fillStyle = "black"
			}
		}
	}

	var draw_value = function(ctx, text, i, j) {
		ctx.fillText(text, i, j)
	}

	return weather_module
})()

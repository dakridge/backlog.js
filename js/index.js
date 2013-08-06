(function()
{
	backlog = [];

	var p = getQueryParams(window.location.search);
	var url = (p.hasOwnProperty("key")) ? "https://docs.google.com/spreadsheet/pub?key=" + p["key"] + "&single=true&gid=0&output=csv" : false;

	var priorityOrder = ["h", "m", "l", "none"];

	var priorities = {
			"h"		: "High",
			"m"		: "Medium",
			"l"		: "Low",
			"none"	: "No"
		};

	$("#backlog-labels").on("click", ".label", function(e)
	{
		var that = $(this);
		var sort = that.attr("data-sort");

		if( sort == "Priority" )
		{
			backlog.sort(function(a, b)
			{
				var x = priorityOrder.indexOf( a[sort].toLowerCase() );
				var y = priorityOrder.indexOf( b[sort].toLowerCase() );

				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}

		backlog.sortByKey( sort );
		$("#backlog-list").empty();
		build(backlog);
	});

	$("#viewhidden").on("click", function(e)
	{
		var that = $(this);
		that.toggleClass("showing");
		$("#backlog-list").toggleClass("showing");
	});

	var list = d3.select("#backlog-list");

	if( url )
	{
		d3.csv(url, function(error, res)
		{
			console.log( res );

			backlog = res;
			build(res);
		});
	}
	else
	{
		list.append("h2")
			.text("Need query string with parameter 'key'");

		list.append("h3")
			.text("Example: ?key=0Ar9b16u8gRNVdEtkWXo5bGhUZ3lTVnFldVhObTRIdWc");
	}

	function build(res)
	{
		validate(res);
		var colors = rainbow(res);

		// DATA JOIN
		// Bind data to the list
		var items = list.selectAll(".item")
			.data( res );

		// ENTER
		// Create new elements as needed.
		var item = items.enter()
			.append("div")
			.attr("class", function(b){ return "item " + b.backlog.isdone });

		item.append("div")
			.attr("class", function(b){ return "type " +  b.backlog["type of request"].toLowerCase().replace(/\s+/g, '') })
			.append("div")
			.style("background-color", function(b){ return colors[ b.backlog["type-class"] ] })
			.text(function(b){ return b.backlog["type of request"] });

		item.append("div")
			.attr("class", "uid")
			.text(function(b){ return b.backlog["id"] });

		item.append("div")
			.attr("class", "description")
			.text(function(b){ return b.backlog["description"] });

		var type = item.append("div")
			.attr("title", function(b){ return priorities[ b.backlog["priority"].toLowerCase() ] + " Priority" })
			.attr("class", function(b){ return "priority " + b.backlog["priority"].toLowerCase() })
			.append("div");
	}

	function rainbow(a)
	{
		var colors = ["#9b59b6", "#27ae60", "#3498db", "#e67e22", "#e74c3c", "#34495e", "#1abc9c"];
		var types = [];
		var count = 0;

		var typeColors = {};

		a.forEach(function( d, i )
		{
			var s = d.backlog["type of request"].toLowerCase().replace(/\s+/g, '');
			d.backlog["type-class"] = s;

			if( types.indexOf( s ) < 0 )
			{
				types.push( s );
				typeColors[ s ] = colors[ count % colors.length ];

				count++
			}
		});

		return typeColors;
	}

	function validate(a)
	{
		//sets up the backlog array for use

		//these are the required properties
		var props = ["Priority", "Description", "Type of request", "ID"];

		a.forEach(function(d, i)
		{
			d.backlog = {};

			props.forEach(function(b)
			{
				var bl = b.toLowerCase();

				if( !d.hasOwnProperty(b) )
				{
					d.backlog[ bl ] = "none";
				}
				else
				{
					d.backlog[ bl ] = d[b];
				}

				if( bl == "id" )
				{
					d.backlog[ bl ] = +d.backlog[ bl ];
				}
				else if( bl == "priority" )
				{
					d.backlog[ bl ] = d.backlog[ bl ].toLowerCase();

					if( priorityOrder.indexOf( d.backlog[ bl ] ) < 0 )
					{
						d.backlog[ bl ] = "none";
					}
				}
			});

			if( d.hasOwnProperty("Release Date") && d["Release Date"] != undefined && d["Release Date"].length )
			{
				d.backlog["released"] = d["Release Date"];
				d.backlog["isdone"] = "isdone";
			}
			else
			{
				d.backlog["released"] = "";
				d.backlog["isdone"] = "notdone";
			}

		});
	}

})();
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
		// DATA JOIN
		// Bind data to the list
		var items = list.selectAll(".item")
			.data( res );

		// ENTER
		// Create new elements as needed.
		var item = items.enter()
			.append("div")
			.attr("class", "item")
			.each( function(b)
			{
				if( priorityOrder.indexOf( b["Priority"].toLowerCase() ) < 0 ){ b["Priority"] = "none"; }

				b["ID"] = +b["ID"];

			});

		item.append("div")
			.attr("class", function(b){ return "type " +  b["Type of request"].toLowerCase().replace(/\s+/g, '') })
			.append("div")
			.text(function(b){ return b["Type of request"] });

		item.append("div")
			.attr("class", "uid")
			.text(function(b){ return b["ID"] });

		item.append("div")
			.attr("class", "description")
			.text(function(b){ return b["Description"] });

		item.append("div")
			.attr("title", function(b){ return priorities[ b["Priority"].toLowerCase() ] + " Priority" })
			.attr("class", function(b){ return "priority " + b["Priority"].toLowerCase() })
			.append("div");
	}

})();
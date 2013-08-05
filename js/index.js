(function()
{
	backlog = [];

	var p = getQueryParams(window.location.search);
	var url = (p.hasOwnProperty("key")) ? "https://docs.google.com/spreadsheet/pub?key=" + p["key"] + "&single=true&gid=0&output=csv" : false;

	var priorities = {
			"h"	: "High",
			"m"	: "Medium",
			"l"	: "Low"
		};

	$("#backlog-labels").on("click", ".label", function(e)
	{
		var that = $(this);

		if( that.hasClass("type") )
		{
			backlog.sortByKey("Type of Request");
		}
		if( that.hasClass("uid") )
		{
			backlog.sortByKey("ID");
		}

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
			.attr("class", "item");

		item.append("div")
			.attr("class", function(b){ return "type " +  b["Type of Request"].toLowerCase().replace(/\s+/g, '') })
			.append("div")
			.text(function(b){ return b["Type of Request"] });

		item.append("div")
			.attr("class", "uid")
			.text(function(b){ return b["ID"] });

		item.append("div")
			.attr("class", "description")
			.text(function(b){ return b["Description"] });

		item.append("div")
			.attr("title", function(b){ return ( b["Priority"] != undefined ) ? priorities[ b["Priority"].toLowerCase() ] + " Priority" : "No Priority" })
			.attr("class", function(b){ return "priority " + (( b["Priority"] != undefined ) ? b["Priority"].toLowerCase() : "none") })
			.append("div");
	}

})();
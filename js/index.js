(function()
{
	var p = getQueryParams(window.location.search);
	var url = (p.hasOwnProperty("key")) ? "https://docs.google.com/spreadsheet/pub?key=" + p["key"] + "&single=true&gid=0&output=csv" : false;

	var list = d3.select("#backlog-list");

	if( url )
	{
		d3.csv(url, function(error, res)
		{
			console.log( res );

			res.forEach(function(d, i)
			{

				var tp = d["Type of Request"].toLowerCase().replace(/\s+/g, '');

				var item = list
					.append("div")
					.attr("class", "item");

				item.append("div")
					.attr("class", "type " + tp)
					.append("div")
					.text(d["Type of Request"]);

				item.append("div")
					.attr("class", "description")
					.text(d["Description"]);
			});
		});
	}
	else
	{
		list.append("h2")
			.text("Need query string with parameter 'key'");

		list.append("h3")
			.text("Example: ?key=0Ar9b16u8gRNVdEtkWXo5bGhUZ3lTVnFldVhObTRIdWc");
	}

})();
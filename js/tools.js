function getQueryParams(qs)
{
	qs = qs.split("+").join(" ");

	var params = {}, tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}

	return params;
}

Array.prototype.sortByKey = function(key)
{
	return this.sort(function(a, b)
	{
		var x = a["backlog"][key]; var y = b["backlog"][key];
		var x2 = a["backlog"]["id"]; var y2 = b["backlog"]["id"];
		
		return ((x < y) ? -1 : ((x > y) ? 1 : (x2 < y2) ? -1 : (x2 > y2) ? 1 : 0 ));
	});
};

Array.prototype.search = function(string)
{
	var results = [];

	this.forEach(function(d, i)
	{
		if( d.backlog.description.search(string) > -1 )
		{
			results.push( d );
		}
	});

	return results;
};
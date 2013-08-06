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
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
};
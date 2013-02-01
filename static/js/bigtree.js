function init(){
    var url = "http://bigtree.projfinder.com/api/bigtree?root=D0&depth=2"
    url = url + "&callback=?";
    $.getJSON(url, function(databack) {
	// First just 2 levels
	$('#tree').tree({
	    data: databack.data
	});
    });

    $('#tree').bind(
	'tree.open',
	function(e) {
            console.log(e.node);
	    var node = e.node;
	    var url = "http://bigtree.projfinder.com/api/bigtree?root="+e.node.path+"&depth=2"
	    url = url + "&callback=?";
	    //$.getJSON(url, function(databack) {
	    //	$('#tree').tree('loadData', databack.data);
	    //});
	    $.getJSON(url,(function(thisnode) {
		return function(databack) {
		    var ids = Array();
		    for (var i=0;i<thisnode.children.length;i++)
		    {
			ids.push(thisnode.children[i].id)
		    }
		    for (var i=0;i<ids.length;i++)
		    {
			$('#tree').tree('removeNode', $('#tree').tree('getNodeById', ids[i]));
		    }
		    $('#tree').tree('loadData', databack.data, thisnode);
		};
	    }(node))); // calling the function with the current value
	}
    );

    // Hook up to the button to query
    $("#myButton").click(function(){
	var url = "http://bigtree.projfinder.com/api/bigtree?root=D0&depth=2"
	url = url + "&callback=?";
	$.getJSON(url, function(databack) {
	    $('#tree').tree('loadData', databack.data);
	});
    })
}
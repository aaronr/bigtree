function bigtreeOpen(e) {
    //console.log(e.node);
    
    // Loop through all the children, and if they are directories
    // we should refresh them 3 deep
    var node = e.node;
    for (var i=0;i<node.children.length;i++)
    {
	var url = "http://bigtree.projfinder.com/api/bigtree?root="+e.node.children[i].path+"&depth=3"
	url = url + "&callback=?";
	//$.getJSON(url, function(databack) {
	//	$('#tree').tree('loadData', databack.data);
	//});
	$.getJSON(url,(function(thisnode) {
	    return function(databack) {
		var ids = Array();
		for (var ii=0;ii<thisnode.children.length;ii++)
		{
		    ids.push(thisnode.children[ii].id)
		}
		for (var iii=0;iii<ids.length;iii++)
		{
		    $('#tree').tree('removeNode', $('#tree').tree('getNodeById', ids[iii]));
		}
		$('#tree').tree('loadData', databack.data, thisnode);
		1+1;
	    };
	}(node.children[i]))); // calling the function with the current value
    }
}

function init(){
    var url = "http://bigtree.projfinder.com/api/bigtree?root=D0&depth=3"
    url = url + "&callback=?";
    $.getJSON(url, function(databack) {
	// First just 2 levels
	$('#tree').tree({
	    data: databack.data
	});
    });

    $('#tree').bind(
	'tree.open',
	bigtreeOpen
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
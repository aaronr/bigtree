function bigtreeOpen(e) {
    //console.log(e.node);
    
    // Loop through all the children, and if they are directories
    // we should refresh them 3 deep
    var node = e.node;

    // Once a node is opened once, mark it
    node.openedBefore = true;
    var isDir = node.path.match(/.*\.D\d+$/);
    if (isDir) {
	$(e.node.element).children('div').find('.jqtree-title').prev('i').remove()
	$(e.node.element).children('div').find('.jqtree-title').before('<i class="icon-folder-open">');
    }

    for (var i=0;i<node.children.length;i++)
    {
	// Only fetch new data for directories... not layers
	// Also weed out anything that has been opened before... no need to fetch again
	if (e.node.children[i].path.match(/.*\.D\d+$/) && !e.node.children[i].openedBefore) {
	    var url = "http://bigtree.projfinder.com/api/bigtree?root="+e.node.children[i].path+"&depth=2"
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
}

function bigtreeClose(e) {
    //console.log(e.node);
    var isDir = e.node.path.match(/.*\.D\d+$/);
    if (isDir) {
	$(e.node.element).children('div').find('.jqtree-title').prev('i').remove()
	$(e.node.element).children('div').find('.jqtree-title').before('<i class="icon-folder-close">');
    }
}

function init(){
    var url = "http://bigtree.projfinder.com/api/bigtree?root=D0&depth=2"
    url = url + "&callback=?";
    $.getJSON(url, function(databack) {
	// First just 2 levels
	$('#tree').tree({
	    data: databack.data,
	    onCreateLi: function(node, $li) {
		// Add 'icon' span before title
		var isDir = node.path.match(/.*\.D\d+$/);
		if (isDir) {
		    $li.find('.jqtree-title').before('<i class="icon-folder-close">');
		} else {
		    $li.find('.jqtree-title').before('<i class="icon-file">');
		}
	    }
	});
    });

    $('#tree').bind(
	'tree.open',
	bigtreeOpen
    );

    $('#tree').bind(
    	'tree.close',
    	bigtreeClose
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
function init(){
    // First an empty tree
    $('#tree').tree({
	data: []
    });

    // Hook up to the button to query
    $("#myButton").click(function(){
	var url = "http://bigtree.projfinder.com/api/bigtree?root="+$("#roottxt").val()+"&depth="+$("#depthtxt").val()
	url = url + "&callback=?";
	$.getJSON(url, function(databack) {
	    $('#tree').tree('loadData', databack.data);
	    // OLD
	    //for (i = 0; i < data.tree.length; i++) {
	    //	var indent = data.tree[i][0].match(/\./g).length;
	    //	$('#tree').append(Array(indent).join("-")+data.tree[i][0]+":"+data.tree[i][1]+"<br>");
	    //}
	});
    })
}
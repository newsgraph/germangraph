//Notes:
// Src: http://bl.ocks.org/mbostock/1093130
//Notes:
// * Each dom element is using 
//   children to store refs to expanded children
//   _children to store refs to collapsed children
//* It's using both a tree and a graph layout.

//root 
var g = {
    data: null,
    force:null
};

$(function () {

    //use a global var for the data:
    g.data = data;


    var width = 960,
        height = 500;

    //Create a sized SVG surface within viz:
    var svg = d3.select("#viz")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    g.link = svg.selectAll(".link"),
    g.node = svg.selectAll(".node");

    //Create a graph layout engine:
    g.force = d3.layout.force()
        .linkDistance(80)
        .charge(-120)
        .gravity(0.05)
        .size([width, height])
    //that invokes the tick method to draw the elements in their new location:
    .on("tick", tick);



    //Draw the graph:
    //Note that this method is invoked again
    //when clicking nodes:
    update();


});







//invoked once at the start, 
//and again when from 'click' method
//which expands and collapses a node.

function update() {

    //iterate through original nested data, and get one dimension array of nodes.
    var nodes = flatten(g.data);

    //Each node extracted above has a children attribute.
    //from them, we can use a tree() layout function in order
    //to build a links selection.
    var links = d3.layout.tree().links(nodes);

    // pass both of those sets to the graph layout engine, and restart it
    g.force.nodes(nodes)
        .links(links)
        .start();

    //-------------------
    // create a subselection, wiring up data, using a function to define 
    //how it's suppossed to know what is appended/updated/exited
    g.link = g.link.data(links, function (d) {return d.target.id;});

    //Get rid of old links:
    g.link.exit().remove();

    //Build new links by adding new svg lines:
    g.link
        .enter()
        .insert("line", ".node")
        .attr("class", "link");

    // create a subselection, wiring up data, using a function to define 
    //how it's suppossed to know what is appended/updated/exited
    g.node = g.node.data(nodes, function (d) {return d.id;});
    //Get rid of old nodes:  
    g.node.exit().remove();
    //-------------------
    //create new nodes by making groupd elements, that contain circls and text:
    var nodeEnter = g.node.enter()
        .append("g")
        .attr("class", "node")
        .on("click", click)
        .call(g.force.drag);
    //circle within the single node group:
    nodeEnter.append("circle")
        .attr("r", function (d) {return Math.sqrt(d.size) / 10 || 4.5;});
    //text within the single node group:
    nodeEnter.append("text")
        .attr("dy", ".35em")
        .text(function (d) {
        return d.name;
    });
    //All nodes, do the following:
    g.node.select("circle")
        .style("fill", color); //calls delegate
    //-------------------
}


// Invoked from 'update'.
// The original source data is not the usual nodes + edge list,
// but that's what's needed for the force layout engine. 
// So returns a list of all nodes under the root.
function flatten(data) {
    var nodes = [],
        i = 0;
    //count only children (not _children)
    //note that it doesn't count any descendents of collapsed _children 
    //rather elegant?
    function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
    }
    recurse(data);

    //Done:
    return nodes;
}



//Invoked from 'update'
//Return the color of the node
//based on the children value of the 
//source data item: {name=..., children: {...}}
function color(d) {
    return d._children ? "#319756" // collapsed package
    :
    d.children ? "#c64365" // expanded package
    :
        "#fd233c"; // leaf node
}






// Toggle children on click by switching around values on _children and children.
function click(d) {
    if (d3.event.defaultPrevented) return; // ignore drag
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    //
    update();
}





//event handler for every time the force layout engine
//says to redraw everthing:
function tick() {
    //redraw position of every link within the link set:
    g.link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
        return d.source.y;
    })
        .attr("x2", function (d) {
        return d.target.x;
    })
        .attr("y2", function (d) {
        return d.target.y;
    });
    //same for the nodes, using a functor:
    g.node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}




var data =

{ name: "haben",    

 children: [{ name: "anhaben"}, 
 {name: "dahaben"}, 
{ name: "vorhaben"},
{ name: "guthaben"},
{ name: "mithaben"},
{ name: "liebhaben"},
{ name: "innehaben"},
{ name: "gernhaben"},
{ name: "handhaben"},
{ name: "satthaben"},
{ name: "teilhaben"}, 
 { name: "dabeihaben"}]
};

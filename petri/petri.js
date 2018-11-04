// Generated by CoffeeScript 2.3.0
var $d3, $jq, AND, active, adversaire, all, box_color, circs, click_color, color, dead_color, force, height, holds, incoming, joueur, json, links, live_color, node, outgoing, radius, rects, svg, tasks, texts, width;

$d3 = d3;

$jq = $; // jquery

joueur = "A";

adversaire = {
  "A": "B",
  "B": "A"
};

width = $jq("#rhs").width();

height = $jq("#rhs").height();

color = d3.scale.category20();

json = {
  nodes: [
    {
      // holds are group 0
      id: 0,
      name: '>',
      group: 0,
      count: 4
    },
    {
      id: 1,
      name: 'b',
      group: 0,
      count: 0
    },
    {
      id: 2,
      name: 'c',
      group: 0,
      count: 0
    },
    {
      id: 3,
      name: 'i',
      group: 0,
      count: 0
    },
    {
      id: 4,
      name: 'j',
      group: 0,
      count: 0
    },
    {
      id: 5,
      name: '^',
      group: 0,
      count: 0
    },
    {
      // tasks are group 1
      id: 6,
      name: 'x',
      group: 1
    },
    {
      id: 7,
      name: 'y',
      group: 1
    },
    {
      id: 8,
      name: 'z',
      group: 1
    },
    {
      id: 9,
      name: '!',
      group: 1
    }
  ],
  edges: [
    {
      source: 0,
      target: 9
    },
    {
      source: 9,
      target: 1
    },
    {
      source: 1,
      target: 6
    },
    {
      source: 6,
      target: 2
    },
    {
      source: 6,
      target: 3
    },
    {
      source: 2,
      target: 8
    },
    {
      source: 3,
      target: 7
    },
    {
      source: 7,
      target: 4
    },
    {
      source: 4,
      target: 8
    },
    {
      source: 8,
      target: 5
    }
  ]
};

force = d3.layout.force().charge(-250).linkDistance(45).size([width, height]);

// start this, because it destructively turns those references into live objects!
force.nodes(json.nodes).links(json.edges).start();

AND = function(a, b) {
  return a && b;
};

all = function(xs) {
  return xs.length && xs.reduce(AND, true);
};

incoming = function(n) {
  var e, k, len, ref, results;
  ref = json.edges;
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    e = ref[k];
    if (e.target === n) {
      results.push(e);
    }
  }
  return results;
};

outgoing = function(n) {
  var e, k, len, ref, results;
  ref = json.edges;
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    e = ref[k];
    if (e.source === n) {
      results.push(e);
    }
  }
  return results;
};

active = function(n) {
  var e;
  return all((function() {
    var k, len, ref, results;
    ref = incoming(n);
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      results.push(e.source.count > 0);
    }
    return results;
  })());
};

holds = function() {
  var k, len, n, ref, results;
  ref = json.nodes;
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    n = ref[k];
    if (n.group === 0) {
      results.push(n);
    }
  }
  return results;
};

tasks = function() {
  var k, len, n, ref, results;
  ref = json.nodes;
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    n = ref[k];
    if (n.group === 1) {
      results.push(n);
    }
  }
  return results;
};

radius = 15;

svg = d3.select("svg");

links = svg.selectAll("line.link").data(json.edges).enter().append("line").attr("class", "link").style("stroke", "#000").style("stroke-width", 2);

circs = svg.selectAll("circle.node").data(holds).enter().append("circle").attr("class", "node").attr("r", radius).style("fill", function(d) {
  if (d.name === '>') {
    return 'lime';
  } else if (d.name === '^') {
    return 'red';
  } else {
    return 'white';
  }
}).style("stroke", '#000').style("stroke-width", '2').call(force.drag);

dead_color = '#333';

live_color = '#666';

click_color = '#999';

box_color = function(d, i) {
  if (active(d)) {
    return live_color;
  } else {
    return dead_color;
  }
};

texts = svg.selectAll("text").data(holds).enter().append("text").call(force.drag).text(function(d) {
  if (d.count === 0) {
    return '';
  } else {
    return d.count;
  }
});

rects = svg.selectAll("rect.node").data(tasks).enter().append("rect").attr("class", "node").attr("width", radius * 2).attr("height", radius * 2).style("stroke", '#000').style("stroke-width", '2').style("fill", box_color).call(force.drag).on('click', function(g, j) {
  if (active(g)) {
    return (() => {
      var e, k, l, len, len1, ref, ref1;
      ref = incoming(g);
      for (k = 0, len = ref.length; k < len; k++) {
        e = ref[k];
        e.source.count -= 1;
      }
      ref1 = outgoing(g);
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        e = ref1[l];
        e.target.count += 1;
      }
      $d3.select(this).style('fill', click_color);
      rects.transition().style('fill', box_color);
      texts.transition().text(function(d) {
        if (d.count === 0) {
          return '';
        } else {
          return d.count;
        }
      });
      joueur = adversaire[joueur];
      return $(".kikijoue").text(joueur);
    })();
  }
});

node = svg.selectAll(".node");

node.append("title").text(function(d) {
  return d.name;
});

force.on("tick", function() {
  texts.attr("x", function(d) {
    return d.x - 5;
  }).attr("y", function(d) {
    return d.y + 5;
  });
  links.attr("x1", function(d) {
    return d.source.x;
  }).attr("y1", function(d) {
    return d.source.y;
  }).attr("x2", function(d) {
    return d.target.x;
  }).attr("y2", function(d) {
    return d.target.y;
  });
  circs.attr("cx", function(d) {
    return d.x;
  }).attr("cy", function(d) {
    return d.y;
  });
  return rects.attr("x", function(d) {
    return d.x - radius;
  }).attr("y", function(d) {
    return d.y - radius;
  });
});

var graph_image = null;
var parsed_data = null;
var graph_options = {
  layout: {
    hierarchical: {
      enabled: true,
      sortMethod: 'directed',
      levelSeparation: 200
    }
  },
  edges:{
    physics: false
  },
  physics:{
    enabled: true,
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.21,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 1,
    solver: 'hierarchicalRepulsion',
    timestep: 0.5,
    stabilization: {
      enabled: true,
      iterations: 100,
      onlyDynamicEdges: false,
      fit: true
    }
  },
  interaction: {
    dragNodes: false,
    hideEdgesOnDrag: true
  }
};

function AlgorithmInfoCtrl($scope) {
  $scope.last_event = {name: "hola", description: "chau"};
  $scope.events = [];
  $scope.stats = [];

  //event stream client
  var source = new EventSource('/event_stream');
  source.onmessage = function(event) {
    $scope.$apply(function() {
      data = JSON.parse(event.data);
      $scope.last_event = data.event;
      $scope.stats = data.stats;
      $scope.events.push($scope.last_event);

      // Get the graph in dot format
      parsed_data = vis.network.convertDot(data.graph_dot_string);
      // generate it from the dot string
      var graph = new vis.Network(graph_image, parsed_data, graph_options);
      graph.fit();  // Center the graph to fit inside the container
    });
  };
}

function showTab(tab_name) {
      $('.tab').hide();
      $('#' + tab_name).show();
}

function controlAlgorithm(order) {
  if ($('#help').is(':visible')) {
    showTab('graph');
  }
  $.ajax({url: '/control/' + order});
}

$(document).ready(function() {
  graph_image = document.getElementById('graph_image');

  $(window).keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      controlAlgorithm('step');
    }
    else if (event.which == 113 || event.which == 81) {
      event.preventDefault();
      controlAlgorithm('stop');
    }
    else if (event.which == 101 || event.which == 69) {
      event.preventDefault();
      controlAlgorithm('play');
    }
    else if (event.which == 112 || event.which == 80) {
      event.preventDefault();
      controlAlgorithm('pause');
    }
  });

  showTab('help');
});


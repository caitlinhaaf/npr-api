var app = angular.module('myApp', []);

// MDIzODc0NDUxMDE0NjA5NDc4NzYzY2U5ZQ000
// ztWjHgv1SlImUnquVnT3MSZgBOFUErO8Fd2qOoXs

var apiKey = 'MDIzODc0NDUxMDE0NjA5NDc4NzYzY2U5ZQ000',
    //queries most recent shows - runs when app play contorller loads
    // recentNprUrl = 'http://api.npr.org/query?id=61&fields=all&output=JSON';
    recentNprUrl = 'http://api.npr.org/query?id=61&fields=title,teaser,audio,image,show,storyDate,none&output=JSON';
    searchNprUrl =
    'http://api.npr.org/list?id=3004&output=JSON'
    // nprUrl = 'http://api.npr.org/query?id=448706447'

//PLAY LIST/CONTROLLER
app.controller('PlayerController', function($scope, $http) {
  //add audio player (not controls)

  var audio = document.createElement('audio');
  // $scope.audio = audio;
  // audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
  // audio.play();
  $scope.class = "buttonOff";
  $scope.selectedIndex = -1;

  $scope.play = function(program, index) {
    console.log(index);
    $scope.selectedIndex = index;

    //change button class
    if ($scope.class === "buttonOff")
        $scope.class = "buttonOn";
    else $scope.class = "buttonOff";

    if ($scope.playing){
      audio.pause();
      // return;
    }
    var url = program.audio[0].format.mp4.$text;
    // testing...
    // var url = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
    if(program.audio[0].format != 'undefined'){
      audio.src = url;
      audio.play();
      $scope.playing = true;//store playing state...

    }else{
      console.log("not available");
    }
  }

  // http ajax request to the api
  $http({
    method: 'JSONP',
    url: recentNprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
    // url: nprUrl + '&callback=JSON_CALLBACK'

  }).success(function(data, status) {
  $scope.programs = data.list.story;
  console.log(data.list.story);
  }).error(function(data, status) {
    // Some error occurred
    console.log("oops...");
  });

//end of player controller
});




app.controller('Search', function($scope, $http){

    $scope.search = function(){
      console.log("searching...");
      //http request for search bar...
      // http ajax request to the api
      $http({
        method: 'JSONP',
        url: searchNprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        // url: nprUrl + '&callback=JSON_CALLBACK'

      }).success(function(data, status) {
      $scope.searchResults = data.item;
      console.log(data);
      }).error(function(data, status) {
        // Some error occurred
        console.log("oops...");
      });
    }



//end of search controller
});

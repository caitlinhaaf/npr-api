var app = angular.module('myApp', []);

// get/generate current date object
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;

var todaysDate = yyyy+"-"+mm+"-"+"dd";
// console.log(dd,mm,yyyy);

// api calls and key
var apiKey = 'MDIzODc0NDUxMDE0NjA5NDc4NzYzY2U5ZQ000',
    //queries most 10 recent shows - runs when app play contorller loads
    recentNprUrl =
    'http://api.npr.org/query?requiredAssets=audio&startDate='+todaysDate+'&dateType=story&fields=title,teaser,audio,image,show,storyDate&sort=dat&numResults=5&output=JSON'


    // searchNprUrl = 'http://api.npr.org/query?dateType=story&id=1008&fields=title,teaser,storyDate&output=JSON';

    searchNprUrl1 =
    'http://api.npr.org/query?dateType=story'
    searchNprUrl2 =
    '&childrenOf=1019&fields=title,teaser,audio,image,show,storyDate&output=JSON';

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

    //change button class
    if ($scope.class == "buttonOff" && index!=$scope.selectedIndex) $scope.class = "buttonOn";
    else if (index == $scope.selectedIndex) $scope.class = "buttonOff";

    //pause/play/switch audio source function
    if ($scope.playing && index == $scope.selectedIndex){
      audio.pause();
      $scope.playing = false;
      $scope.class = "buttonOff";
      // console.log($scope.playing);
    }else if(!$scope.playing && index == $scope.selectedIndex){
      audio.play();
      $scope.playing = true;
    }else{
      var url = program.audio[0].format.mp4.$text;
      audio.src = url;
      audio.play();
      $scope.playing = true;//store playing state...
      // console.log($scope.playing);
    }
    //reset selectedIndex
    $scope.selectedIndex = index;
  }

  // http ajax request to the api
  $http({
    method: 'JSONP',
    url: recentNprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
  }).success(function(data, status) {
  $scope.programs = data.list.story; //path to story info

  // TODO grab image if available
  //if not available, use a placeholder
  console.log(data.list.story.image);
  // console.log(data.list.story);
  }).error(function(data, status) {
    // Some error occurred
    console.log("oops...");
  });
//end of player controller
});


// SEARCH BY TOPIC CONTROLLER
//------------------------------
app.controller('Search', function($scope, $http){
    //evaluate value of the check box(es)
    //concatenate together and add to api call

    //topics array
    $scope.topics = [
      {name: 'Arts & Life', selected: false, query:"&id=1008" },
      {name: 'Economy', selected: false, query:"&id=1017"},
      {name: 'Health', selected: false, query:"&id=1028"},
      {name: 'Science', selected: false, query:"&id=1007"},
      {name: 'Technology', selected: false, query:"&id=1019"}
    ]

    // selected topics
    $scope.selection = [];

    // helper method to get selected topics
     $scope.selectedTopics = function selectedTopics() {
       return filterFilter($scope.topics, { selected: true });
     };

     // watch topics for changes
    $scope.$watch('topics|filter:{selected:true}', function (nv) {
      $scope.selection = nv.map(function (topic) {
        return topic.query;
      });
    }, true);

    // SEARCH BY TOPIC FUNCTION
    //------------------------------
    $scope.search = function(){
      // console.log($scope.selection);
      var searchTopics = $scope.selection.join("");
      console.log(searchTopics);

      $http({
        method: 'JSONP',
        // url: searchNprUrl1 + children + searchNprUrl2 + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        url: searchNprUrl1 + searchTopics + searchNprUrl2 + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'

      }).success(function(data, status) {
      $scope.searchResults = data.list.story;//path to story info
      console.log(data.list.story);
      }).error(function(data, status) {
        // Some error occurred
        console.log("oops...");
      });
    }


//end of search controller
});

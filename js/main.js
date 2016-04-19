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
    'http://api.npr.org/query?requiredAssets=audio&startDate='+todaysDate+'&dateType=story&fields=title,teaser,audio,image,show,storyDate&sort=dat&output=JSON'

    //
    searchNprUrl1 =
    'http://api.npr.org/query?dateType=story'
    searchNprUrl2 =
    '&fields=title,teaser,audio,image,show,storyDate&output=JSON';


    //pulls arts & life...
    // searchNprUrl =
    // 'http://api.npr.org/query?dateType=story&childrenOf=1008&fields=title,teaser,audio,image,show,storyDate&output=JSON';
    //pulls all topics...
    // 'http://api.npr.org/list?id=3002&numResults=2&output=JSON';


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
    if ($scope.class == "buttonOff") $scope.class = "buttonOn";
    else {$scope.class = ""}

    if ($scope.playing){
      audio.pause();
      $scope.playing = false;
      // return;
    }else{
      var url = program.audio[0].format.mp4.$text;
      // testing...
      // var url = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
      audio.src = url;
      audio.play();
      $scope.playing = true;//store playing state...
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
    //evaluate value of the check box(es)
    //concatenate together and add to api call
    //
    $scope.checkboxModel = {
       value1 : false,
       value2 : false,
       value3 : false,
       value4 : false,
       value5 : false
     };

     //topic codes:
    //  arts&life = &childrenOf=1008
    //  economy = 1017
    //  health = 1128
    //science = 1007
    //technology = 1019


    $scope.search = function(){
      // console.log("searching...");
      console.log($scope.checkboxModel);

      var children = '&childrenOf=1008';
      //http request for search bar...
      // http ajax request to the api
      $http({
        method: 'JSONP',
        url: searchNprUrl1 + children + searchNprUrl2 + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        // url: nprUrl + '&callback=JSON_CALLBACK'

      }).success(function(data, status) {
      $scope.searchResults = data.list.story;
      console.log(data.list.story);

      }).error(function(data, status) {
        // Some error occurred
        console.log("oops...");
      });
    }



//end of search controller
});

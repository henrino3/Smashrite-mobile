/* global angular, document, window */
'use strict';

var c = angular.module('smashrite.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopover, $timeout, $openFB, $localstorage, $window, $http,$kinvey){
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;


    //FACEBOOK LOGIN INTEGRATION
    $scope.fbLogin = function () {
      $openFB.login({scope: 'email,user_friends'})
        .then(function( token ) {
              console.log(token);
              // log in successful
              // send token to your server
              window.localStorage['facebookConnected'] = true;
              //set local app data
              $rootScope.facebookConnected = $localstorage.get('facebookConnected');

                    var me = {};
                    $openFB.api({
                            path: '/me',
                            params: {fields:
                              'id,name,email,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified'
                            }
                          })
                        .then(function(res) {
                          angular.extend(me, res);
                        }, function( err ) {
                          console.log("Failed");
                          });

                            $openFB.api({
                              path: '/me/picture', params: { redirect: false,height: 100,width: 100}
                                  }).then(function( res ) {
                                      angular.extend(me, {picture: res.data.url});
                                            console.log(me);
                                              if(!$rootScope.user) $rootScope.user = {};

                                            angular.extend($rootScope.user,me);
                                             $rootScope.user.access_token = token;
                                            $localstorage.setObject('user',$rootScope.user)
                                            // checkUser in db
                                            //$scope.check(me.id)
                                            // if (exists == true) {
                                            //       $state.go('app.profile');
                                            // }else {
                                            //   $state.go('app.login');
                                            // }
                                            console.log($rootScope.user);
                                            console.log($localstorage.getObject('user'));
                                                      });
                                        // //save access token
                                        // $rootScope.user.access_token = token;
                                        // $localstorage.setObject('user', $rootScope.user);

                                        $state.go('app.profile');
                                  }, function( err ) {
                                      console.log('Logging Failed');
                                  });
                              };

    $scope.checkUserInDb = function (userId) {
          //run db search
           var usernameExists = $kinvey.User.checkUsernameExists('username');
          //pass userId
          // if (userId) {
          //   return exists = true;
          // } else {
          //   return exists = false;
          // }
    };


    $scope.checkLogin = function() {
      $openFB.isLoggedIn()
      .then(function( loginStatus ) {
        // logged in
          console.log("Logged In!");
      } , function( err ) {
        // not logged in
      });
    };
    // $scope.checkLogin();

      //FACEBOOK LOGIN INTEGRATION

    $scope.pullFbData = function () {
               var me = {};
      $openFB.api({
              path: '/me',
              params: {fields:
                'id,name,email,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified'
              }
            })
          .then(function(res) {
            angular.extend(me, res);
          }, function( err ) {
            console.log("Failed");
            });

      $openFB.api({
        path: '/me/picture',
        params: {
            redirect: false,
            height: 100,
            width: 100
        }
    }).then(function( res ) {
        angular.extend(me, {picture: res.data.url});
              console.log(me);
              angular.extend($rootScope.user,me);
              $localstorage.setObject('user',$rootScope.user)
              console.log($rootScope.user);
              console.log($localstorage.getObject('user'));

              //CREATE USER ACCOUNT IN KINVEY
              $scope.createUser($rootScope.user);

              var user = new $kinvey.User({
                    username: $rootScope.user.email,
                    password: $rootScope.user.id,
                });
                if(user.$login()) console.log("Kinvey Login Successful");


    });




    };

    //CREATE KINVEY USER METHOD

            $scope.createUser = function() {
                console.log($rootScope.user);
                    var user = new $kinvey.User({
                      username: $rootScope.user.email,
                      password: $rootScope.user.id,
                      id:  $rootScope.user.id,
                      name: $rootScope.user.name,
                      first_name: $rootScope.user.first_name,
                      last_name: $rootScope.user.last_name,
                      gender: $rootScope.user.gender,
                      link: $rootScope.user.link,
                      picture: $rootScope.user.picture,
                      verified: $rootScope.user.verified,
                      timezone: $rootScope.user.timezone,
                      updated_time: $rootScope.user.updated_time,
                      email: $rootScope.user.email,
                      age_range: $rootScope.user.age_range,
                      access_token: $rootScope.user.access_token,
                      phone: $rootScope.user.phone,
                      status: $rootScope.user.status,
                      device_details: $rootScope.user.device_details,
                      appData: $rootScope.user.appData
                });
                user.$signup();

                return console.log("User Account Created in Kinvey");
            };



    $scope.color = [
      '#1ABC9C','#34495E','#C0392B',
      '#E67E22','#27AE60', '#8E44AD'
    ];

    //INJECT GET COURSES SERVICE
    $scope.courses = [
        	{ "name": "ACCOUNTING", "type": "UTME", "icon": "A", "code":"ACC", "color": "#1ABC9C" },
	        { "name": "BIOLOGY", "type": "UTME", "icon": "B", "code": "BIO", "color": "#34495E" },
	        { "name": "CHEMISTRY", "type": "UTME", "icon": "C", "code": "CHEM", "color": "#C0392B" },
	        { "name": "COMMERCE", "type": "UTME", "icon": "C", "code": "COMM", "color": "#E67E22" },
	        { "name": "AGRICULTURE", "type": "UTME", "icon": "A", "code": "BIO", "color": "#27AE60" },
	        { "name": "ECONOMICS", "type": "UTME", "icon": "E", "code": "ECO", "color": "#8E44AD" },
	        //{ "name": "ENGLISH LANGUAGE", "type": "UTME", "icon": "E", "code": "ENG", "color": "#1ABC9C" },
	        { "name": "GEOGRAPHY", "type": "UTME", "icon": "G", "code": "GEO", "color": "#34495E" },
	        { "name": "GOVERNMENT", "type": "UTME", "icon": "G", "code": "GOV", "color": "#C0392B" },
	        { "name": "LITERATURE IN ENGLISH", "type": "UTME", "icon": "L", "code": "LITE", "color": "#E67E22" },
	        { "name": "MATHEMATICS", "type": "UTME", "icon": "M", "code": "MAT", "color": "#27AE60" },
	        { "name": "PHYSICS", "type": "UTME", "icon": "P", "code": "PHY", "color": "#8E44AD" },
	        { "name": "CHRISTIAN RELIGIOUS STUDIES", "type": "UTME", "icon": "C", "code": "CRS", "color": "#1ABC9C" }
    ];

    // $scope.userCourses = [];
    // $localstorage.set(userCourses,$scope.userCourses);
    
    $scope.getCourse = function (courseName, courseCode) {
        console.log(courseName, courseCode);
        $scope.currentCourse = courseName;
        $localstorage.set('currentCourse', courseName);
        $localstorage.set('currentCourseMode', courseCode);
        
        // $scope.userCourses.push(courseName);

        $state.go('app.mode');
        // console.log($scope.currentCourse);
        // console.log($scope.userCourses); 
    };

        //   $scope.userCourses.forEach(function (v) {
        //   console.log("new course is : "+ v);
        // });


        // for (var i = 0; i < $scope.userCourses.length; i++){
        //     console.log("new course is : "+ i);
        // }

    

    //INJECT GET MODES SERVICE
   /* $scope.modes = [];
    $http.get('http://api.smashrite.com/api/testmodes').success(function(response) {
        $scope.modes = response.data;
    })*/
    $scope.modes = [{
        name: "Speed Mode",
        no: 5,
        img: 'img/quick-mode.png'
       },
            //{
            //    name: "Mock Mode",
            //    no: 50,
            //    img: 'img/mode1.png'
            //},
        {
            name: "Study Mode",
            no: 50,
            img: 'img/study-mode.png'
        }
    ];
    
    $scope.leaderboardData = [
  {
      "Name": "Nathaniel",
      "Image_url": "Barot_Bellingham",
      "Points": 80,
  },
  {
      "Name": "Deirdre",
      "Image_url": "Jonathan_Ferrar",
      "Points": 90,
  },
  {
      "Name": "Coby",
      "Image_url": "Hillary_Goldwynn",
      "Points": 81,
  },
  {
      "Name": "Ariel",
      "Image_url": "Hassum_Harrod",
      "Points": 15,
  },
  {
      "Name": "Walker",
      "Image_url": "Xhou_Ta",
      "Points": 54,
  },
  {
      "Name": "Bruno",
      "Image_url": "LaVonne_LaRue",
      "Points": 47,
  },
  {
      "Name": "Olympia",
      "Image_url": "Riley_Rewington",
      "Points": 71,
  },
  {
      "Name": "Zane",
      "Image_url": "Jennifer_Jerome",
      "Points": 72,
  },
  {
      "Name": "Kai",
      "Image_url": "Constance_Smith",
      "Points": 45,
  },
  {
      "Name": "Jaime",
      "Image_url": "Riley_Rewington",
      "Points": 54,
  }
    ];

//user courses Object
  //course analytics
    // stage
    // mode
    // how many


$scope.about = function() {
    window.open('http://smashrite.com/app-about');
};

$scope.getMode =  function(v) {
    console.log(v);
    $scope.currentMode = v;
    $localstorage.set('currentMode',v);
    $state.go('app.practice');
};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.removeSideIcon = function() {
        var icon = document.getElementsByClassName('buttons-right');
        if (icon.length && icon.length > 1) {
            icon[0].remove();
        };
    };

})




.controller('LoginCtrl', function($scope, $state, $localstorage,$rootScope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    $scope.login = function() {
      //Check if phone number exists
      // if($rootScope.user.phone =="")
    

      $state.go('app.courses');
    };

    $scope.$on("$destroy", function() {
      $localstorage.setObject('user',$rootScope.user);
      console.log($rootScope.user);
      // console.log($localstorage.getObject('user',$rootScope.user));
   });
})



.controller('CourseCtrl', function($scope,$state, $localstorage, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,$kinvey) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();


})




.controller('PracticeCtrl', function($scope, $localstorage, $rootScope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, ngProgressFactory) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    //Side ?

    $scope.practice = {
      course: 'Physics',
      goal: 10,
      sections: 5

    };

    $scope.sections = [
      {
        name: 'Section 1',
        questions : function () {
          return "Questions 1 Array";
        }
      },
      {
        name: 'Section 2',
        questions : function () {
          return "Questions 2 Array";
        }
      },
      {
        name: 'Section 3',
        questions : function () {
          return "Questions 3 Array";
        }
      }
    ];

    $scope.sectionsCount = $scope.sections.length;

    console.log($scope.sectionsCount);

    $scope.title = $scope.practice.course + ' Practice';
})


.controller('FriendsCtrl', function($scope, $localstorage, $rootScope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('ResultCtrl', function($scope, $localstorage, $state, $rootScope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $openFB) {
  // Set Header
  $scope.$parent.hideHeader();

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.fbShare = function() {
            var msg = "I just passed a test on smashrite";
            $openFB.ui({method: 'feed',
            name: 'MCQ Nation ',
            link: 'http://www.smashrite.com/' ,
            picture: 'http://www.mcqnation.com/Trail3/fbapp2.png',
            caption:'CLICK ON THE IMAGE TO GO TO OUR WEBSITE',
            description: msg ,
            message: 'AAA'});
            return false;
    };



})

.controller('ProfileCtrl', function($scope, $localstorage,$rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $openFB, $ionicLoading) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');
     $ionicLoading.show({
        template: '<img style="width: 40%" src="img/loading.gif">'
      });

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    if(!$rootScope.facebookConnected) {
          $scope.fbLogin();
    } else{
      if($rootScope.user.email == ''){
          $scope.pullFbData();
      };
      
    }
     $ionicLoading.hide();

     $scope.totalExams = $localstorage.get('noOfPracticeTaken') ;

     // $scope.allCourses = 

    console.log( $scope.userCourses);


  
})

.controller('ActivityCtrl', function($scope,$rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('LeaderboardCtrl', function ($scope, $http) {
    //$http.get('data/leaderboardData.json').success(function (data) {}
    
})
/*$scope.getQuiz = function (course, mode) {
    console.log(course, mode);
    $http.get("http://api.smashrite.com/api/getTest/"+{course}+"/"+{mode}).then(function(response){
        $scope.quizData = response.data;
    });
}*/

// Ionic smashrite App

var app = angular.module('smashrite', ['ionic.service.analytics',
  'ionic','ionic.service.core', 'kinvey', 'smashrite.controllers', 'smashrite.services', 'ionic-material', 'ionMdInput','ngProgress','ngOpenFB','ngCordova','ngResource','ngStorage'])

.run(function($ionicPlatform, $ionicAnalytics,$openFB, $rootScope, $state, $localstorage,$cordovaSplashscreen, $kinvey,  $ionicLoading) {
    $ionicPlatform.ready(function() {
        //IONIC ANALYTICS
     //$ionicAnalytics.register();


        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        console.log('window.cordova.plugins is available');
                } else {
             console.log('window.cordova.plugins NOT available');
         }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        //HIDE SPLASH SCREEN
        setTimeout(function() {
            $cordovaSplashscreen.hide()
          }, 5000);

        //FACEBOOK API
        $openFB.init( {
          appId: '1008971622507959',
          version    : 'v2.5',
          cookie     : true,
          xfbml      : true
        } );

        //INIT INAPPBROWSER 
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            window.open = cordova.InAppBrowser.open;
        };



      var deploy = new Ionic.Deploy();

        // Update app code with new release from Ionic Deploy
        $rootScope.doUpdate = function() {
            $ionicLoading.show({
                template: 'Updating...Please Wait<br><img style="width: 40%" src="img/loading.gif">'
              });
            deploy.update().then(function(res) {
            console.log('Ionic Deploy: Update Success! ', res);
            if(res){
                $ionicLoading.hide();
                alert("Update Successful!");
            }else{
                  alert("Update unsuccessful,try again later!");
            }

            }, function(err) {
                  alert('Update Failed .. Try Again Later!');
                  $ionicLoading.hide();
            console.log('Ionic <De></De>ploy: Update error! ', err);
            }, function(prog) {
            console.log('Ionic Deploy: Progress... ', prog);
            });
        };

        // Check Ionic Deploy for new code
        $rootScope.checkForUpdates = function() {
             $ionicLoading.show({
                template: 'Checking for Updates......Please Wait<br><img style="width: 40%" src="img/loading.gif">'
              });
            console.log('Ionic Deploy: Checking for updates');
            deploy.check().then(function(hasUpdate) {
            console.log('Ionic Deploy: Update available');
            $ionicLoading.hide();
           
            if(hasUpdate){
                 $rootScope.hasUpdate = hasUpdate;
                 alert('Update available');
            }else{
                 alert('No Update available');
            }
            
            }, function(err) {
                 $ionicLoading.hide();
            alert('Update Check Failed available');
            console.error('Ionic Deploy: Unable to check for updates', err);
            });
        }

      console.log('App Start');



      //Get Device Information
     // console.log(device);
     //var device_details =JSON.stringify(device);
     // console.log(device_details);
    if(!device) var device = {};

      if(!$localstorage.get('isUserObjectSet')){
        var User = {
          name: "",
          email: "",
          access_token: "",
          phone: "",
          status: "Beginner",
          device_details: device,
          appData: {}

        };


        $localstorage.setObject('user', User);
        $rootScope.user = User;
        $localstorage.set('isUserObjectSet', true);
        console.log("Create User Object Placeholder");
      };


      



      if(!$localstorage.get('appRun')){
            $localstorage.set('appRun', 1);
            $localstorage.set('facebookConnected', false);
            $localstorage.set('noOfPracticeTaken', 0);

            $rootScope.facebookConnected = $localstorage.get('facebookConnected');
      }else{
            window.localStorage['appRun']++;
          // console.log('App Run Times: ' +$localstorage.get('appRun'));
      };



        if ($localstorage.get('facebookConnected') === true){
              // $state.go('app.profile');
              console.log($localstorage.get('facebookConnected'));
              console.log('fb connected');
        };


        if ($localstorage.get('appRun') == 1) {

              $state.go('app.intro');
              console.log('First Start');

        } else {
              // console.log('App Run: '+$localstorage.get('appRun'));
              //$rootScope.checkForUpdates()
              $state.go('app.courses');
        };


    });


    //KINVEY HANDSHAKE
    var result = $kinvey.handshake();
        result.$promise
            .then(function() {
                console.log('Kinvey version is: '+result.version);
            }, function(err) {
                console.log('received error: '+JSON.stringify(err));
            });
})


.config(function($kinveyProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaInAppBrowserProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);


    //KINVERY 
      $kinveyProvider.init({
        appKey: 'kid_ZkcgE0x9Al',
        appSecret: 'b6f899b52a6344bab2d9ef8e3dd016ae',
        storage: 'local'
    });


    // var inAppBrowserOptions = {
    // location: 'no',
    // clearcache: 'no',
    // toolbar: 'yes'
    // };

    // document.addEventListener(function () {
    //     $cordovaInAppBrowserProvider.setDefaultOptions();
    // }, false);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })



    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })


    .state('app.intro', {
        url: '/intro',
        views: {
            'menuContent': {
                templateUrl: 'templates/intro.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })


    .state('app.courses', {
        url: '/courses',
        views: {
            'menuContent': {
                templateUrl: 'templates/courses.html',
                controller: 'CourseCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.mode', {
        url: '/mode',
        views: {
            'menuContent': {
                templateUrl: 'templates/mode.html',
                controller: 'CourseCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.practice', {
        url: '/practice',
        views: {
            'menuContent': {
                templateUrl: 'templates/practice-home.html',
                controller: 'PracticeCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.quiz', {
        url: '/quiz',
        views: {
            'menuContent': {
                templateUrl: 'templates/quiz.html',
                controller: 'QuizCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.study', {
        url: '/study',
        views: {
            'menuContent': {
                templateUrl: 'templates/study.html',
                controller: 'StudyCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.review', {
        url: '/review',
        views: {
            'menuContent': {
                templateUrl: 'templates/review.html',
                controller: 'StudyCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

        /*
        .state('app.study', {
        url: '/study',
        views: {
            'menuContent': {
                templateUrl: 'templates/question2.html',
                controller: 'StudyCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
        */

    .state('app.result', {
        url: '/result',
        views: {
            'menuContent': {
                templateUrl: 'templates/result.html',
                controller: 'StudyCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.save', {
        url: '/save',
        views: {
            'menuContent': {
                templateUrl: 'templates/save.html',
                controller: 'ResultCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

    .state('app.leaderboard', {
        url: '/leaderboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/leaderboard.html',
                controller: 'LeaderboardCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/intro');
})

// .constant('ApiEndpoint', {
//   url: 'http://localhost:8100/api'
// })

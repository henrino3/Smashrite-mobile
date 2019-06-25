
c.controller('QuizCtrl',['$scope', '$http', 'helperService','$localstorage', '$stateParams','$rootScope', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'ngProgressFactory', '$ionicModal', '$ionicPopup','$window','$state','$ionicLoading', function($scope,$http, helper,$localstorage, $stateParams,$rootScope, $timeout, ionicMaterialInk, ionicMaterialMotion, ngProgressFactory, $ionicModal, $ionicPopup, window,$state,$ionicLoading) {
    // Set Header
    // $scope.$parent.hideHeader();
    console.log("Quiz Controller");
     $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    $ionicLoading.show({
        template: '<img style="width: 40%" src="img/loading.gif">'
      });

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    //Side ?

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });



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



    //INJECT QUESTIONS SERVICE
    $scope.questions = [
      {
        question: "What is the name of the first President of Nigeria?",
        optionA: "Nnamdi Azikiwe",
        optionB: "Obansajo Muhamed",
        optionC: "Goodluck Django",
        optionD: "Herbert Maculy",
        answer: "Nnamdi Azikwe"
      }
    ];

    $scope.progressbar = ngProgressFactory.createInstance();
    //$scope.progressbar.setParent(document.getElementById('progress'));
    $scope.progressbar.setHeight('5px');
    $scope.progressbar.setColor('#FD6A5B');
    $scope.progressbar.start();
    $scope.progressbar.set(20);




     $scope.openPop = function () {
       $ionicPopup.show({
         template: '<input type="password" ng-model="data.wifi">',
         title: 'Enter Wi-Fi Password',
         subTitle: 'Please use normal things',
         scope: $scope,
          });


      $timeout(function() {
         $ionicPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
     };


    $scope.$on("$destroy", function() {
        $scope.progressbar.reset();
        var parent = document.getElementById('range');
        var child = document.getElementById('ngProgress');
        child.style.display="none";
    });



    // Triggered on a button click, or some other target
      $scope.popupAnimations = ['bounceInUp'];
      // A confirm dialog
      $scope.showConfirm = function(animation) {
        $timeout(function(){
         var popupElements = document.getElementsByClassName("popup-container")
         if (popupElements.length) {
           $scope.popupElement = angular.element(popupElements[0]);
             $scope.popupElement.addClass('animated')
             $scope.popupElement.addClass(animation)
         };
       }, 1)


        var confirmPopup = $ionicPopup.confirm({
          title: 'Consume Ice Cream',
          template: 'Are you sure you want to eat this ice cream?',
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
          } else {
            console.log('You are not sure');
          }
        });
      };









    $scope.defaultConfig = {
        'allowBack': true,
        'allowReview': true,
        'autoMove': false,  // if true, it will move to next question automatically when answered.
        'duration': 0,  // indicates the time in which quiz needs to be completed. post that, quiz will be automatically submitted. 0 means unlimited.
        'pageSize': 1,
        'requiredAll': false,  // indicates if you must answer all the questions before submitting.
        'richText': false,
        'shuffleQuestions': true,
        'shuffleOptions': true,
        'showClock': false,
        'showPager': true,
        'theme': 'none'
    }


    //LOAD QUIZ FROM DATA
    $scope.loadQuiz = function (file, noQ) {
        $http.get(file)
         .then(function (res) {
             $scope.quiz = res.data.quiz;
             $scope.config = helper.extend({}, $scope.defaultConfig, res.data.config);
             $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle(res.data.questions) : res.data.questions;
             $scope.totalItems = noQ;
             console.log(noQ);
             $scope.itemsPerPage = $scope.config.pageSize;
             $scope.currentPage = 1;
             $scope.mode = 'quiz';
             $ionicLoading.hide();

             $scope.$watch('currentPage + itemsPerPage', function () {
                 var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                   end = begin + $scope.itemsPerPage;

                 $scope.filteredQuestions = $scope.questions.slice(begin, end);
             });
         });
    }; 

    $scope.loadQuiz("http://api.smashrite.com/api/getTest/"+$localstorage.get('currentCourseMode')+"/" + $localstorage.get('currentMode'), $localstorage.get('currentMode'));//$localstorage.get('currentCourse')
    //$scope.loadQuiz(/$localstorage.get('currentCourse'), $localstorage.get('currentMode'));//$localstorage.get('currentCourse')

    //SELECT OPTION
    $scope.goTo = function (index) {
        if (index > 0 && index <= $scope.totalItems) {
            $scope.currentPage = index;
            $scope.mode = 'quiz';
        }
    }

    $scope.onSelect = function (question, option) {
        
        //Calling Notif onSelect
      // $scope.ansNotif();


        if (question.QuestionTypeId == 1) {
            question.Options.forEach(function (element, index, array) {
                if (element.Id != option.Id) {
                    element.Selected = false;
                    //question.Answered = element.Id;
                }
            });
        }

        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
            $scope.currentPage++;
    }

    //SUBMIT EXAM
    $scope.onSubmit = function () {
        var answers = [];
        $scope.questions.forEach(function (q, index) {
            answers.push({ 'QuizId': $scope.quiz.Id, 'QuestionId': q.Id, 'Answered': q.Answered });
        });
        // Post your data to the server here. answers contains the questionId and the users' answer.
        //$http.post('api/Quiz/Submit', answers).success(function (data, status) {
        //    alert(data);
        //});
        // console.log($scope.questions);
        $scope.mode = 'result';
    }

    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };

    $scope.limitJSON = function (amount) {
        var limit = amount;
    }

    $scope.isAnswered = function (index) {
        var answered = 'Not Answered';
        $scope.questions[index].Options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';

                return false;
            }
        });
        return answered;
    };

    $scope.isCorrect = function (question) {
        var result = 'correct';
        question.Options.forEach(function (option, index, array) {
            if (helper.toBool(option.Selected) != option.IsAnswer) {
                result = 'wrong';
                if (option.IsAnswer) {
                    correctAns = option.Name;
                    // console.log(correctAns);
                }
                return false;
            }
        });
        return result;
    };

    $scope.$on("$destroy", function() {
         x =document.getElementsByClassName("ns-box")[0];
         if(x) x.remove();
   });

      var modalToggle = false;
      var type = true;            

      $scope.ansNotif = function (question) {
          question.Options.forEach(function (option, index, array) {
              if (helper.toBool(option.Selected) == option.IsAnswer) {
                  bubble = "<h3 class='correct'>You are correct</h3>";
                  type = 'success';
              } else {
                  if (option.IsAnswer) {
                      correctAns = option.Name;
                      bubble ="<h5 class='error'>Oops! Your selection is wrong<br>The correct answer is </h5>"+correctAns ;
                      type = 'error';
                  }
              }
            });
        setTimeout(function () {
          // create the notification
          var notification = new window.NotificationFx({
            message : bubble,
            layout : 'growl',
            effect : 'scale',
            wrapper : document.body,
            ttl : 6000000000,
            type : type, // notice, warning, error or success

            onClose : function() {
                        x =document.getElementsByClassName("ns-box")[0];
                        x.remove();                   
            },

            onOpen : function() { 
                         $scope.goTo( $scope.currentPage + 1);
             }
          });

          if (modalToggle == false){
                  notification.show();
                  console.log("open")
                  var x  = document.getElementsByClassName("button")[0];          
            }else {
                     notification.dismiss();
                     console.log('close');
                    x =document.getElementsByClassName("ns-box")[0];
                    x.remove();

                      if ($scope.currentPage==$scope.totalItems) {
                                $state.go('app.result');
                          }
                    }

          modalToggle = !modalToggle;

        }, 500 );

        // disable the button (for demo purposes only)
        this.disabled = true;
      };


}]);

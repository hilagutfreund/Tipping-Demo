// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDKd4sepVWeb9kyFSm0cJbRzpH7mFmGURY",
    authDomain: "test-thesis1.firebaseapp.com",
    databaseURL: "https://test-thesis1.firebaseio.com",
    projectId: "test-thesis1",
    storageBucket: "test-thesis1.appspot.com",
    messagingSenderId: "169300980699",
    appId: "1:169300980699:web:58a91c062bb26159c9edfe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var tipApp = angular.module('tipApp', ['ngRoute', 'ui.router']);

    tipApp.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('start');
        $stateProvider
        .state('start', {
            url: '/start',
            templateUrl: 'templates/main.html',
            controller: 'startController'
        })

        .state('ambiguous', {
            url: '/tip1?userid', 
            templateUrl: "templates/tipambiguous.html", 
            controller: 'tipController'

        })

         .state('tipjar', {
            url: '/tip2?userid', 
            templateUrl: "templates/tipjar.html", 
            controller: 'tipController'

        })

         .state('barista', {
            url: '/tip3?userid', 
            templateUrl: "templates/barista.html", 
            controller: 'tipController'

        })

         .state('confirmation', {
            url: '/confirmation?useridtip',
            templateUrl: "templates/confirmationScreen.html", 
            controller: 'confirmationController'
         })

         //  .state('custom', {
         //    url: '/custom',
         //    templateUrl: "templates/customScreen.html", 
         //    controller: 'customController'
         // })

    });
   
    // create the controller and inject Angular's $scope
    tipApp.controller('mainController', function($scope, $rootScope, $stateParams) {
    });
    
    tipApp.controller('startController', function($scope, $rootScope, $timeout, $state, $stateParams) {
        $scope.message="hello";
        $scope.participants = [];
        $scope.selected = {
            id:"x",
            IA:"",
            device:""
        };

        //select participant from list
        $scope.onSelectParticipant = function(){
            var newId = $scope.selected.id;

            var par = $scope.participants.find(p=>p.id==newId);
            if(par!==undefined){
                $scope.selected.IA = par.data.IA;
                $scope.selected.device = par.data.device;
                $scope.selected.switch = par.data.switch; 
                $scope.web = $scope.webPage($scope.selected.switch);
            }else{
                $scope.selected.IA = "";
                $scope.selected.device = "";
            }
        }

        //get a list of all participants from database
        var db = firebase.firestore();
          db.collection("participants")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    $timeout(function(){
                        $scope.participants.push({id:doc.id, data:doc.data()}); 
                    });
                    

                });
                console.log($scope.participants); 
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });


            //this is not working... so far can only hard code which thing.. 
       $scope.webPage = function(scenario){
        switch (scenario) {
            case 'st':
                return 'tipjar';
                break;
            case 'sm':
                return 'tipjar';
                break;
            case 'bt':
                return'barista';
                break; 
            case 'bm':
                return 'barista';
                break; 
            case 'at':
                return 'ambiguous';
                break; 
            case 'am':
                return 'ambiguous';
                break; 
            default:
        }
       }
       
    });
    

    tipApp.controller('tipController', function($scope, $state, $stateParams) {
        $scope.userid = $stateParams.userid; 
        console.log( "->user id from param:" + $stateParams.userid);
        console.log( "->user id from scope:" + $scope.userid);


        var db = firebase.firestore();

        //read current "user-1/clicked" value
        db.collection("participants")
          .doc($scope.userid)
          .get()
          .then( function(doc){
            $scope.data = doc.data(); 
            console.log($scope.data); 
            //showClickedButton(doc);
          });

    //Update user-1/clicked value
        function writeClickedButton(val){
          db.collection("participants")
          .doc($scope.userid)
          .set({
            clicked:val,
            IA:$scope.data.IA,
            device:$scope.data.device,
            switch:$scope.data.switch
          });
        }

    //Add buttons click handlers
        $(function(){
          $("#Button_10").click(function(){
            writeClickedButton("10%");
          })
          $("#Button_15").click(function(){
            writeClickedButton("15%");
          })
          $("#Button_18").click(function(){
            writeClickedButton("18%");
          })
          // $("#Button_custom").click(function(){
          //   writeClickedButton("+custom tip");
          // })
          $("#Button_none").click(function(){
            writeClickedButton("");
          })
        });

    //Listen to user-1/* data changes
        // db.collection("participants")
        //   .doc($scope.userid)
        //   .onSnapshot(function(doc){
        //     showClickedButton(doc);
        //   });

    //Read the user document data and write the clickd button value to the DOM
        // function showClickedButton(doc){
        //     var user1 = doc.data();
        //     console.log("IA" + user1.IA); 
        //     console.log("device" + user1.device);
        //     console.log(doc.id + "->clicked:" + user1.clicked);
        //     $scope.tipClicked = user1.clicked; 
        //     $("#TipAmount").html(user1.clicked);
        //     console.log($scope.tipClicked); 

        // }
        
    });


    tipApp.controller('confirmationController', function($scope, $stateParams) {
        var usertip = $stateParams.useridtip; 
        console.log(usertip); 
        var strings = usertip.split("tip");
        $scope.userid = strings[0]; 
        $scope.tip = strings[1]; 
        var parse = parseFloat($scope.tip).toFixed(2); 
        $scope.finalAmount = parse + 5.00; 
        console.log(finalAmount); 


        // $scope.userid = $stateParams.userid; 
        // console.log( "->user id from param:" + $stateParams.userid);
        // console.log( "->user id from scope:" + $scope.userid);
        // console.log( "->tip from scope:" + $scope.tip);
        // console.log( "->tip parse:" + parseFloat($scope.tip).toFixed(2));

        // $scope.parse = parseFloat($scope.tip).toFixed(2); 
        // console.log ("scope.parse " + $scope.parse);
        // $scope.finalAmount = $scope.parse + 5.00; 




        var db = firebase.firestore();

        //read current "user-1/clicked" value
        db.collection("participants")
          .doc($scope.userid)
          .get()
          .then( function(doc){
            $scope.data = doc.data(); 
            console.log($scope.data); 
            //showClickedButton(doc);
          });

    //Update user-1/clicked value
        function writeClickedButton(val){
          db.collection("participants")
          .doc($scope.userid)
          .set({
            clicked:val,
            IA:$scope.data.IA,
            device:$scope.data.device,
            switch:$scope.data.switch,
            finalTip: $scope.tip
          });
        }

    //Add buttons click handlers
        $(function(){
          $("#Print").click(function(){
            writeClickedButton("print receipt");
          })
          $("#None").click(function(){
            writeClickedButton("no receipt");
        });

    //Listen to user-1/* data changes
        db.collection("participants")
          .doc($scope.userid)
          .onSnapshot(function(doc){
            showClickedButton(doc);
          });

    //Read the user document data and write the clickd button value to the DOM
        // function showClickedButton(doc){
        //     var user1 = doc.data();
        //     console.log("IA" + user1.IA); 
        //     console.log("device" + user1.device);
        //     console.log(doc.id + "->clicked:" + user1.clicked);
        //     $scope.tipClicked = user1.clicked; //in case we need this at some point to know final tip amount... but won't work for custom tip.. oops. will need to get every click + record the final number
        //     $("#TipAmount").html(user1.clicked);
        //     console.log($scope.tipClicked); 

        // }



       
    });

    // tipApp.controller('customController', function($scope, $rootScope, $stateParams) {
    //     function myCtrl($scope) {
    //     $scope.myDecimal = 0;
    //     }

    });


var ravenSender = {
  email: '',
  name: ''
}
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDHmDjdF_gTgLkw2WA98Gw31CpWHFjctpk",
  authDomain: "black-raven-messenger.firebaseapp.com",
  databaseURL: "https://black-raven-messenger.firebaseio.com",
  projectId: "black-raven-messenger",
  storageBucket: "black-raven-messenger.appspot.com",
  messagingSenderId: "782454277462"
};
firebase.initializeApp(config);
//firebase auth config
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      $("#username").text(firebase.auth().currentUser.email);
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  //signInSuccessUrl: '127.0.0.1:3000/inbox.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// Get a reference to the database service
//var database = firebase.database();

function parseMessage(messageObject){
  //console.log(messageObjectList);
  let messageHtml;
  //var messageId = messageObject.key;
  var messageData = messageObject.val();
  let body = messageData.body;
  let from = messageData.from;
  if (messageData.to === ravenSender.name.split(" ")[0]){
    messageHtml = ("<tr><td>" + from + "<\/td><td>"
    + body + "<\/td><\/tr>");
  }
  //console.log(messageHtml);
  return messageHtml;

}

function showMessage(messageHtml){
  $("#inboxTable").append(messageHtml);
}

function sendMessageWithCallback(from, to, body){
  firebase.database().ref("/messages/").push({
    from: from,
    to: to,
    body: body
  }, function(error) {
    if (error) {
      console.log("Error occurred when sending the message to Firebase");
    } else {
      console.log("No error occurred when sending the message to Firebase");
      //getNewMessage().then(snapshot => parseMessages(snapshot))
      //.then(result=>showMessages(result));
    }
  });
}

$(function() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      ravenSender.email = user.email;
      ravenSender.name = user.displayName;
      // User is signed in.
      console.log("User already logged in!");
      $("#username").text(firebase.auth().currentUser.email);
      $("#firebaseui-auth-container").css("display", "none");
    } else {
      // No user is signed in.
    }
    });

    var messagesRef = firebase.database().ref('/messages/');
    messagesRef.on('child_added', function(data) {
      showMessage(parseMessage(data));
    });

    $("#sendButton").click(function() {
      $("#raven").addClass("ravenFlight");
      document.getElementById("ravenScream").play();
      sendMessageWithCallback(ravenSender.name.split(" ")[0], $("#messageTo").val(), $("#messageField").val());
    });

});

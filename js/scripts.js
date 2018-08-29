//Business Logic
var user;
var pass;
var type;
var activeUser = sessionStorage.getItem('user');
var activeUserType = sessionStorage.getItem('type');

// Create Databases for users and tickets
var users = JSON.parse(localStorage.getItem("users") || "[]");
var issues = JSON.parse(localStorage.getItem("issues") || "[]");

// User Interface Logic
$(document).ready(function() {

  $('#regButton').click(function(){
    $('#loginSection').hide();
    $('#registerSection').show();
  });

  $('#logButton').click(function(){
    $('#loginSection').show();
    $('#registerSection').hide();
  });

  $('#issueButton').click(function(){
    $('#output').hide();
    $('#issueSection').show();
  });

  $("#register").submit(function(event) {
    event.preventDefault();

    var user = $("#user").val();
    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var email = $("#email").val();
    var pass = $("#pass").val();
    var userType = $("#usertype option:selected").val();



    users.push({
      id: users.length,
      username: user,
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: pass,
      usertype: userType
    });


    localStorage.setItem("users", JSON.stringify(users));
    document.querySelector('#register').reset();

  });

  $("#login").submit(function(event) {
    event.preventDefault();

    user = $("#username").val();
    pass = $("#password").val();

    for (var index = 0; index < users.length; index++) {
      if (user === users[index].username) {
        type = users[index].usertype;
        break;
      }
    }
    var loggedin;
    for (var index = 0; index < users.length; index++) {
      if (user === users[index].username && pass === users[index].password) {
        loggedin = true;
        break;
      }
    }

    if (user === '' || pass === '') {
      alert('Please enter your credentials');
    } else if (loggedin === true) {
      $('#loginSection').hide();
      $('#output').show();
    } else {
      alert("Wrong username or password!");
    }

    sessionStorage.setItem('user', user);
    sessionStorage.setItem('type', type);
  });

  $("#ticket").submit(function(event) {
    event.preventDefault();
    var subject = $("#subject").val();
    var description = $("#description").val();
    var severity = $('input[name=severity]:checked').val();
    var assignedTo = $("#assignedto option:selected").val();

    function uniqueID() {
      function chr4() {
        return Math.random()
          .toString(16)
          .slice(-4);
      }
      return chr4() + "-" + chr4() + "-" + chr4();
    }

    function getFormattedDate() {
      var todayTime = new Date();
      var mlist = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var month = mlist[todayTime.getMonth()];
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      return day + "th".sup() + " " + month + " " + year;
    }

    issues.push({
      id: issues.length,
      issueid: uniqueID(),
      subject: subject,
      description: description,
      severity: severity,
      assignedto: assignedTo,
      requester: activeUser,
      status: "open",
      date: getFormattedDate()
    });

    localStorage.setItem("issues", JSON.stringify(issues));
    document.querySelector('#ticket').reset();

    $('#output').show();
    $('#issueSection').hide();

  });
  users.forEach(function(user) {
    if (user.usertype === "Technician") {
      $("#assignedto").append("<option>" + user.username + "</option>");
    }
  });

  if (activeUserType === "Technician") {
    issues.forEach(function(issue) {
      function severity() {
        if (issue.severity === "low") {
          return `<span class="badge badge-info">${issue.severity}</span>`;
        } else if (issue.severity === "medium") {
          return `<span class="badge badge-warning">${issue.severity}</span>`;
        } else {
          return `<span class="badge badge-danger">${issue.severity}</span>`;
        }
      }
      if (issue.assignedto === activeUser) {
        $('#row').append(`
         <div class="col-md-6 my-4">
         <div class="card">
           <div class="card-header text-center"><strong>Issue ID:</strong> ${issue.issueid}</div>
           <div class="card-body">
             <h5 class="card-title">${issue.subject}</h5>
             <h6 class="card-subtitle mb-2 text-muted">Assigned to: ${issue.assignedto}</h6>
             <p class="card-text">${issue.description}</p>
             <div><span>Requested by: ${issue.requester}</span></div>
             <span class="badge badge-primary">${issue.status}</span>
             ${severity()}
             <a href="#" class="d-block my-3 card-link" data-toggle="modal" data-target="#exampleModal">View More</a>
           </div>
           <div class="card-footer text-muted text-center">${issue.date}</div>
         </div>

       `);
      }
    });
  } else {
    issues.forEach(function(issue) {
      function severity() {
        if (issue.severity === "low") {
          return `<span class="badge badge-info">${issue.severity}</span>`;
        } else if (issue.severity === "medium") {
          return `<span class="badge badge-warning">${issue.severity}</span>`;
        } else {
          return `<span class="badge badge-danger">${issue.severity}</span>`;
        }
      }
      if (issue.requester === activeUser) {
        $('#row').append(`
         <div class="col-md-6 my-4">
         <div class="card">
           <div class="card-header">${issue.issueid}</div>
           <div class="card-body">
             <h5 class="card-title">${issue.subject}</h5>
             <h6 class="card-subtitle mb-2 text-muted">Assigned to: ${issue.assignedto}</h6>
             <p class="card-text">${issue.description}</p>
             <div><span>Requested by: You</span></div>
             <span class="badge badge-primary">${issue.status}</span>
             ${severity()}
           </div>
           <div class="card-footer text-muted text-center">${issue.date}</div>
         </div>

       `);
      }
    });
  }

});

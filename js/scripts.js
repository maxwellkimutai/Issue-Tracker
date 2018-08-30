//Business Logic
var user;
var pass;
var type;
var activeUser = sessionStorage.getItem("user");
var activeUserType = sessionStorage.getItem("type");

// Create Databases for users and tickets
var users = JSON.parse(localStorage.getItem("users") || "[]");
var issues = JSON.parse(localStorage.getItem("issues") || "[]");

// User Interface Logic
$(document).ready(function() {
  $("#regButton").click(function() {
    $("#loginSection").hide();
    $("#registerSection").show();
  });

  $("#logButton").click(function() {
    $("#loginSection").show();
    $("#registerSection").hide();
  });

  $("#issueButton").click(function() {
    $("#output").hide();
    $("#issueSection").show();
  });
  // $("#logoutButton").click(function() {
  //   sessionStorage.removeItem("type");
  //   sessionStorage.removeItem("user");
  //   location.assign("/index.html");
  // });
  $("#sidebarCollapse").on("click", function() {
    $("#sidebar").toggleClass("active");
  });

  $(".dashboard-icon").on("click", function() {
    $(".tickets").hide();
    $(".dashboard").show();
    $(".navbar-brand").text("Dashboard");
  });

  $(".tickets-icon").on("click", function() {
    $(".dashboard").hide();
    $(".tickets").show();
    $(".navbar-brand").text("Tickets");
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
    location.assign("http:/index.html");
    localStorage.setItem("users", JSON.stringify(users));
    document.querySelector("#register").reset();
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

    if (user === "" || pass === "") {
      //$("#loginSection").addClass("animated shake");
      $(".alert").text("Please enter your credentials!!");
      $(".alert").show();
      //alert("");
    } else if (loggedin === true) {
      // $("#loginSection").hide();
      // $("#output").show();
      if (activeUserType === "Technician") {
        location.assign("http:/technician.html");
      } else if (activeUserType === "Requester") {
        location.assign("http:/requester.html");
      }
    } else {
      //$("#loginSection").addClass("animated shake");
      $(".alert").text("Wrong username or password!!");
      $(".alert").show();
      //alert("Wrong username or password!");
    }

    document.querySelector("#login").reset();

    setTimeout(function() {
      $(".alert").hide();
    }, 1500);

    sessionStorage.setItem("user", user);
    sessionStorage.setItem("type", type);
  });

  $("#ticket").submit(function(event) {
    event.preventDefault();
    var subject = $("#subject").val();
    var description = $("#description").val();
    var severity = $("input[name=severity]:checked").val();
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
    document.querySelector("#ticket").reset();

    $("#output").show();
    $("#issueSection").hide();
  });
  users.forEach(function(user) {
    if (user.usertype === "Technician") {
      $("#assignedto").append("<option>" + user.username + "</option>");
      $("#contacts").append(`
      <div class="contact">
        <h6><i class="fas fa-user"></i>${user.firstname} ${user.lastname}</h6>
        <p><i class="fas fa-envelope"></i> <a href="https://${user.email}">${
        user.email
      }</a></p>
      </div>
      `);
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
        if (issue.status === "open") {
          $("#open-issues").append(`
          <tr data-toggle="modal" data-target="#fast-car1">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.assignedto}</td>
        </tr>
        <div class="modal fade" id="fast-car1" tabindex="-1" role="dialog" aria-labelledby="fast-car1">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="fast-car1-label">Fast Car</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                I have been experiencing fast cars. Could you please help?
              </div>
              <div class="modal-footer">
                Assigned to: Tom
              </div>
            </div>
          </div>
        </div>`);
        }
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
        if (issue.status === "open") {
          // $("#open-issues").append(
          //   `<tr data-toggle="modal" data-target="#fast-car">
          //     <th>67890</th>
          //     <td>Fast Car</td>
          //     <td>Maryann</td>
          //   </tr>
          //   <div class="modal fade" id="fast-car" tabindex="-1" role="dialog" aria-labelledby="fast-car">
          //     <div class="modal-dialog" role="document">
          //       <div class="modal-content">
          //         <div class="modal-header">
          //           <h5 class="modal-title" id="fast-car-label">Fast Car</h5>
          //           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          //             <span aria-hidden="true">&times;</span>
          //           </button>
          //         </div>
          //         <div class="modal-body">
          //           I have been experiencing fast cars. Could you please help?
          //         </div>
          //         <div class="modal-footer">
          //           Assigned to: Maryann
          //         </div>
          //       </div>
          //     </div>
          //   </div>`
          // );
          $("#ticket-cards").append(`
          <div class="card text-white mb-3">
          <div class="card-header">${issue.issueid}</div>
          <div class="card-body">
            <h5 class="card-title">${issue.subject}</h5>
            <p class="card-text"><i class="fas fa-exclamation-circle"></i>
            <span>${severity()}</span> <i class="fas fa-user"></i>
              <span class="technician">${issue.assignedto}</span></p>
          </div>
          <div class="card-footer" style="background-color: #082845; ">
            ${issue.date}
          </div>
        </div>
          `);
        }
      }
      // else if (issue.) {
      //   $("#ticket-cards").append(`
      //     <div class="card text-white bg-dark mb-3">
      //     <div class="card-header">${issue.issueid}</div>
      //     <div class="card-body">
      //       <h5 class="card-title">${issue.subject}</h5>
      //       <p class="card-text"><i class="fas fa-exclamation-circle"></i>
      //       <span>${severity()}</span> <i class="fas fa-user"></i>
      //         <span class="technician">${issue.assignedto}</span></p>
      //     </div>
      //   </div>
      //     `);
      // }
    });
  }
});

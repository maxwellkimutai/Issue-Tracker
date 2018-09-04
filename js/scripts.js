//Business Logic
var user;
var pass;
var type;
var activeUser = sessionStorage.getItem("user");
var activeUserType = sessionStorage.getItem("type");
var tempIssues = JSON.parse(localStorage.getItem("issues") || "[]");

// Create Databases for users and tickets
var users = JSON.parse(localStorage.getItem("users") || "[]");
var issues = JSON.parse(localStorage.getItem("issues") || "[]");

// User Interface Logic
$(document).ready(function() {
  $("#logoutButton").click(function() {
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("user");
    location.assign("/index.html");
  });
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
      $(".wrapper").addClass("animated shake");
    } else if (loggedin === true) {
      sessionStorage.setItem("user", user);
      sessionStorage.setItem("type", type);

      activeUserType = sessionStorage.getItem("type");

      if (activeUserType === "Technician") {
        location.assign("/technician.html");
      } else {
        location.assign("/requester.html");
      }
    } else {
      $(".wrapper").addClass("animated shake");
    }

    document.querySelector("#login").reset();

    setTimeout(function() {
      $(".wrapper").removeClass("animated shake");
    }, 1500);
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
    // document.querySelector("#ticket").reset();
    location.reload();
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
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.requester}</td>
        </tr>`);
          $("#output").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        } else if (issue.status === "in-progress") {
          $("#in-progress-issues").append(`
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.requester}</td>
        </tr>`);
          $("#output").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        } else {
          $("#closed-issues").append(`
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.requester}</td>
        </tr>`);
          $("#output").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        }
        $("#assigned").append(`
        <div class="card text-white mb-3">
          <div class="card-header">${issue.issueid}</div>
          <div class="card-body">
            <h5 class="card-title">${issue.subject}</h5>
            <p>${issue.description}</p>
            <p class="card-text"><i class="fas fa-exclamation-circle"></i> <span>High</span> <i class="fas fa-user"></i>
            <span class="requester">${issue.requester}</span></p>
            <p>Status: <span class="text-muted">${issue.status}</span></p>
          </div>q
          <div class="card-footer">
            <h6>Change Status:</h6>
            <button class="open-status btn btn-danger" id="open-${issue.id}">Open</button>
            <button class="in-progress-status btn btn-info text-white" id="in-progress-${issue.id}">In Progress</button>
            <button class="closed-status btn btn-success" id="closed-${issue.id}">Closed</button>
          </div>
        </div>
        `);
        $(`#in-progress-${issue.id}`).click(function() {
          tempIssues[issue.id].status = "in-progress";
          localStorage.removeItem('issues');
          localStorage.setItem('issues', JSON.stringify(tempIssues));
          location.reload();
        });
        $(`#closed-${issue.id}`).click(function() {
          tempIssues[issue.id].status = "closed";
          localStorage.removeItem('issues');
          localStorage.setItem('issues', JSON.stringify(tempIssues));
          location.reload();
        });
      } else if (issue.requester === activeUser) {
        $("#my-tickets-inner").append(`
        <div class="card text-white mb-3">
        <div class="card-header">${issue.issueid}</div>
        <div class="card-body">
          <h5 class="card-title">${issue.subject}</h5>
          <p class="card-text"><i class="fas fa-exclamation-circle"></i>
          <span>${severity()}</span> <i class="fas fa-user"></i>
            <span class="technician">${issue.assignedto}</span></p>
          <p>Status: <span class="text-muted">${issue.status}</span></p>
        </div>
        <div class="card-footer" style="background-color: #082845; ">
          ${issue.date}
        </div>
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
        if (issue.status === "open") {
          $("#open-requester").append(`
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.assignedto}</td>
        </tr>`);
          $("#output1").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        } else if (issue.status === "in-progress") {
          $("#in-progress-requester").append(`
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.assignedto}</td>
        </tr>`);
          $("#output1").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        } else {
          $("#closed-requester").append(`
          <tr data-toggle="modal" data-target="#issue-${issue.id}">
          <th>${issue.issueid}</th>
          <td>${issue.subject}</td>
          <td>${issue.assignedto}</td>
        </tr>`);
          $("#output1").append(`
          <div class="modal fade" id="issue-${
            issue.id
          }" tabindex="-1" role="dialog" aria-labelledby="issue-${issue.id}">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="issue-${issue.id}-label">${
            issue.subject
          }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${issue.description}
              </div>
              <div class="modal-footer">
                Assigned to: ${issue.assignedto}
              </div>
            </div>
          </div>
        </div>
          `);
        }

        $("#ticket-cards").append(`
        <div class="card text-white mb-3">
        <div class="card-header">${issue.issueid}</div>
        <div class="card-body">
          <h5 class="card-title">${issue.subject}</h5>
          <p class="card-text"><i class="fas fa-exclamation-circle"></i>
          <span>${severity()}</span> <i class="fas fa-user"></i>
            <span class="technician">${issue.assignedto}</span></p>
          <p>Status: <span class="text-muted">${issue.status}</span></p>
        </div>
        <div class="card-footer" style="background-color: #082845; ">
          ${issue.date}
        </div>
      </div>
        `);
      }
    });
  }
});

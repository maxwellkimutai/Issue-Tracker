$(document).ready(function(){

  $('#sidebarCollapse').on('click', function(){
    $('#sidebar').toggleClass('active');
  });

  $('.dashboard-icon').on('click', function(){
    $('.tickets').hide();
    $('.dashboard').show();
    $('.navbar-brand').text("Phoenix Issue Tracker - Dashboard");
  });

  $('.tickets-icon').on('click', function(){
    $('.dashboard').hide();
    $('.tickets').show();
    $('.navbar-brand').text("Phoenix Issue Tracker - My Tickets");
  });
});

'use strict';

$(document).ready(function() {
  console.log('loaded');
  $('#genKey').click(function() {
    console.log('hello');
    setTimeout(function() {
      location.reload();
    }, 100);
  });
});

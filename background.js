$(function () {
  $('table').each(function () {
    $(this).attr('cellspacing', 0);
    if ($(this).attr('bgcolor') === '#99ccff') {
      $(this).addClass('title');
    }
  });
});

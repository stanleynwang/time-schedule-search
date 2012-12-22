$(function () {
  $("table").each(function () {
    if ($(this).attr("bgcolor") === "#99ccff") {
      $(this).addClass("title");
    }
  });
});

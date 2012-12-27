var abbrToLinkMap = {};

function mapAbbrToLinks() {
  $('li>a').each(function () {
    var link = $(this);
    var abbrMatch = link.text().match(/\(([^()]*)\)$/);
    if (abbrMatch) {
      var abbr = abbrMatch[1].trim().toLowerCase();
      if (abbr.split(" ").length <= 2)
        abbrToLinkMap[abbr] = link.attr('href');
    }
  });
}

function validateForm() {
  var form = $(this);
  var values = {};
  $.each(form.serializeArray(), function(i, field) {
        values[field.name] = field.value;
  });

  var parts = values['class'].trim().toLowerCase().split(" ");
  if (parts.length != 2 && parts.length != 3)
    return false;

  var department = parts[0];
  var number = parts[1];
  var page = abbrToLinkMap[department.toLowerCase()];
  var link = department + number;
  form.attr('action', page + "#" + link);
  return true;
}

function createSearchBox() {
  $('h1').after(
    ['<form name="search" id="classSearch" method="post">',
     '<input type="text" name="class" id="classInput">',
     '<input type="submit" value="Search">',
     '</form>'
    ].join('\n')
  );

  $('#classSearch').submit(validateForm);
  $('#classInput').attr({
    placeholder: "Enter a class",
    size: 11
  });
}

$(function () {
  mapAbbrToLinks();
  createSearchBox();
});

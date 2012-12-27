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

function parseInput(str) {
  var input = {};
  var parts = str.trim().toLowerCase().split(" ");
  if (parts.length != 2 && parts.length != 3)
    return null;

  input['department'] = parts[0];
  input['courseNumber'] = parts[1];
  return input;
}

function validateForm() {
  var form = $(this);
  var values = {};
  $.each(form.serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

  var input = parseInput(values['class']);
  if (input === null)
    return false;

  var page = abbrToLinkMap[input['department'].toLowerCase()];
  var link = input['department'] + input['courseNumber'];
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

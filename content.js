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

function abbrExists(abbr) {
  return abbr in abbrToLinkMap;
}

function isNumber(str) {
  return str.match(/\d+/) !== null;
}

function validateInput(inputHalves) {
  return inputHalves instanceof Array && inputHalves.length == 2 &&
    abbrExists(inputHalves[0]) && isNumber(inputHalves[1]);
}

function mergeTokens(tokens) {
  var numTokens = tokens.length;
  var result = [];

  var firstHalf = [];
  for (var i = 0; i < numTokens - 1; i++)
    firstHalf.push(tokens[i]);

  result.push(firstHalf.join(" "));
  result.push(tokens[numTokens - 1]);

  return result;
}

function parseInput(str) {
  var input = {};
  var tokens = str.trim().toLowerCase().split(" ");
  var halves = mergeTokens(tokens);
  if (!validateInput(halves))
    return null;

  input['department'] = halves[0];
  input['courseNumber'] = halves[1];

  return input;
}

function removeWhitespace(str) {
  return str.replace(/\s/, '');
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
  form.attr('action', removeWhitespace(page + "#" + link));

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

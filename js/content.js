var abbrToLinkMap = Object.create(null);
var abbrTags = [];

function abbrExists(abbr) {
  return abbr in abbrToLinkMap;
}

function mapAbbrToLinks() {
  $('li>a').each(function () {
    var link = $(this);
    var abbrMatch = link.text().match(/\(([^()]*)\)$/);
    if (abbrMatch) {
      var abbr = abbrMatch[1].trim().toLowerCase().replace(/\s/, ' ');
      if (abbr.split(" ").length <= 2 && !abbrExists(abbr)) {
        abbrToLinkMap[abbr] = link.attr('href');
        abbrTags.push(abbr.toUpperCase());
      }
    }
  });
  abbrTags.sort();
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
  var tokens = str.trim().toLowerCase().split(/\s/);
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

function toggleError(state) {
  state ? $('#classInput').addClass('error') :
          $('#classInput').removeClass('error');
}

function displayErrorMessage(str) {
  $('#classSearchError').text(str);
}

function validateForm() {
  var form = $(this);
  var values = {};
  $.each(form.serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

  var input = parseInput(values['class']);
  if (input === null) {
    toggleError(true);
    displayErrorMessage('Class not found.');
    return false;
  }
  toggleError(false);
  displayErrorMessage('');

  var page = abbrToLinkMap[input['department'].toLowerCase()];
  var link = input['department'] + input['courseNumber'];
  form.attr('action', removeWhitespace(page + "#" + link));

  return true;
}

function createSearchBox() {
  $('h1').after('<h2 id="classSearchH2">Class Search</h2>');
  $('#classSearchH2').after(
    ['<p></p>',
     '<form name="search" id="classSearch" method="post">',
     '<input type="text" name="class" id="classInput">',
     '<input type="submit" value="Search">',
     '<span id="classSearchError"></span>',
     '</form>'
    ].join('\n')
  );

  $('#classSearchH2+p').text(
    ['Enter a class in the search box below. You will be taken to its listing',
     'in the time schedule.'
    ].join(' ')
  );
  $('#classSearch').submit(validateForm);
  $('#classInput').attr({
    placeholder: "Enter a class",
    size: 11
  });
}

function setUpAutocomplete() {
  $('#classInput')
    .addClass('ui-autocomplete-input')
    .attr('autocomplete', 'off')
    .autocomplete({
      source: abbrTags
    });
}

$(function () {
  mapAbbrToLinks();
  createSearchBox();
  setUpAutocomplete();
});

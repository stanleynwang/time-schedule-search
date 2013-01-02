var abbrToLinkMap = Object.create(null);
var abbrTags = [];

// Return if a class abbreviation exists.
function abbrExists(abbr) {
  return abbr in abbrToLinkMap;
}

// Create mappings from abbreviations to page links, from the page HTML. Also
// create the abbreviation tags used for autocomplete.
function mapAbbrToLinks() {
  $('li>a').each(function () {
    var link = $(this);
    // match department_name (abbr)
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

// Return if a string contains all numeric digits.
function isNumber(str) {
  return str.match(/\d+/) !== null;
}

// Return if the input array is of the form [valid_abbr, number].
function validateInput(inputHalves) {
  return inputHalves instanceof Array && inputHalves.length == 2 &&
    abbrExists(inputHalves[0]) && isNumber(inputHalves[1]);
}

// Merge and concatenate all entries except the last of an array. Return a new
// array with the new entries.
// Ex. ['a', 'b', 'c', 'd'] -> ['a b c', 'd']
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

// Parse the input string and return an object with department and courseNumber
// properties filled in.
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

// Return a copy of the string with the whitespace removed.
function removeWhitespace(str) {
  return str.replace(/\s/, '');
}

// Toggle the error state of the search box.
function toggleError(state) {
  state ? $('#classInput').addClass('error') :
          $('#classInput').removeClass('error');
}

// Display the string as an error message.
function displayErrorMessage(str) {
  $('#classSearchError').text(str);
}

// Validate and modify the form action as appropriate upon submit.
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

// Create the search box in the HTML.
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

// Set up the autocomplete functionality in the HTML.
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

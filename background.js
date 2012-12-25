$(function () {
  var abbrToLinkMap = {};
  $('li a').each(function () {
    var link = $(this);
    var abbrMatch = link.text().match(/\((.*)\)/);
    if (abbrMatch) {
      abbrToLinkMap[abbrMatch[1]] = link.attr('href');
    }
  });

  var script = [];
  script.push('function validateForm() {');

  script.push('var abbrToLinkMap = {');
  var pairs = [];
  for (abbr in abbrToLinkMap)
    pairs.push(wrapWithQuotes(abbr.toLowerCase()) + ':' +
        wrapWithQuotes(abbrToLinkMap[abbr]));
  script.push(pairs.join(',') + '};');

  script.push(['var form = document.search;',
    'var parts = form.class.value.trim().toLowerCase().split(" ");',
    'if (parts.length != 2) return false;',
    'var department = parts[0];',
    'var number = parts[1];',
    'var page = abbrToLinkMap[department.toLowerCase()];',
    'var link = department + number;',
    'form.action = page + "#" + link;',
    'return true;',
    '}'
  ].join(''));

  addScript(script.join(''));

  var defaultText = "Enter a class";
  $('h1').after(
    ['<form ',
     'name="search" method="post" onsubmit="return validateForm()">',
     '<input type="text" size="11" name="class" value="' + defaultText + '" ',
     'onfocus="if (this.value==\'' + defaultText + '\') {this.value = \'\';}" ',
     'onblur="if(this.value==\'\') {this.value = \'' + defaultText + '\';}">',
     '<input type="submit" value="Search">',
     '</form>'
    ].join('\n')
  );
});

function wrapWithQuotes(str) {
  return "'" + str + "'";
}

function addScript(text) {
  var script = document.createElement('script');
  script.text = text;
  document.body.appendChild(script);
  document.body.removeChild(document.body.lastChild);
}

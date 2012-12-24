$(function () {
  $('table').each(function () {
    if ($(this).attr('bgcolor') === '#99ccff') {
      $(this).addClass('title');
    }
  });

  $('body').prepend(
    ['<form ',
     'name="search" method="post" onsubmit="return validateForm()">',
     '<input type="text" size="5" name="department">',
     '<input type="text" size="3" maxlength="3" name="number">',
     '<input type="submit" value="Search">',
     '</form>'
    ].join('\n')
  );

  addScript(['function validateForm() {',
    'var form = document.search;',
    'var page = form.department.value + ".html";',
    'var link = form.department.value + form.number.value;',
    'form.action = page + "#" + link;',
    'return true;',
    '}'
  ].join('\n'));
});

function addScript(text) {
  var script = document.createElement('script');
  script.text = text;
  document.body.appendChild(script);
  document.body.removeChild(document.body.lastChild);
}

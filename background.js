$(function () {
  $('table').each(function () {
    $(this).attr('cellspacing', 0);
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

  var script = document.createElement('script');
  script.text = ['function validateForm() {',
    'var form = document.search;',
    'console.log(form.department.value);',
    'form.action = "#" + form.department.value + form.number.value;',
    'return true;',
    '}'
  ].join('\n');
  document.body.appendChild(script);
});

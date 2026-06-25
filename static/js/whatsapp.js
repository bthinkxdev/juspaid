(function () {
  'use strict';

  var phone = (document.body.dataset.whatsappPhone || '919946299011').replace(/\D/g, '');
  var company = document.body.dataset.companyName || 'Juspaid International';

  function fieldValue(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text.trim() : '';
    }
    return (el.value || '').trim();
  }

  function openWhatsApp(text) {
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  function buildContactMessage(form) {
    return [
      'Hello, I would like to get in touch with ' + company + '.',
      '',
      'Name: ' + fieldValue(form, 'name'),
      'Phone: ' + fieldValue(form, 'phone'),
      'Email: ' + fieldValue(form, 'email'),
      'Reason: ' + fieldValue(form, 'reason'),
      'Message: ' + fieldValue(form, 'message'),
    ].join('\n');
  }

  function buildInvestMessage(form) {
    var lines = [
      'Hello, I would like to submit an enquiry to ' + company + '.',
      '',
      'Name: ' + fieldValue(form, 'name'),
      'Phone: ' + fieldValue(form, 'phone'),
      'Email: ' + fieldValue(form, 'email'),
      'Project: ' + fieldValue(form, 'project'),
      'Budget: ' + fieldValue(form, 'budget'),
    ];
    var message = fieldValue(form, 'message');
    if (message) {
      lines.push('Message: ' + message);
    }
    return lines.join('\n');
  }

  function buildFinderMessage(bar) {
    var project = bar.querySelector('[name="project"]');
    var plotSize = bar.querySelector('[name="plot_size"]');
    var budget = bar.querySelector('[name="budget"]');
    function selectText(el) {
      if (!el) return '';
      return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text.trim() : '';
    }
    return [
      'Hello, I am looking for a plot with ' + company + '.',
      '',
      'Project: ' + selectText(project),
      'Plot Size: ' + selectText(plotSize),
      'Budget: ' + selectText(budget),
    ].join('\n');
  }

  document.querySelectorAll('[data-whatsapp-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var type = form.getAttribute('data-whatsapp-form');
      var text = type === 'invest' ? buildInvestMessage(form) : buildContactMessage(form);
      openWhatsApp(text);
    });
  });

  document.querySelectorAll('[data-whatsapp-finder]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var bar = btn.closest('.finder-bar');
      if (!bar) return;
      openWhatsApp(buildFinderMessage(bar));
    });
  });

  window.JuspaidWhatsApp = { open: openWhatsApp };
})();

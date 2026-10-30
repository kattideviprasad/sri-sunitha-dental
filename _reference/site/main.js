// Sri Sunitha Dental Clinic — page behaviour (menu, FAQ, WhatsApp booking form).
(function () {
  'use strict';

  var WHATSAPP = '918019111888';
  var HEADER_OFFSET = 76;
  var TIMES = {
    morning: 'Morning (10 AM – 1 PM)',
    afternoon: 'Afternoon (1 – 5 PM)',
    evening: 'Evening (5 – 9 PM)'
  };

  // ---------- Mobile menu ----------
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.getElementById('mobile-nav');

  function setMenu(open) {
    mobileNav.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(mobileNav.hidden); });
  mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  // ---------- FAQ: one open at a time ----------
  var faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqButtons.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).hidden = true;
      });
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).hidden = false;
      }
    });
  });

  // ---------- Booking form ----------
  var form = document.getElementById('book-form');
  var sent = document.getElementById('book-sent');
  var dateInput = form.elements.date;
  var state = { day: '', time: '' };

  function pad(n) { return String(n).padStart(2, '0'); }
  var now = new Date();
  dateInput.min = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

  function showError(key, on) {
    document.getElementById('err-' + key).hidden = !on;
    var input = form.elements[key];
    if (input && input.tagName) input.setAttribute('aria-invalid', String(on));
  }

  ['name', 'phone'].forEach(function (k) {
    form.elements[k].addEventListener('input', function () { showError(k, false); });
  });
  dateInput.addEventListener('input', function () { showError('day', false); });

  form.querySelectorAll('[data-chips]').forEach(function (group) {
    var key = group.getAttribute('data-chips');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      state[key] = chip.getAttribute('data-value');
      group.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      if (key === 'day') dateInput.hidden = state.day !== 'other';
      showError(key, false);
    });
  });

  function scrollToBook() {
    var el = document.getElementById('book');
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: 'smooth' });
  }

  // Any "Book" CTA: show the form, prefill the treatment if given, scroll to it.
  document.querySelectorAll('[data-book]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var treatment = el.getAttribute('data-book');
      if (treatment) form.elements.treatment.value = treatment;
      sent.hidden = true;
      form.hidden = false;
      setMenu(false);
      scrollToBook();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.replace(/\D/g, '');
    if (phone.length === 12 && phone.indexOf('91') === 0) phone = phone.slice(2);
    if (phone.length === 11 && phone.indexOf('0') === 0) phone = phone.slice(1);

    var errors = {
      name: !name,
      phone: phone.length !== 10,
      day: !state.day || (state.day === 'other' && !dateInput.value),
      time: !state.time
    };
    Object.keys(errors).forEach(function (k) { showError(k, errors[k]); });
    if (errors.name || errors.phone || errors.day || errors.time) return;

    var fmt = function (d) { return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };
    var today = new Date();
    var day;
    if (state.day === 'today') day = 'Today, ' + fmt(today);
    else if (state.day === 'tomorrow') day = 'Tomorrow, ' + fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    else {
      var p = dateInput.value.split('-').map(Number);
      day = fmt(new Date(p[0], p[1] - 1, p[2]));
    }
    var time = TIMES[state.time];
    var treatment = form.elements.treatment.value || 'Not sure yet / check-up';
    var note = form.elements.note.value.trim();

    var lines = [
      'Hello Sri Sunitha Dental Clinic, I would like to book an appointment.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'For: ' + treatment,
      'Preferred day: ' + day,
      'Preferred time: ' + time
    ];
    if (note) lines.push('Note: ' + note);
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));

    try { window.open(url, '_blank', 'noopener'); } catch (err) { /* popup blocked: the button below still works */ }

    document.getElementById('sent-summary').textContent = [treatment, day, time].join(' · ');
    document.getElementById('sent-again').href = url;
    form.hidden = true;
    sent.hidden = false;
  });

  document.getElementById('sent-edit').addEventListener('click', function () {
    sent.hidden = true;
    form.hidden = false;
  });
})();

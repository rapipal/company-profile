/* Google Company Profile — vanilla JavaScript */
(function () {
    'use strict';

    /* ---------- Mobile navigation ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('primary-menu');

    function setMenu(open) {
        if (!toggle || !menu) return;
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setMenu(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
        });

        window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById('footer-year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Image fallbacks (remote photo -> local placeholder) ---------- */
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
        function useFallback() {
            if (img.dataset.fallbackApplied) return;
            img.dataset.fallbackApplied = 'true';
            img.src = img.dataset.fallback;
        }
        img.addEventListener('error', useFallback);
        if (img.complete && img.naturalWidth === 0) useFallback();
    });

    /* ---------- Contact form ---------- */
    var form = document.getElementById('contact-form');
    if (!form) return;

    var success = document.getElementById('form-success');
    var submitBtn = form.querySelector('button[type="submit"]');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var rules = {
        name: function (v) { return v.trim() ? '' : 'Name is required'; },
        email: function (v) {
            if (!v.trim()) return 'Email is required';
            return emailPattern.test(v) ? '' : 'Enter a valid email address';
        },
        subject: function (v) { return v.trim() ? '' : 'Subject is required'; },
        message: function (v) { return v.trim() ? '' : 'Message is required'; }
    };

    function showError(field, message) {
        var wrap = field.closest('.field');
        var error = wrap.querySelector('.field-error');
        wrap.classList.toggle('has-error', Boolean(message));
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        error.textContent = message;
    }

    function validateField(field) {
        var message = rules[field.name](field.value);
        showError(field, message);
        return !message;
    }

    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));

    fields.forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.closest('.field').classList.contains('has-error')) showError(field, '');
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var firstInvalid = null;
        fields.forEach(function (field) {
            if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) { firstInvalid.focus(); return; }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Frontend prototype only: nothing is sent or stored.
        setTimeout(function () {
            form.hidden = true;
            success.hidden = false;
            success.focus();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }, 1500);
    });

    var again = document.getElementById('send-another');
    if (again) {
        again.addEventListener('click', function () {
            form.reset();
            fields.forEach(function (field) { showError(field, ''); });
            success.hidden = true;
            form.hidden = false;
            fields[0].focus();
        });
    }
})();

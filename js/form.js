/* =============================================
   FORM.JS — Bubbles Playschool
   Handles: Form validation + EmailJS / mailto submission
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    /* =============================================
       EMAILJS CONFIGURATION
       ============================================= */
    // TODO: Replace with your EmailJS credentials
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    // Initialize EmailJS if available
    if (typeof emailjs !== 'undefined' && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(PUBLIC_KEY);
    }

    /* =============================================
       VALIDATION RULES
       ============================================= */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type || field.tagName.toLowerCase();
        const name = field.name;
        let isValid = true;
        let message = '';

        // Required check
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (isValid && type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation (10 digits)
        if (isValid && type === 'tel' && value !== '') {
            const phoneDigits = value.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                isValid = false;
                message = 'Please enter a valid 10-digit phone number';
            }
        }

        // Show or hide error
        const errorEl = field.parentElement.querySelector('.error-text');
        if (!isValid) {
            field.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('visible');
            }
        } else {
            field.classList.remove('error');
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('visible');
            }
        }

        return isValid;
    }

    /* =============================================
       LIVE VALIDATION ON BLUR
       ============================================= */
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
            validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', function () {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    /* =============================================
       FORM SUBMISSION
       ============================================= */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate all fields
        let allValid = true;
        inputs.forEach(function (input) {
            if (!validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Collect form data
        const formData = {
            parent_name: form.querySelector('[name="parent_name"]').value,
            child_name: form.querySelector('[name="child_name"]').value,
            child_dob: form.querySelector('[name="child_dob"]').value,
            program: form.querySelector('[name="program"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            message: form.querySelector('[name="message"]').value || 'No additional message'
        };

        // Try EmailJS first, fallback to mailto
        if (typeof emailjs !== 'undefined' && SERVICE_ID !== 'YOUR_SERVICE_ID') {
            // EmailJS submission
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
                .then(function () {
                    showSuccess();
                })
                .catch(function (error) {
                    console.error('EmailJS Error:', error);
                    // Fallback to mailto
                    sendMailto(formData);
                });
        } else {
            // mailto fallback
            sendMailto(formData);
        }
    });

    /* =============================================
       MAILTO FALLBACK
       ============================================= */
    function sendMailto(data) {
        // TODO: Replace with school email
        var schoolEmail = 'bubblesplayschool@gmail.com';
        var subject = encodeURIComponent('New Inquiry from ' + data.parent_name);
        var body = encodeURIComponent(
            'Parent/Guardian Name: ' + data.parent_name + '\n' +
            'Child\'s Name: ' + data.child_name + '\n' +
            'Child\'s Date of Birth: ' + data.child_dob + '\n' +
            'Program Interested In: ' + data.program + '\n' +
            'Phone: ' + data.phone + '\n' +
            'Email: ' + data.email + '\n\n' +
            'Message:\n' + data.message
        );

        window.location.href = 'mailto:' + schoolEmail + '?subject=' + subject + '&body=' + body;
        showSuccess();
    }

    /* =============================================
       SUCCESS MESSAGE
       ============================================= */
    function showSuccess() {
        form.style.display = 'none';
        if (successMessage) {
            successMessage.classList.add('show');
        }
    }

});

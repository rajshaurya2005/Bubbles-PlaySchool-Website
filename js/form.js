/* =============================================
   FORM.JS — Bubbles Playschool
   Handles: Form validation + EmailJS / mailto submission
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('enquiryForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    /* =============================================
       FORMSPREE INTEGRATION
       The form HTML handles the action URL and POST method.
       ============================================= */

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
        const formData = new FormData(form);

        // Submit via fetch to Formspree
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                showSuccess();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                })
            }
        }).catch(error => {
            console.error('Formspree Error:', error);
            alert("Oops! There was a problem submitting your form");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

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

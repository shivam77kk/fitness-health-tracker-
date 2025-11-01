
document.addEventListener('DOMContentLoaded', () => {

    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            loginForm.classList.remove('active');
            signupForm.classList.remove('active');
            
            setTimeout(() => {
                if (tab === 'login') {
                    loginForm.classList.add('active');
                } else {
                    signupForm.classList.add('active');
                }
            }, 150);
        });
    });


    signupForm.addEventListener('submit', handleSignup);
    
    loginForm.addEventListener('submit', handleLogin);
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function handleSignup(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    let isValid = true;

    if (!name) {
        showError('signupName', 'Name is required');
        isValid = false;
    }

    if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('signupEmail', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('signupPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('signupPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('signupConfirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('signupConfirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Creating Account...';
    btn.disabled = true;

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    let isValid = true;

    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }

    if (!isValid) return;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Logging in...';
    btn.disabled = true;

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}
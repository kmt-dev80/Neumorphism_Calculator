const display = document.getElementById('display');
let currentInput = '0';
let isDarkMode = false;

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

function userValue(value) {
    // Prevent multiple decimal points
    if (value === '.' && currentInput.includes('.')) {
        if (!currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
            currentInput += value;
        }
    } else {
        currentInput = (currentInput === '0' && value !== '.') ? value : currentInput + value;
    }
    updateDisplay();
    animatePress(display);
}

function updateDisplay() {
    display.textContent = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
    animatePress(display);
}

function deleteLastDigit() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
    animatePress(display);
}

function calculateSquareRoot() {
    try {
        const num = parseFloat(currentInput);
        if (num < 0) {
            showError("Negative number");
            return;
        }
        currentInput = math.sqrt(num).toString();
        updateDisplay();
        showSuccess();
    } catch (error) {
        showError("Invalid input");
    }
    animatePress(display);
}

function calculateLog() {
    try {
        const num = parseFloat(currentInput);
        if (num <= 0) {
            showError("Number must be positive");
            return;
        }
        currentInput = math.log10(num).toString();
        updateDisplay();
        showSuccess();
    } catch (error) {
        showError("Invalid input");
    }
    animatePress(display);
}

function calculateFactorial() {
    try {
        const num = parseFloat(currentInput);
        if (num < 0 || !Number.isInteger(num)) {
            showError("Positive integers only");
            return;
        }
        if (num > 20) { // Practical limit for factorial calculation
            showError("Number too large");
            return;
        }
        currentInput = math.factorial(num).toString();
        updateDisplay();
        showSuccess();
    } catch (error) {
        showError("Invalid input");
    }
    animatePress(display);
}

function calculateResult() {
    try {
        // Handle percentage calculations
        if (currentInput.includes('%')) {
            const parts = currentInput.split('%');
            if (parts.length === 2 && parts[1] === '') {
                currentInput = (parseFloat(parts[0]) / 100).toString();
            } else if (parts.length === 2) {
                const num1 = parseFloat(parts[0]);
                const num2 = parseFloat(parts[1]);
                currentInput = (num1 * num2 / 100).toString();
            }
        } else {
            // Evaluate the expression using math.js
            currentInput = math.evaluate(currentInput).toString();
        }
        updateDisplay();
        showSuccess();
    } catch (error) {
        showError("Invalid expression");
    }
    animatePress(display);
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    
    const darkModeBtn = document.querySelector('.dark-mode-toggle');
    darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
    animatePress(darkModeBtn);
}

function animatePress(element) {
    element.style.animation = 'none';
    void element.offsetWidth; // Trigger reflow
    element.style.animation = 'press 0.3s ease';
}

function showError(message = "Error") {
    currentInput = message;
    updateDisplay();
    display.style.animation = 'none';
    void display.offsetWidth;
    display.style.animation = 'error 0.5s ease';
    
    setTimeout(() => {
        currentInput = '0';
        updateDisplay();
    }, 1000);
}

function showSuccess() {
    display.style.animation = 'none';
    void display.offsetWidth;
    display.style.animation = 'success 0.5s ease';
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        userValue(key);
    } else if (key === '.') {
        userValue('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '^' || key === '%') {
        userValue(key);
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLastDigit();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '!') {
        calculateFactorial();
    } else if (key === 'l' || key === 'L') {
        calculateLog();
    } else if (key === 's' || key === 'S') {
        calculateSquareRoot();
    } else if (key === 'd' || key === 'D') {
        toggleDarkMode();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counterDisplay');
    const targetInput = document.getElementById('targetInput');
    const startBtn = document.getElementById('startBtn');

    let currentCount = 0;
    let targetCount = 0;
    let isCounting = false;
    let animationFrame;

    function createDigitElement(value) {
        const container = document.createElement('div');
        container.className = 'digit-container';

        const face = document.createElement('div');
        face.className = 'digit-face';
        face.textContent = value;

        container.appendChild(face);
        return container;
    }

    function updateDisplay(number) {
        const numStr = Math.floor(number).toString();
        const existingDigits = counterDisplay.querySelectorAll('.digit-container');

        // Adjust number of digits if needed
        if (existingDigits.length !== numStr.length) {
            counterDisplay.innerHTML = '';
            for (let i = 0; i < numStr.length; i++) {
                counterDisplay.appendChild(createDigitElement(numStr[i]));
            }
        } else {
            // Update existing digits
            numStr.split('').forEach((digit, i) => {
                const digitFace = existingDigits[i].querySelector('.digit-face');
                if (digitFace.textContent !== digit) {
                    digitFace.textContent = digit;

                    // Trigger 3D animation
                    existingDigits[i].classList.remove('digit-flip');
                    void existingDigits[i].offsetWidth; // Trigger reflow
                    existingDigits[i].classList.add('digit-flip');
                }
            });
        }
    }

    function startCounting() {
        const value = parseInt(targetInput.value);
        if (isNaN(value) || value < 0) {
            alert('Please enter a valid positive number');
            return;
        }

        if (isCounting) {
            cancelAnimationFrame(animationFrame);
        }

        targetCount = value;
        currentCount = 0; // Starting from 0 to the input
        isCounting = true;

        // Reset display
        updateDisplay(currentCount);

        const startTime = performance.now();
        const duration = Math.min(2000, targetCount * 50); // Dynamic duration but max 2s

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad)
            const easedProgress = 1 - (1 - progress) * (1 - progress);

            const nextValue = Math.floor(easedProgress * targetCount);

            if (nextValue !== currentCount) {
                currentCount = nextValue;
                updateDisplay(currentCount);
            }

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                isCounting = false;
                // Final update to ensure we hit the target exactly
                updateDisplay(targetCount);
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    startBtn.addEventListener('click', startCounting);

    // Initial state
    updateDisplay(0);
});

// ============================================
// UTILITY FUNCTIONS - Date Calculations
// ============================================

/**
 * Check if a year is a leap year
 * Leap year: divisible by 4, not by 100, unless divisible by 400
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get days in a specific month
 */
function getDaysInMonth(year, month) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) return 29;
    return daysInMonth[month];
}

/**
 * Calculate precise age difference between two dates
 * Returns: { years, months, days }
 */
function calculateDateDifference(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = endDate.getMonth() === 0 ? 11 : endDate.getMonth() - 1;
        const prevYear = endDate.getMonth() === 0 ? endDate.getFullYear() - 1 : endDate.getFullYear();
        days += getDaysInMonth(prevYear, prevMonth);
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

/**
 * Calculate total days between two dates
 */
function calculateTotalDays(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total months lived
 */
function calculateTotalMonths(startDate, endDate) {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    return years * 12 + months;
}

/**
 * Count leap years between two dates
 */
function countLeapYears(startDate, endDate) {
    let count = 0;
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    for (let year = startYear; year <= endYear; year++) {
        if (isLeapYear(year)) count++;
    }
    return count;
}

/**
 * Get next birthday and days remaining
 */
function getNextBirthday(birthDate) {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    // If birthday already passed this year, get next year's birthday
    if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const daysUntil = calculateTotalDays(today, nextBirthday);
    const dayOfWeek = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });
    
    return { date: nextBirthday, daysUntil, dayOfWeek };
}

/**
 * Get zodiac sign from date
 */
function getZodiacSign(month, day) {
    const signs = [
        { name: '♑ Capricorn', end: [1, 19] },
        { name: '♒ Aquarius', end: [2, 18] },
        { name: '♓ Pisces', end: [3, 20] },
        { name: '♈ Aries', end: [4, 19] },
        { name: '♉ Taurus', end: [5, 20] },
        { name: '♊ Gemini', end: [6, 20] },
        { name: '♋ Cancer', end: [7, 22] },
        { name: '♌ Leo', end: [8, 22] },
        { name: '♍ Virgo', end: [9, 22] },
        { name: '♎ Libra', end: [10, 22] },
        { name: '♏ Scorpio', end: [11, 21] },
        { name: '♐ Sagittarius', end: [12, 21] },
        { name: '♑ Capricorn', end: [12, 31] }
    ];
    
    for (let sign of signs) {
        if (month < sign.end[0] || (month === sign.end[0] && day <= sign.end[1])) {
            return sign.name;
        }
    }
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Validate date input
 */
function validateDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// ============================================
// AGE CALCULATOR
// ============================================

document.getElementById('ageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dobInput = document.getElementById('dob').value;
    const resultDiv = document.getElementById('ageResult');
    const errorDiv = document.getElementById('ageError');
    
    // Clear previous results
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(dobInput)) {
        errorDiv.innerHTML = '❌ Please enter a valid date.';
        return;
    }
    
    const dob = new Date(dobInput);
    const today = new Date();
    
    // Check if date is in the future
    if (dob > today) {
        errorDiv.innerHTML = '❌ Birth date cannot be in the future!';
        return;
    }
    
    // Calculate age
    const age = calculateDateDifference(dob, today);
    const totalDays = calculateTotalDays(dob, today);
    const totalMonths = calculateTotalMonths(dob, today);
    const leapYears = countLeapYears(dob, today);
    const nextBirthday = getNextBirthday(dob);
    const zodiac = getZodiacSign(dob.getMonth() + 1, dob.getDate());
    
    // Calculate time lived in different units
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    
    // Life percentage (assuming 80 years average lifespan)
    const lifePercentage = ((age.years / 80) * 100).toFixed(2);
    
    resultDiv.innerHTML = `
        <h3>🎉 Your Age Details</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${age.years}</span>
                <span class="label">Years</span>
            </div>
            <div class="result-item">
                <span class="value">${age.months}</span>
                <span class="label">Months</span>
            </div>
            <div class="result-item">
                <span class="value">${age.days}</span>
                <span class="label">Days</span>
            </div>
        </div>
        
        <div class="result-grid" style="margin-top: 1rem;">
            <div class="result-item">
                <span class="value">${formatNumber(totalDays)}</span>
                <span class="label">Total Days Lived</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalMonths)}</span>
                <span class="label">Total Months</span>
            </div>
            <div class="result-item">
                <span class="value">${leapYears}</span>
                <span class="label">Leap Years</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border);">
            <p><strong>🎂 Next Birthday:</strong> ${nextBirthday.daysUntil} days (${nextBirthday.dayOfWeek})</p>
            <p><strong>⭐ Zodiac Sign:</strong> ${zodiac}</p>
            <p><strong>⏱️ You've lived:</strong> ${formatNumber(totalHours)} hours, ${formatNumber(totalMinutes)} minutes</p>
        </div>
        
        <div style="margin-top: 1rem;">
            <p style="color: var(--text-secondary); font-size: 0.875rem;">Life Progress (avg. 80 years): ${lifePercentage}%</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(lifePercentage, 100)}%"></div>
            </div>
        </div>
        
        <button class="copy-btn" onclick="copyResult('age')">📋 Copy Result</button>
    `;
    
    // Show live counter
    startLiveCounter(dob);
});

// ============================================
// DATE DIFFERENCE CALCULATOR
// ============================================

document.getElementById('diffForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;
    const resultDiv = document.getElementById('diffResult');
    const errorDiv = document.getElementById('diffError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(startInput) || !validateDate(endInput)) {
        errorDiv.innerHTML = '❌ Please enter valid dates.';
        return;
    }
    
    let startDate = new Date(startInput);
    let endDate = new Date(endInput);
    
    // Auto-swap if end date is before start date
    if (endDate < startDate) {
        [startDate, endDate] = [endDate, startDate];
    }
    
    const difference = calculateDateDifference(startDate, endDate);
    const totalDays = calculateTotalDays(startDate, endDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = calculateTotalMonths(startDate, endDate);
    
    if (totalDays === 0) {
        resultDiv.innerHTML = `
            <h3>📅 Same Date!</h3>
            <p style="font-size: 1.25rem; text-align: center; margin-top: 1rem;">Both dates are the same.</p>
        `;
        return;
    }
    
    resultDiv.innerHTML = `
        <h3>📊 Date Difference</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${difference.years}</span>
                <span class="label">Years</span>
            </div>
            <div class="result-item">
                <span class="value">${difference.months}</span>
                <span class="label">Months</span>
            </div>
            <div class="result-item">
                <span class="value">${difference.days}</span>
                <span class="label">Days</span>
            </div>
        </div>
        
        <div class="result-grid" style="margin-top: 1rem;">
            <div class="result-item">
                <span class="value">${formatNumber(totalDays)}</span>
                <span class="label">Total Days</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalWeeks)}</span>
                <span class="label">Total Weeks</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalMonths)}</span>
                <span class="label">Total Months</span>
            </div>
        </div>
        
        <button class="copy-btn" onclick="copyResult('diff')">📋 Copy Result</button>
    `;
});

// ============================================
// TIME BETWEEN CALCULATOR
// ============================================

document.getElementById('timeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const startInput = document.getElementById('startDateTime').value;
    const endInput = document.getElementById('endDateTime').value;
    const resultDiv = document.getElementById('timeResult');
    const errorDiv = document.getElementById('timeError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!startInput || !endInput) {
        errorDiv.innerHTML = '❌ Please enter both date and time values.';
        return;
    }
    
    let startDate = new Date(startInput);
    let endDate = new Date(endInput);
    
    if (endDate < startDate) {
        [startDate, endDate] = [endDate, startDate];
    }
    
    const diffMs = endDate - startDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    const hours = diffHours % 24;
    const minutes = diffMinutes % 60;
    const seconds = diffSeconds % 60;
    
    resultDiv.innerHTML = `
        <h3>⏱️ Time Difference</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${diffDays}</span>
                <span class="label">Days</span>
            </div>
            <div class="result-item">
                <span class="value">${hours}</span>
                <span class="label">Hours</span>
            </div>
            <div class="result-item">
                <span class="value">${minutes}</span>
                <span class="label">Minutes</span>
            </div>
            <div class="result-item">
                <span class="value">${seconds}</span>
                <span class="label">Seconds</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border: 1px solid var(--border);">
            <p><strong>Total:</strong> ${formatNumber(diffHours)} hours, ${formatNumber(diffMinutes)} minutes, ${formatNumber(diffSeconds)} seconds</p>
        </div>
        
        <button class="copy-btn" onclick="copyResult('time')">📋 Copy Result</button>
    `;
});

// ============================================
// WEEK CALCULATOR
// ============================================

document.getElementById('weekForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById('weekDate').value;
    const resultDiv = document.getElementById('weekResult');
    const errorDiv = document.getElementById('weekError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(dateInput)) {
        errorDiv.innerHTML = '❌ Please enter a valid date.';
        return;
    }
    
    const date = new Date(dateInput);
    
    // Get week number
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    // Get day info
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfYear = days + 1;
    const daysInYear = isLeapYear(date.getFullYear()) ? 366 : 365;
    const daysRemaining = daysInYear - dayOfYear;
    
    // Get quarter
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    
    resultDiv.innerHTML = `
        <h3>📅 Date Information</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${weekNumber}</span>
                <span class="label">Week of Year</span>
            </div>
            <div class="result-item">
                <span class="value">${dayOfYear}</span>
                <span class="label">Day of Year</span>
            </div>
            <div class="result-item">
                <span class="value">Q${quarter}</span>
                <span class="label">Quarter</span>
            </div>
            <div class="result-item">
                <span class="value">${daysRemaining}</span>
                <span class="label">Days Remaining</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border: 1px solid var(--border);">
            <p><strong>Day of Week:</strong> ${dayOfWeek}</p>
            <p><strong>Year Type:</strong> ${isLeapYear(date.getFullYear()) ? 'Leap Year (366 days)' : 'Regular Year (365 days)'}</p>
        </div>
        
        <button class="copy-btn" onclick="copyResult('week')">📋 Copy Result</button>
    `;
});

// ============================================
// AGE COMPARISON
// ============================================

document.getElementById('compareForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const person1Input = document.getElementById('person1DOB').value;
    const person2Input = document.getElementById('person2DOB').value;
    const resultDiv = document.getElementById('compareResult');
    const errorDiv = document.getElementById('compareError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(person1Input) || !validateDate(person2Input)) {
        errorDiv.innerHTML = '❌ Please enter valid dates.';
        return;
    }
    
    const person1DOB = new Date(person1Input);
    const person2DOB = new Date(person2Input);
    const today = new Date();
    
    if (person1DOB > today || person2DOB > today) {
        errorDiv.innerHTML = '❌ Birth dates cannot be in the future!';
        return;
    }
    
    const age1 = calculateDateDifference(person1DOB, today);
    const age2 = calculateDateDifference(person2DOB, today);
    
    let older, younger, ageDiff;
    if (person1DOB < person2DOB) {
        older = { age: age1, label: 'Person 1' };
        younger = { age: age2, label: 'Person 2' };
        ageDiff = calculateDateDifference(person1DOB, person2DOB);
    } else {
        older = { age: age2, label: 'Person 2' };
        younger = { age: age1, label: 'Person 1' };
        ageDiff = calculateDateDifference(person2DOB, person1DOB);
    }
    
    const daysDiff = calculateTotalDays(person1DOB < person2DOB ? person1DOB : person2DOB, 
                                        person1DOB < person2DOB ? person2DOB : person1DOB);
    
    resultDiv.innerHTML = `
        <h3>👥 Age Comparison</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${age1.years}</span>
                <span class="label">Person 1 Age (Years)</span>
            </div>
            <div class="result-item">
                <span class="value">${age2.years}</span>
                <span class="label">Person 2 Age (Years)</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--bg-secondary); border: 2px solid var(--accent);">
            <h4 style="text-align: center; margin-bottom: 1rem; color: var(--accent);">Age Difference</h4>
            <p style="text-align: center; font-size: 1.25rem;"><strong>${ageDiff.years} years, ${ageDiff.months} months, ${ageDiff.days} days</strong></p>
            <p style="text-align: center; margin-top: 0.5rem; color: var(--text-secondary);">(${formatNumber(daysDiff)} total days)</p>
            <p style="text-align: center; margin-top: 1rem;">${older.label} is older</p>
        </div>
        
        <button class="copy-btn" onclick="copyResult('compare')">📋 Copy Result</button>
    `;
});

// ============================================
// HISTORICAL DATE CALCULATOR
// ============================================

document.getElementById('historicalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById('historicalDate').value;
    const resultDiv = document.getElementById('historicalResult');
    const errorDiv = document.getElementById('historicalError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(dateInput)) {
        errorDiv.innerHTML = '❌ Please enter a valid date.';
        return;
    }
    
    const historicalDate = new Date(dateInput);
    const today = new Date();
    
    const isPast = historicalDate < today;
    const difference = isPast ? 
        calculateDateDifference(historicalDate, today) : 
        calculateDateDifference(today, historicalDate);
    
    const totalDays = calculateTotalDays(historicalDate, today);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = calculateTotalMonths(historicalDate < today ? historicalDate : today, 
                                             historicalDate < today ? today : historicalDate);
    const totalYears = difference.years;
    
    // Calculate decades and centuries
    const decades = Math.floor(totalYears / 10);
    const centuries = Math.floor(totalYears / 100);
    
    const timeLabel = isPast ? 'ago' : 'from now';
    
    resultDiv.innerHTML = `
        <h3>📜 Historical Date Analysis</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${difference.years}</span>
                <span class="label">Years ${timeLabel}</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalDays)}</span>
                <span class="label">Total Days</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalWeeks)}</span>
                <span class="label">Total Weeks</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalMonths)}</span>
                <span class="label">Total Months</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border: 1px solid var(--border);">
            <p><strong>Full Difference:</strong> ${difference.years} years, ${difference.months} months, ${difference.days} days</p>
            ${decades > 0 ? `<p><strong>Decades:</strong> ${decades} decade${decades > 1 ? 's' : ''}</p>` : ''}
            ${centuries > 0 ? `<p><strong>Centuries:</strong> ${centuries} centur${centuries > 1 ? 'ies' : 'y'}</p>` : ''}
            <p><strong>Status:</strong> ${isPast ? 'This date has passed' : 'This date is in the future'}</p>
        </div>
        
        <button class="copy-btn" onclick="copyResult('historical')">📋 Copy Result</button>
    `;
});

// ============================================
// COUNTDOWN CALCULATOR
// ============================================

document.getElementById('countdownForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const futureDateInput = document.getElementById('futureDate').value;
    const resultDiv = document.getElementById('countdownResult');
    const errorDiv = document.getElementById('countdownError');
    
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!validateDate(futureDateInput)) {
        errorDiv.innerHTML = '❌ Please enter a valid date.';
        return;
    }
    
    const futureDate = new Date(futureDateInput);
    const today = new Date();
    
    // Check if date is today
    if (futureDate.toDateString() === today.toDateString()) {
        resultDiv.innerHTML = `
            <h3>🎯 Today!</h3>
            <p style="font-size: 1.25rem; text-align: center; margin-top: 1rem;">The selected date is today!</p>
        `;
        return;
    }
    
    // Check if date is in the past
    if (futureDate < today) {
        const daysPassed = calculateTotalDays(futureDate, today);
        resultDiv.innerHTML = `
            <h3>⏮️ Date Has Passed</h3>
            <p style="font-size: 1.25rem; text-align: center; margin-top: 1rem;">This date was ${formatNumber(daysPassed)} days ago.</p>
        `;
        return;
    }
    
    const difference = calculateDateDifference(today, futureDate);
    const totalDays = calculateTotalDays(today, futureDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const dayOfWeek = futureDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    resultDiv.innerHTML = `
        <h3>⏳ Countdown to ${futureDate.toLocaleDateString()}</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="value">${difference.years}</span>
                <span class="label">Years</span>
            </div>
            <div class="result-item">
                <span class="value">${difference.months}</span>
                <span class="label">Months</span>
            </div>
            <div class="result-item">
                <span class="value">${difference.days}</span>
                <span class="label">Days</span>
            </div>
        </div>
        
        <div class="result-grid" style="margin-top: 1rem;">
            <div class="result-item">
                <span class="value">${formatNumber(totalDays)}</span>
                <span class="label">Total Days</span>
            </div>
            <div class="result-item">
                <span class="value">${formatNumber(totalWeeks)}</span>
                <span class="label">Total Weeks</span>
            </div>
            <div class="result-item">
                <span class="value">${dayOfWeek}</span>
                <span class="label">Day of Week</span>
            </div>
        </div>
        
        <button class="copy-btn" onclick="copyResult('countdown')">📋 Copy Result</button>
    `;
});

// ============================================
// LIVE COUNTER (Advanced Feature)
// ============================================

let liveCounterInterval = null;

function startLiveCounter(birthDate) {
    const section = document.getElementById('liveCounterSection');
    const counterDiv = document.getElementById('liveCounter');
    
    section.style.display = 'block';
    
    // Clear existing interval
    if (liveCounterInterval) {
        clearInterval(liveCounterInterval);
    }
    
    function updateCounter() {
        const now = new Date();
        const totalSeconds = Math.floor((now - birthDate) / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        counterDiv.innerHTML = `
            <h3>⚡ You've Been Alive For:</h3>
            <div class="counter-grid">
                <div class="counter-item">
                    <div class="counter-value">${formatNumber(totalDays)}</div>
                    <div class="counter-label">Days</div>
                </div>
                <div class="counter-item">
                    <div class="counter-value">${formatNumber(totalHours)}</div>
                    <div class="counter-label">Hours</div>
                </div>
                <div class="counter-item">
                    <div class="counter-value">${formatNumber(totalMinutes)}</div>
                    <div class="counter-label">Minutes</div>
                </div>
                <div class="counter-item">
                    <div class="counter-value">${formatNumber(totalSeconds)}</div>
                    <div class="counter-label">Seconds</div>
                </div>
            </div>
        `;
    }
    
    updateCounter();
    liveCounterInterval = setInterval(updateCounter, 1000);
}

// ============================================
// UTILITY FUNCTIONS - UI
// ============================================

function clearForm(formId) {
    document.getElementById(formId).reset();
    
    const formMap = {
        'ageForm': { result: 'ageResult', error: 'ageError' },
        'diffForm': { result: 'diffResult', error: 'diffError' },
        'countdownForm': { result: 'countdownResult', error: 'countdownError' },
        'timeForm': { result: 'timeResult', error: 'timeError' },
        'weekForm': { result: 'weekResult', error: 'weekError' },
        'compareForm': { result: 'compareResult', error: 'compareError' },
        'historicalForm': { result: 'historicalResult', error: 'historicalError' }
    };
    
    if (formMap[formId]) {
        document.getElementById(formMap[formId].result).innerHTML = '';
        document.getElementById(formMap[formId].error).innerHTML = '';
    }
    
    if (formId === 'ageForm') {
        document.getElementById('liveCounterSection').style.display = 'none';
        if (liveCounterInterval) clearInterval(liveCounterInterval);
    }
}

function copyResult(type) {
    let text = '';
    
    const resultMap = {
        'age': 'ageResult',
        'diff': 'diffResult',
        'countdown': 'countdownResult',
        'time': 'timeResult',
        'week': 'weekResult',
        'compare': 'compareResult',
        'historical': 'historicalResult'
    };
    
    const resultDiv = document.getElementById(resultMap[type]);
    if (resultDiv) {
        text = resultDiv.innerText;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ============================================
// DARK MODE TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// ============================================
// INITIALIZATION
// ============================================

// Set max date for date inputs to today (prevent future dates for DOB)
const today = new Date().toISOString().split('T')[0];
document.getElementById('dob').setAttribute('max', today);

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('⏰ Time & Age Precision Calculator initialized successfully!');

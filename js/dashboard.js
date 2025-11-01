let appData = {
    profile: {
        name: '',
        weight: null,
        height: null,
        age: null
    },
    goals: {
        steps: 10000,
        calories: 2000
    },
    activities: []
};

document.addEventListener('DOMContentLoaded', () => {

    initDarkMode();
    initDate();
    initActivityForm();
    initProfileForm();
    initGoals();
    initChart();
    initLogout();

    updateBMI();
    updateDashboard();
});

function initDarkMode() {
    document.documentElement.setAttribute('data-theme', 'light');
    updateDarkModeIcon('light');

    document.getElementById('darkModeToggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateDarkModeIcon(newTheme);
    });
}

function updateDarkModeIcon(theme) {
    const icon = document.getElementById('darkModeIcon');
    if (!icon) return;
    
    if (theme === 'dark') {
        icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    } else {
        icon.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    }
}

function initDate() {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;
    
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('en-US', options);
}

function initActivityForm() {
    const form = document.getElementById('activityForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('activityType').value;
        const durationInput = document.getElementById('activityDuration').value;
        const caloriesInput = document.getElementById('activityCalories').value;
        const stepsInput = document.getElementById('activitySteps').value;

        if (!type || !durationInput || !caloriesInput || !stepsInput) {
            alert('Please fill all fields');
            return;
        }

        const duration = parseInt(durationInput);
        const calories = parseInt(caloriesInput);
        const steps = parseInt(stepsInput);

        if (isNaN(duration) || duration <= 0) {
            alert('Please enter a valid duration');
            return;
        }

        if (isNaN(calories) || calories < 0) {
            alert('Please enter a valid calorie amount');
            return;
        }

        if (isNaN(steps) || steps < 0) {
            alert('Please enter a valid step count');
            return;
        }

        const activity = {
            id: Date.now(),
            type: type,
            duration: duration,
            calories: calories,
            steps: steps,
            date: new Date().toISOString()
        };

        appData.activities.push(activity);

        form.reset();

        updateDashboard();
        updateChart();
    });
}

function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('profileName').value.trim();
        const weightInput = document.getElementById('profileWeight').value;
        const heightInput = document.getElementById('profileHeight').value;
        const ageInput = document.getElementById('profileAge').value;

        appData.profile.name = name;
        
        if (weightInput && !isNaN(parseFloat(weightInput)) && parseFloat(weightInput) > 0) {
            appData.profile.weight = parseFloat(weightInput);
        } else {
            appData.profile.weight = null;
        }
        
        if (heightInput && !isNaN(parseFloat(heightInput)) && parseFloat(heightInput) > 0) {
            appData.profile.height = parseFloat(heightInput);
        } else {
            appData.profile.height = null;
        }
        
        if (ageInput && !isNaN(parseInt(ageInput)) && parseInt(ageInput) > 0) {
            appData.profile.age = parseInt(ageInput);
        } else {
            appData.profile.age = null;
        }

        updateBMI();
    });
}

function updateBMI() {
    const weight = appData.profile.weight;
    const height = appData.profile.height;

    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');

    if (!bmiValueEl || !bmiCategoryEl) return;

    if (weight && height && height > 0) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        
    
        animateBMINumber(bmi);
        
        let category = '';
        let color = '';
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
        } else if (bmi < 25) {
            category = 'Normal';
            color = '#10b981';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
        } else {
            category = 'Obese';
            color = '#ef4444';
        }
        
        bmiCategoryEl.textContent = category;
        bmiValueEl.style.color = color;
    } else {
        bmiValueEl.textContent = '--';
        bmiCategoryEl.textContent = 'Enter weight and height';
    }
}

function animateBMINumber(targetValue) {
    const element = document.getElementById('bmiValue');
    if (!element) return;
    
    const currentValue = parseFloat(element.textContent) || 0;
    if (isNaN(currentValue)) {
        element.textContent = targetValue;
        return;
    }

    const increment = (targetValue - currentValue) / 20;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1);
    }, 30);
}

function initGoals() {
    const saveBtn = document.getElementById('saveGoalsBtn');
    if (!saveBtn) return;
    
    saveBtn.addEventListener('click', () => {
        const stepsGoalInput = document.getElementById('stepsGoal').value;
        const caloriesGoalInput = document.getElementById('caloriesGoal').value;

        if (stepsGoalInput && !isNaN(parseInt(stepsGoalInput)) && parseInt(stepsGoalInput) > 0) {
            appData.goals.steps = parseInt(stepsGoalInput);
        }

        if (caloriesGoalInput && !isNaN(parseInt(caloriesGoalInput)) && parseInt(caloriesGoalInput) > 0) {
            appData.goals.calories = parseInt(caloriesGoalInput);
        }

        updateDashboard();
    });
}

function updateDashboard() {
 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayActivities = appData.activities.filter(act => {
        const actDate = new Date(act.date);
        return actDate >= today && actDate <= todayEnd;
    });

    const totalSteps = todayActivities.reduce((sum, act) => sum + (act.steps || 0), 0);
    const totalCalories = todayActivities.reduce((sum, act) => sum + (act.calories || 0), 0);
    const totalMinutes = todayActivities.reduce((sum, act) => sum + (act.duration || 0), 0);

    animateNumber('stepsCount', totalSteps);
    animateNumber('caloriesCount', totalCalories);
    animateNumber('minutesCount', totalMinutes);

    const stepsGoal = appData.goals.steps || 10000;
    const caloriesGoal = appData.goals.calories || 2000;

    const stepsProgress = stepsGoal > 0 ? Math.min((totalSteps / stepsGoal) * 100, 100) : 0;
    const caloriesProgress = caloriesGoal > 0 ? Math.min((totalCalories / caloriesGoal) * 100, 100) : 0;

    const stepsProgressPercentEl = document.getElementById('stepsProgressPercent');
    const caloriesProgressPercentEl = document.getElementById('caloriesProgressPercent');
    const stepsProgressBarEl = document.getElementById('stepsProgressBar');
    const caloriesProgressBarEl = document.getElementById('caloriesProgressBar');

    if (stepsProgressPercentEl) {
        stepsProgressPercentEl.textContent = Math.round(stepsProgress) + '%';
    }
    if (caloriesProgressPercentEl) {
        caloriesProgressPercentEl.textContent = Math.round(caloriesProgress) + '%';
    }
    if (stepsProgressBarEl) {
        stepsProgressBarEl.style.width = stepsProgress + '%';
    }
    if (caloriesProgressBarEl) {
        caloriesProgressBarEl.style.width = caloriesProgress + '%';
    }

    updateActivitiesList();
}

function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentText = element.textContent.replace(/,/g, '');
    const currentValue = parseInt(currentText) || 0;
    
    if (currentValue === targetValue) return;

    const increment = (targetValue - currentValue) / 20;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current).toLocaleString();
        element.classList.add('count-up');
    }, 20);
}

function updateActivitiesList() {
    const activities = appData.activities.slice().sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    }).slice(0, 10);

    const listEl = document.getElementById('activitiesList');
    if (!listEl) return;
    
    if (activities.length === 0) {
        listEl.innerHTML = '<p class="empty-message">No activities yet. Add one above!</p>';
        return;
    }

    listEl.innerHTML = activities.map(activity => {
        const date = new Date(activity.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="activity-type">${activity.type}</span>
                    <span class="activity-date">${dateStr} at ${timeStr}</span>
                </div>
                <div class="activity-stat">
                    <strong>${activity.duration}</strong><br>
                    <small>min</small>
                </div>
                <div class="activity-stat">
                    <strong>${activity.calories}</strong><br>
                    <small>kcal</small>
                </div>
                <div class="activity-stat">
                    <strong>${activity.steps}</strong><br>
                    <small>steps</small>
                </div>
                <button class="delete-btn" onclick="deleteActivity(${activity.id})">🗑️ Delete</button>
            </div>
        `;
    }).join('');
}

function deleteActivity(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    appData.activities = appData.activities.filter(act => act.id !== activityId);
    updateDashboard();
    updateChart();
}

window.deleteActivity = deleteActivity;

let activityChart = null;

function initChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    updateChart();
}

function updateChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    const activities = appData.activities.slice().sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const labels = activities.map(act => act.type);
    const caloriesData = activities.map(act => act.calories);

    if (activityChart) {
        activityChart.destroy();
    }

    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['No activities yet'],
            datasets: [{
                label: 'Calories',
                data: caloriesData.length > 0 ? caloriesData : [0],
                backgroundColor: gradient,
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const activity = activities[context.dataIndex];
                            if (activity) {
                                return `Calories: ${activity.calories} kcal | Duration: ${activity.duration} min | Steps: ${activity.steps}`;
                            }
                            return `Calories: ${context.parsed.y} kcal`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
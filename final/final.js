let currentStep = 1;
let assessmentData = {};
let tmtStartTime = null;
let tmtCurrentNumber = 1;
let tmtCompleted = false;

const fesQuestions = [
    "Cleaning the house (e.g. sweep, vacuum, or dust)",
    "Getting dressed or undressed",
    "Preparing simple meals",
    "Taking a bath or shower",
    "Going to the shop",
    "Getting in or out of a chair",
    "Going up or down stairs"
];

// Initialize FES questions
function initializeFESQuestions() {
    const container = document.getElementById('fesQuestions');
    fesQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <label>${question}</label>
            <div class="likert-scale">
                <div class="likert-option" data-value="1" onclick="selectLikert(this, 'fes${index + 1}', 1)">
                    <div>Not at all concerned</div>
                    <div><strong>1</strong></div>
                </div>
                <div class="likert-option" data-value="2" onclick="selectLikert(this, 'fes${index + 1}', 2)">
                    <div>Somewhat concerned</div>
                    <div><strong>2</strong></div>
                </div>
                <div class="likert-option" data-value="3" onclick="selectLikert(this, 'fes${index + 1}', 3)">
                    <div>Fairly concerned</div>
                    <div><strong>3</strong></div>
                </div>
                <div class="likert-option" data-value="4" onclick="selectLikert(this, 'fes${index + 1}', 4)">
                    <div>Very concerned</div>
                    <div><strong>4</strong></div>
                </div>
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

function selectLikert(element, questionId, value) {
    // Remove selected class from siblings
    element.parentNode.querySelectorAll('.likert-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    // Add selected class to clicked option
    element.classList.add('selected');
    // Store the value
    assessmentData[questionId] = value;
}

// Initialize TMT grid
function initializeTMT() {
    const grid = document.getElementById('tmtGrid');
    const numbers = Array.from({length: 13}, (_, i) => i + 1);
    
    // Shuffle positions for random layout
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    
    shuffled.forEach(num => {
        const circle = document.createElement('div');
        circle.className = 'tmt-circle';
        circle.textContent = num;
        circle.dataset.number = num;
        circle.onclick = () => clickTMTNumber(num, circle);
        grid.appendChild(circle);
    });
}

function startTMT() {
    tmtStartTime = Date.now();
    tmtCurrentNumber = 1;
    tmtCompleted = false;
    
    document.getElementById('tmtStartBtn').style.display = 'none';
    document.querySelector('[data-number="1"]').classList.add('current');
    
    updateTMTTimer();
}

function updateTMTTimer() {
    if (!tmtStartTime || tmtCompleted) return;
    
    const elapsed = (Date.now() - tmtStartTime) / 1000;
    document.getElementById('tmtTimer').textContent = `Time: ${elapsed.toFixed(1)}s`;
    
    requestAnimationFrame(updateTMTTimer);
}

function clickTMTNumber(number, element) {
    if (!tmtStartTime || tmtCompleted) return;
    
    if (number === tmtCurrentNumber) {
        element.classList.remove('current');
        element.classList.add('completed');
        
        tmtCurrentNumber++;
        
        if (tmtCurrentNumber <= 13) {
            document.querySelector(`[data-number="${tmtCurrentNumber}"]`).classList.add('current');
        } else {
            // Test completed
            tmtCompleted = true;
            const totalTime = (Date.now() - tmtStartTime) / 1000;
            assessmentData.tmtTime = totalTime;
            
            document.getElementById('tmtTimer').textContent = `Completed in ${totalTime.toFixed(1)}s`;
            document.getElementById('tmtNextBtn').disabled = false;
        }
    }
}

function nextStep() {
    if (!validateCurrentStep()) return;
    
    collectCurrentStepData();
    
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    updateProgress();
    
    if (currentStep === 5) {
        calculateResults();
    }
}

function prevStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
}

function validateCurrentStep() {
    if (currentStep === 1) {
        return document.getElementById('age').value && 
               document.getElementById('gender').value && 
               document.getElementById('height').value && 
               document.getElementById('weight').value;
    } else if (currentStep === 2) {
        return fesQuestions.every((_, i) => assessmentData[`fes${i + 1}`]);
    } else if (currentStep === 4) {
        return tmtCompleted;
    }
    return true;
}

function collectCurrentStepData() {
    if (currentStep === 1) {
        assessmentData.age = parseInt(document.getElementById('age').value);
        assessmentData.gender = document.getElementById('gender').value;
        assessmentData.height = parseInt(document.getElementById('height').value);
        assessmentData.weight = parseInt(document.getElementById('weight').value);
        assessmentData.bmi = assessmentData.weight / ((assessmentData.height / 100) ** 2);
    } else if (currentStep === 3) {
        assessmentData.ipaq1a = parseInt(document.getElementById('ipaq1a').value) || 0;
        assessmentData.ipaq1b = parseInt(document.getElementById('ipaq1b').value) || 0;
        assessmentData.ipaq2a = parseInt(document.getElementById('ipaq2a').value) || 0;
        assessmentData.ipaq2b = parseInt(document.getElementById('ipaq2b').value) || 0;
    }
}

function updateProgress() {
    const progress = (currentStep / 5) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function calculateResults() {
    // Calculate FES total score
    let fesTotal = 0;
    fesQuestions.forEach((_, i) => {
        fesTotal += assessmentData[`fes${i + 1}`] || 1;
    });
    assessmentData.fesTotal = fesTotal;
    
    // Calculate IPAQ score (simplified MET calculation)
    const vigorousMets = assessmentData.ipaq1a * assessmentData.ipaq1b * 8;
    const moderateMets = assessmentData.ipaq2a * assessmentData.ipaq2b * 4;
    assessmentData.ipaqScore = vigorousMets + moderateMets;
    
    // Predict Mini-BESTest score using simplified model
    let predictedScore = 28; // Base score
    
    // Age factor
    if (assessmentData.age > 65) predictedScore -= 3;
    else if (assessmentData.age > 45) predictedScore -= 1;
    
    // BMI factor
    if (assessmentData.bmi > 30) predictedScore -= 2;
    else if (assessmentData.bmi < 18.5) predictedScore -= 1;
    
    // FES factor (higher concern = lower balance)
    if (fesTotal > 14) predictedScore -= 4;
    else if (fesTotal > 10) predictedScore -= 2;
    
    // TMT factor (slower = lower balance)
    if (assessmentData.tmtTime > 30) predictedScore -= 3;
    else if (assessmentData.tmtTime > 20) predictedScore -= 1;
    
    // Physical activity factor
    if (assessmentData.ipaqScore > 3000) predictedScore += 2;
    else if (assessmentData.ipaqScore < 600) predictedScore -= 2;
    
    // Ensure score is within valid range
    predictedScore = Math.max(0, Math.min(28, predictedScore));
    
    displayResults(predictedScore);
}

function displayResults(score) {
    document.getElementById('predictedScore').textContent = score;
    
    let interpretation = '';
    let recommendations = '';
    
    if (score >= 24) {
        interpretation = 'Excellent balance! Low fall risk.';
        recommendations = 'Continue your current activity level and consider challenging balance exercises.';
    } else if (score >= 20) {
        interpretation = 'Good balance with mild impairment.';
        recommendations = 'Consider balance training exercises and regular physical activity.';
    } else if (score >= 16) {
        interpretation = 'Moderate balance impairment. Increased fall risk.';
        recommendations = 'Balance training is recommended. Consider consulting a healthcare provider.';
    } else {
        interpretation = 'Significant balance impairment. High fall risk.';
        recommendations = 'Please consult with a healthcare provider for balance assessment and training.';
    }
    
    document.getElementById('scoreInterpretation').innerHTML = `<p><strong>${interpretation}</strong></p>`;
    document.getElementById('recommendations').innerHTML = `<h3>Recommendations:</h3><p>${recommendations}</p>`;
    
    createComparisonChart(score);
}

function createComparisonChart(userScore) {
    const svg = d3.select('#comparisonChart')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 300);
        
    const width = 600;
    const height = 300;
    const margin = {top: 20, right: 30, bottom: 60, left: 60};
    
    // Sample data representing study population distribution
    const data = [
        {range: '0-7', count: 5, color: '#ff6b6b'},
        {range: '8-15', count: 15, color: '#feca57'},
        {range: '16-23', count: 45, color: '#48dbfb'},
        {range: '24-28', count: 35, color: '#1dd1a1'}
    ];
    
    const x = d3.scaleBand()
        .domain(data.map(d => d.range))
        .range([margin.left, width - margin.right])
        .padding(0.1);
        
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height - margin.bottom, margin.top]);
    
    // Draw bars
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.range))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.bottom - y(d.count))
        .attr('fill', d => d.color)
        .attr('opacity', 0.7);
    
    // Add user score indicator
    const userRange = userScore <= 7 ? '0-7' : 
                     userScore <= 15 ? '8-15' : 
                     userScore <= 23 ? '16-23' : '24-28';
    
    svg.append('line')
        .attr('x1', x(userRange) + x.bandwidth()/2)
        .attr('x2', x(userRange) + x.bandwidth()/2)
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#2c3e50')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5');
        
    svg.append('text')
        .attr('x', x(userRange) + x.bandwidth()/2)
        .attr('y', margin.top - 5)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Your Score');
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
        
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
        
    // Add labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .text('Mini-BESTest Score Range');
        
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .text('Number of Participants (%)');
}

function resetAssessment() {
    currentStep = 1;
    assessmentData = {};
    tmtCompleted = false;
    tmtCurrentNumber = 1;
    tmtStartTime = null;
    
    // Reset all steps
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    
    // Clear all inputs
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    document.querySelectorAll('.likert-option').forEach(opt => opt.classList.remove('selected'));
    
    // Reset TMT
    document.getElementById('tmtGrid').innerHTML = '';
    document.getElementById('tmtTimer').textContent = 'Ready to start';
    document.getElementById('tmtStartBtn').style.display = 'inline-block';
    document.getElementById('tmtNextBtn').disabled = true;
    
    // Clear results
    document.getElementById('comparisonChart').innerHTML = '';
    
    updateProgress();
    initializeTMT();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFESQuestions();
    initializeTMT();
});
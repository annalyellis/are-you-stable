<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balance Quiz & Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <link rel="stylesheet" href="../style.css" />
  <style>
  </style>
</head>
<header>
  <nav>
    <!-- <ul>
      <li><a href="../index.html" class="active">Home</a></li>
      <li><a href="../second/index.html">Second</a></li>
      <li><a href="../third/index.html">Third</a></li>
      <li><a href="../fourth/index.html">Fourth</a></li>
      <li><a href="../fifth/index.html">Fifth</a></li>
    </ul> -->
  </nav>
</header>
<body>
  <section id = "introSection" class="intro-section">
    <h1>Are you stable?</h1>
    <p>
      Balance is a crucial aspect of physical health 
      that enables safe movement, coordination, and stability in 
      everyday activities. As we age, maintaining good balance becomes 
      increasingly important to prevent falls and support long-term 
      mobility and independence.
    </p>
    <div class="navigation-buttons">
      <button id="toQuizbtn">Let's Find Out!</button>
    </div>
  </section>
  <div id="quizContainer">
    <div class="progress-bar">
      <div id="progressFill" class="progress-fill"></div>
    </div>

    <div id="step0" class="step active">
      <h2>Welcome to the Balance Assessment!</h2>
      <p>This quiz will assess your balance and provide personalized insights. It involves several steps, including questions about your physical activity and a simple motor test.</p>
      <div class="navigation-buttons">
        <button id="startQuizBtn" onclick="goToStep(1)">Start Quiz</button>
      </div>
    </div>

    <div id="step1" class="step">
      <h2>1. Personal Information</h2>
      <div class="question">
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" min="1" max="120" required>
      </div>
      <div class="question">
        <label for="gender">Gender:</label>
        <select id="gender" name="gender" required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="question">
        <label for="height">Height (inches):</label>
        <input type="number" id="height" name="height" min="20" max="100" step="0.1" required>
      </div>
      <div class="question">
        <label for="weight">Weight (pounds):</label>
        <input type="number" id="weight" name="weight" min="50" max="1000" step="0.1" required>
      </div>
      <div class="navigation-buttons">
        <button id="prevBtn1" onclick="prevStep()" style="display: none;">Previous</button>
        <button id="nextBtn1" onclick="nextStep()">Next</button>
      </div>
    </div>

    <div id="step2" class="step">
      <h2>2. Falls Efficacy Scale - International (FES-I)</h2>
      <p>Please indicate your level of concern about falling during the following activities:</p>
      <div id="fesQuestions">
        </div>
      <div class="navigation-buttons">
        <button id="prevBtn2" onclick="prevStep()">Previous</button>
        <button id="nextBtn2" onclick="nextStep()">Next</button>
      </div>
    </div>

    <div id="step3" class="step">
      <h2>3. International Physical Activity Questionnaire (IPAQ)</h2>
      <div class="question">
        <label for="ipaq1a">In the last 7 days, on how many days did you do **vigorous** physical activities like heavy lifting, digging, aerobics, or fast bicycling?</label>
        <input type="number" id="ipaq1a" name="ipaq1a" min="0" max="7" required>
      </div>
      <div class="question">
        <label for="ipaq1b">How much time did you spend on one of those days doing vigorous physical activities? (minutes per day)</label>
        <input type="number" id="ipaq1b" name="ipaq1b" min="0" required>
      </div>
      <div class="question">
        <label for="ipaq2a">In the last 7 days, on how many days did you do **moderate** physical activities like carrying light loads, bicycling at a regular pace, or doubles tennis? (Don't include walking)</label>
        <input type="number" id="ipaq2a" name="ipaq2a" min="0" max="7" required>
      </div>
      <div class="question">
        <label for="ipaq2b">How much time did you spend on one of those days doing moderate physical activities? (minutes per day)</label>
        <input type="number" id="ipaq2b" name="ipaq2b" min="0" required>
      </div>
      <div class="navigation-buttons">
        <button id="prevBtn3" onclick="prevStep()">Previous</button>
        <button id="nextBtn3" onclick="nextStep()">Next</button>
      </div>
    </div>

    <div id="step4" class="step">
      <h2>4. Trail Making Test (TMT) - Part A (Numbers)</h2>
      <p>Click on the numbers in ascending order (1, 2, 3, ...). The timer starts when you click 'Start'.</p>
      <div class="tmt-grid" id="tmtGrid">
        </div>
      <div class="tmt-timer" id="tmtTimer">Ready to start</div>
      <div class="navigation-buttons">
        <button id="tmtStartBtn" onclick="startTMT()">Start Test</button>
        <button id="prevBtn4" onclick="prevStep()">Previous</button>
        <button id="tmtNextBtn" onclick="nextStep()" disabled>Next</button>
      </div>
    </div>

    <div id="step5" class="step">
      <h2>5. Submit Assessment</h2>
      <p>Click 'Submit' to calculate your balance score and see your personalized results.</p>
      <div class="navigation-buttons">
        <button id="prevBtn5" onclick="prevStep()">Previous</button>
        <button id="submitBtn" onclick="calculateResults()">Submit</button>
      </div>
    </div>
  </div>

  <div id="mainContent">
    <div id="resultsPane">
        <button class="toggle-button" onclick="toggleResultsPane()">Minimize Results</button>
        <h2>Your Predicted Mini-BESTest Score: <span id="predictedScore"></span></h2>
        <div id="scoreInterpretation"></div>
        <div id="recommendations"></div>
        <div id="comparisonChart"></div> <div style="text-align: center; margin-top: 20px;">
            <button class="download-button" onclick="downloadScore()">Download My Score</button>
            <a href="#" id="downloadResultsBtn" class="download-button" onclick="downloadResults()">Download All Results (JSON)</a>
            <button class="download-button" onclick="resetAssessment()">Start New Assessment</button>
        </div>
    </div>
    <div id="visualizationArea">
        <div id="viz1" class="viz-container">
            <h2>Balance Over Time (By Gender)</h2>
            <div class="viz-content">
                <p>This graph illustrates the trend in balance performance one could experience throughout their lifetime.
                    It is based on the Best_t score, the same score you recieved by taking the quiz.
                </p>
                <svg width="100%" height="300"></svg> <p>Consider how you compare to others your age and gender. Remember that consistent activity often leads to
                    more stable balance over time.
                </p>
            </div>
        </div>
        <div id="viz2" class="viz-container">
            <h2>Balance with vs. without prosthetics</h2>
            <div class="viz-content">
                <p>This visualization informs us of how those of us who wear prosthetics might have different balance scores compared to those of us who don't</p>
                <svg width="100%" height="300"></svg>
                <p></p>
            </div>
        </div>
        <div id="viz3" class="viz-container">
            <h2>How do shoes affect your balance?</h2>
            <div class="viz-content">
                <p>This bar chart breaks down which combinations of commonly worn footwear lead to different balance scores.</p>
                <svg width="100%" height="300"></svg>
                <p>For good balance it is important to consider which shoes can lead to long term stability. What kind of shoes do you wear?></p>
            </div>
        </div>
        </div>
  </div>

  <script>
    let currentStep = 0;
    let assessmentData = {};
    let tmtStartTime = null;
    let tmtCurrentNumber = 1;
    let tmtCompleted = false;
    let finalPredictedScore = null; // Stores the final score for download
    let autoTransitionTimeout; // To store the timeout ID for auto-transitioning to viz page

    // FES-I Questions - A static list of questions for the FES-I section
    const fesQuestions = [
        "Cleaning the house (e.g. sweep, vacuum, or dust)",
        "Getting dressed or un-dressed",
        "Preparing simple meals",
        "Taking a bath or shower",
        "Going to the shop",
        "Getting in or out of a chair",
        "Going up or down stairs",
        "Walking around the house",
        "Walking on a slippery surface (e.g. wet floor, ice)",
        "Walking on an uneven surface (e.g. stony path, grass)",
        "Walking in a place with crowds (e.g. shopping center, street)",
        "Walking up or down a slope",
        "Visiting friends or relatives",
        "Going to a place with stairs or steps",
        "Going for a social event (e.g. club, religious meeting, party)",
        "Going to the doctor's clinic or hospital"
    ];


    function startQuizFromIntro() {
        // Hide the intro section
        document.getElementById('introSection').style.display = 'none';
        
        // Show the quiz container
        document.getElementById('quizContainer').style.display = 'block';
        
        // Make sure we're at step 0 (welcome page)
        goToStep(0);
    }

    /**
     * Initializes the quiz on page load.
     * Sets the initial step to the welcome screen and prepares dynamic elements.
     */
    window.onload = function() {
        //goToStep(0); // Show the welcome step first
        initializeFESQuestions();
        initializeTMT();
        // Initially hide the main content split view using CSS directly, not JS here
        // The CSS for #mainContent and #visualizationArea now includes display: none; by default
        document.getElementById('introSection').style.display = 'block';
        document.getElementById('quizContainer').style.display = 'none';

        document.getElementById('toQuizbtn').addEventListener('click', startQuizFromIntro);
    };

    /**
     * Navigates to a specific quiz step.
     * @param {number} stepNum - The number of the step to go to.
     */
    function goToStep(stepNum) {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        currentStep = stepNum;
        document.getElementById(`step${stepNum}`).classList.add('active');
        updateProgress();

        // Manage navigation button visibility
        const prevBtns = [
            document.getElementById('prevBtn1'),
            document.getElementById('prevBtn2'),
            document.getElementById('prevBtn3'),
            document.getElementById('prevBtn4'),
            document.getElementById('prevBtn5')
        ];
        prevBtns.forEach(btn => {
            if (btn) { // Check if the button exists
                btn.style.display = (currentStep > 0 && currentStep <= 5) ? 'inline-block' : 'none';
            }
        });
    }

    /**
     * Updates the progress bar based on the current quiz step.
     */
    function updateProgress() {
        const totalSteps = 5; // Total assessment steps (1 to 5)
        const adjustedStep = Math.max(0, currentStep - 1); // Current step for progress bar (0 to 4)
        const progress = (adjustedStep / totalSteps) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    /**
     * Dynamically creates and displays the FES-I questions.
     * Pre-selects options if data already exists (e.g., on 'Previous' button click).
     */
    function initializeFESQuestions() {
        const container = document.getElementById('fesQuestions');
        container.innerHTML = ''; // Clear existing questions
        fesQuestions.forEach((question, index) => {
            const questionId = `fes${index + 1}`;
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.innerHTML = `
                <label>${index + 1}. ${question}</label>
                <div class="likert-scale">
                    <div class="likert-option" data-value="1" onclick="selectLikert(this, '${questionId}', 1)">
                        <div>Not at all concerned</div>
                        <div><strong>1</strong></div>
                    </div>
                    <div class="likert-option" data-value="2" onclick="selectLikert(this, '${questionId}', 2)">
                        <div>Somewhat concerned</div>
                        <div><strong>2</strong></div>
                    </div>
                    <div class="likert-option" data-value="3" onclick="selectLikert(this, '${questionId}', 3)">
                        <div>Fairly concerned</div>
                        <div><strong>3</strong></div>
                    </div>
                    <div class="likert-option" data-value="4" onclick="selectLikert(this, '${questionId}', 4)">
                        <div>Very concerned</div>
                        <div><strong>4</strong></div>
                    </div>
                </div>
            `;
            container.appendChild(questionDiv);

            // If a value is already stored, pre-select the option
            if (assessmentData[questionId]) {
                const selectedOption = questionDiv.querySelector(`.likert-option[data-value="${assessmentData[questionId]}"]`);
                if (selectedOption) {
                    selectedOption.classList.add('selected');
                }
            }
        });
    }

    /**
     * Handles the selection of a Likert scale option.
     * Stores the selected value in `assessmentData`.
     * @param {HTMLElement} element - The clicked Likert option element.
     * @param {string} questionId - The ID of the question (e.g., 'fes1').
     * @param {number} value - The numerical value of the selected option.
     */
    function selectLikert(element, questionId, value) {
        element.parentNode.querySelectorAll('.likert-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');
        assessmentData[questionId] = value;
    }

    /**
     * Converts height from inches to centimeters and weight from pounds to kilograms.
     * @param {number} heightInInches - Height in inches.
     * @param {number} weightInPounds - Weight in pounds.
     * @returns {{heightCm: number, weightKg: number}} - Object with converted values.
     */
    function convertToMetric(heightInInches, weightInPounds) {
        const heightCm = heightInInches * 2.54;
        const weightKg = weightInPounds * 0.453592;
        return { heightCm, weightKg };
    }

    /**
     * Initializes the Trail Making Test (TMT) grid.
     * Generates and shuffles numbers for the test.
     */
    function initializeTMT() {
        const grid = document.getElementById('tmtGrid');
        grid.innerHTML = ''; // Clear existing circles
        const numbers = Array.from({length: 13}, (_, i) => i + 1); // Numbers 1 to 13

        // Shuffle positions for a random layout
        const shuffled = numbers.sort(() => Math.random() - 0.5);

        shuffled.forEach(num => {
            const circle = document.createElement('div');
            circle.className = 'tmt-circle';
            circle.textContent = num;
            circle.dataset.number = num;
            circle.onclick = () => clickTMTNumber(num, circle);
            grid.appendChild(circle);
        });

        // Reset TMT state for re-initialization
        document.getElementById('tmtTimer').textContent = 'Ready to start';
        document.getElementById('tmtStartBtn').style.display = 'inline-block';
        document.getElementById('tmtNextBtn').disabled = true;
    }

    /**
     * Starts the Trail Making Test timer and highlights the first number.
     */
    function startTMT() {
        tmtStartTime = Date.now();
        tmtCurrentNumber = 1;
        tmtCompleted = false;

        document.getElementById('tmtStartBtn').style.display = 'none';
        const firstCircle = document.querySelector('[data-number="1"]');
        if (firstCircle) {
            firstCircle.classList.add('current');
        }

        updateTMTTimer();
    }

    /**
     * Updates the TMT timer display.
     * Uses `requestAnimationFrame` for smooth updates.
     */
    function updateTMTTimer() {
        if (!tmtStartTime || tmtCompleted) return;

        const elapsed = (Date.now() - tmtStartTime) / 1000;
        document.getElementById('tmtTimer').textContent = `Time: ${elapsed.toFixed(1)}s`;

        requestAnimationFrame(updateTMTTimer);
    }

    /**
     * Handles clicks on TMT numbers.
     * Validates if the correct number is clicked and tracks progress.
     * @param {number} number - The number on the clicked circle.
     * @param {HTMLElement} element - The clicked circle element.
     */
    function clickTMTNumber(number, element) {
        if (!tmtStartTime || tmtCompleted) return;

        if (number === tmtCurrentNumber) {
            element.classList.remove('current');
            element.classList.add('completed');

            tmtCurrentNumber++;

            if (tmtCurrentNumber <= 13) {
                const nextCircle = document.querySelector(`[data-number="${tmtCurrentNumber}"]`);
                if (nextCircle) {
                    nextCircle.classList.add('current');
                }
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

    /**
     * Moves to the next quiz step after validating the current step.
     */
    function nextStep() {
        if (!validateCurrentStep()) {
            alert('Please complete all required fields for this step.');
            return;
        }

        collectCurrentStepData();

        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep++;
        goToStep(currentStep);

        if (currentStep > 5) { // If it's past the last quiz step, calculate results
            calculateResults();
        }
    }

    /**
     * Moves to the previous quiz step.
     */
    function prevStep() {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        goToStep(currentStep);
    }

    /**
     * Validates that all required fields for the current step are filled.
     * @returns {boolean} - True if validation passes, false otherwise.
     */
    function validateCurrentStep() {
        if (currentStep === 1) {
            return document.getElementById('age').value &&
                   document.getElementById('gender').value &&
                   document.getElementById('height').value &&
                   document.getElementById('weight').value;
        } else if (currentStep === 2) {
            // Check if all FES questions have a selected value
            return fesQuestions.every((_, i) => assessmentData[`fes${i + 1}`] !== undefined);
        } else if (currentStep === 3) {
            return document.getElementById('ipaq1a').value !== '' &&
                   document.getElementById('ipaq1b').value !== '' &&
                   document.getElementById('ipaq2a').value !== '' &&
                   document.getElementById('ipaq2b').value !== '';
        } else if (currentStep === 4) {
            return tmtCompleted;
        }
        return true;
    }

    /**
     * Collects data from the current quiz step and stores it in `assessmentData`.
     */
    function collectCurrentStepData() {
        if (currentStep === 1) {
            assessmentData.age = parseInt(document.getElementById('age').value);
            assessmentData.gender = document.getElementById('gender').value;

            const heightInches = parseFloat(document.getElementById('height').value);
            const weightPounds = parseFloat(document.getElementById('weight').value);

            // Convert to metric
            const { heightCm, weightKg } = convertToMetric(heightInches, weightPounds);

            // Save converted values
            assessmentData.height = heightCm;
            assessmentData.weight = weightKg;
            assessmentData.bmi = weightKg / ((heightCm / 100) ** 2);

        } else if (currentStep === 3) {
            assessmentData.ipaq1a = parseInt(document.getElementById('ipaq1a').value) || 0;
            assessmentData.ipaq1b = parseInt(document.getElementById('ipaq1b').value) || 0;
            assessmentData.ipaq2a = parseInt(document.getElementById('ipaq2a').value) || 0;
            assessmentData.ipaq2b = parseInt(document.getElementById('ipaq2b').value) || 0;
        }
        // FES data is collected in `selectLikert`
        // TMT data is collected in `clickTMTNumber`
    }

    /**
     * Calculates the predicted Mini-BESTest score based on collected assessment data.
     * This is a simplified prediction model for demonstration purposes.
     */
    function calculateResults() {
        // Calculate FES total score
        let fesTotal = 0;
        fesQuestions.forEach((_, i) => {
            fesTotal += assessmentData[`fes${i + 1}`] || 1; // Default to 1 if not selected
        });
        assessmentData.fesTotal = fesTotal;

        // Calculate IPAQ score (simplified MET calculation)
        // METs: Vigorous = 8, Moderate = 4
        const vigorousMets = assessmentData.ipaq1a * assessmentData.ipaq1b * 8;
        const moderateMets = assessmentData.ipaq2a * assessmentData.ipaq2b * 4;
        assessmentData.ipaqScore = vigorousMets + moderateMets;

        // Predict Mini-BESTest score using simplified model (max 28)
        let predictedScore = 28; // Base score

        // Age factor
        if (assessmentData.age > 65) predictedScore -= 3;
        else if (assessmentData.age > 45) predictedScore -= 1;

        // BMI factor
        if (assessmentData.bmi > 30) predictedScore -= 2;
        else if (assessmentData.bmi < 18.5) predictedScore -= 1;

        // FES factor (higher concern = lower balance)
        // FES-I score ranges from 16 (no concern) to 64 (severe concern).
        if (fesTotal >= 40) predictedScore -= 4; // High concern
        else if (fesTotal >= 30) predictedScore -= 3; // Moderate-high concern
        else if (fesTotal >= 20) predictedScore -= 1; // Moderate concern

        // TMT factor (slower time = lower balance)
        if (assessmentData.tmtTime > 30) predictedScore -= 3;
        else if (assessmentData.tmtTime > 20) predictedScore -= 1;

        // Physical activity factor (higher activity = better balance)
        // IPAQ scores can be large, use thresholds for impact.
        if (assessmentData.ipaqScore > 3000) predictedScore += 2; // Very active
        else if (assessmentData.ipaqScore < 600) predictedScore -= 2; // Low activity

        // Ensure score is within valid range (0-28)
        predictedScore = Math.max(0, Math.min(28, predictedScore));
        finalPredictedScore = predictedScore; // Store for download

        displayResults(predictedScore);
    }

    /**
     * Displays the calculated results as a full-screen page initially.
     * Sets a timeout to transition to the scrollable visualization page after a delay.
     * @param {number} score - The predicted Mini-BESTest score.
     */
    function displayResults(score) {
        const quizContainer = document.getElementById('quizContainer');
        const mainContent = document.getElementById('mainContent');
        const resultsPane = document.getElementById('resultsPane');
        const visualizationArea = document.getElementById('visualizationArea');

        clearTimeout(autoTransitionTimeout);

        quizContainer.style.opacity = 0;
        setTimeout(() => {
            quizContainer.style.display = 'none';

            // Use classes instead of direct style manipulation
            mainContent.classList.add('active');
            resultsPane.classList.add('full-screen-results');
            resultsPane.classList.remove('minimized');
            resultsPane.querySelector('.toggle-button').style.display = 'none';

            // Keep visualization area hidden initially
            visualizationArea.classList.remove('active');

            // Clear any old visualizations
            if (typeof d3 !== 'undefined') {
                d3.select('#viz1 svg').selectAll("*").remove();
                d3.select('#viz2 svg').selectAll("*").remove();
                d3.select('#viz3 svg').selectAll("*").remove();
            }

            // Clear previous results content
            document.getElementById('predictedScore').textContent = '';
            document.getElementById('scoreInterpretation').innerHTML = '';
            document.getElementById('recommendations').innerHTML = '';
            if (typeof d3 !== 'undefined') {
                d3.select('#comparisonChart').selectAll("*").remove();
            }

            // Populate results
            document.getElementById('predictedScore').textContent = score.toFixed(1);

            let interpretation = '';
            let recommendations = '';

            if (score >= 24) {
                interpretation = 'Excellent balance! Low fall risk.';
                recommendations = 'Continue your current activity level and consider challenging balance exercises to maintain your excellent balance.';
            } else if (score >= 20) {
                interpretation = 'Good balance with mild impairment.';
                recommendations = 'Consider incorporating more balance training exercises (e.g., tai chi, yoga, standing on one leg) and regular physical activity into your routine to further improve and maintain your balance.';
            } else if (score >= 16) {
                interpretation = 'Moderate balance impairment. Increased fall risk.';
                recommendations = 'Balance training is highly recommended. You should consider consulting a healthcare provider or a physical therapist for a personalized balance assessment and tailored exercise program.';
            } else {
                interpretation = 'Significant balance impairment. High fall risk.';
                recommendations = 'It is strongly advised that you consult with a healthcare provider, such as a doctor or physical therapist, for a comprehensive balance assessment and to develop a specialized training and fall prevention plan.';
            }

            document.getElementById('scoreInterpretation').innerHTML = `<p><strong>${interpretation}</strong></p>`;
            document.getElementById('recommendations').innerHTML = `<h3>Recommendations:</h3><p>${recommendations}</p>`;

            if (typeof createComparisonChart === 'function') {
                createComparisonChart(score);
            }

            const exploreButton = document.createElement('button');
            exploreButton.textContent = 'Explore Your Results';
            exploreButton.className = 'explore-results-btn';
            exploreButton.onclick = transitionToVizPage;

            const recommendationsDiv = document.getElementById('recommendations');
            recommendationsDiv.appendChild(exploreButton);
        }, 500);
    }

    /**
     * Transitions from the full-screen results page to the full-screen scrollable visualization page.
     * Minimizes the results pane to a corner and makes the visualization area full screen.
     */
    function transitionToVizPage() {
        const resultsPane = document.getElementById('resultsPane');
        const visualizationArea = document.getElementById('visualizationArea');
        const toggleButton = resultsPane.querySelector('.toggle-button');

        clearTimeout(autoTransitionTimeout);

        resultsPane.classList.remove('full-screen-results');
        resultsPane.classList.add('minimized');
        toggleButton.style.display = 'block';
        toggleButton.textContent = 'Expand Results';

        visualizationArea.classList.add('active');

        // Only render visualizations if D3 and functions are available
        if (typeof renderAllVisualizations === 'function') {
            renderAllVisualizations();
        }
    }

    /**
     * Renders all D3 visualizations. This is called when the visualization area
     * changes size (e.g., when results pane is toggled or on initial transition).
     */
    function renderAllVisualizations() {
        if (typeof createD3Visualization1 === 'function') createD3Visualization1();
        if (typeof createD3Visualization2 === 'function') createD3Visualization2();
        if (typeof createD3Visualization3 === 'function') createD3Visualization3();
    }

    /**
     * Creates and displays a comparison chart of the user's score against a fictional population distribution.
     * Uses D3.js for visualization.
     * @param {number} userScore - The user's predicted Mini-BESTest score.
     */
    function createComparisonChart(userScore) {
        if (typeof d3 === 'undefined') {
            console.warn('D3.js not available for chart creation');
            return;
        }

        const chartContainer = d3.select('#comparisonChart');
        chartContainer.selectAll("*").remove(); // Clear previous chart to prevent duplication

        const svg = chartContainer
            .append('svg')
            .attr('viewBox', `0 0 600 350`); // Use viewBox for responsiveness

        const width = 600;
        const height = 350;
        const margin = {top: 40, right: 30, bottom: 60, left: 60};

        // Sample data representing study population distribution (fictional)
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
            .domain([0, d3.max(data, d => d.count) * 1.1]) // Add some padding to the top
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
            .attr('opacity', 0.8);

        // Add user score indicator
        const userRange = userScore <= 7 ? '0-7' :
                         userScore <= 15 ? '8-15' :
                         userScore <= 23 ? '16-23' : '24-28';

        const userXPos = x(userRange) + x.bandwidth() / 2;

        svg.append('line')
            .attr('x1', userXPos)
            .attr('x2', userXPos)
            .attr('y1', y(d3.max(data, d => d.count) * 1.05)) // Start above highest bar
            .attr('y2', height - margin.bottom)
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '5,5');

        svg.append('text')
            .attr('x', userXPos)
            .attr('y', y(d3.max(data, d => d.count) * 1.05) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', '#2c3e50')
            .text('Your Score');

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "12px");

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d => `${d}%`)) // Assuming percentages
            .selectAll("text")
            .style("font-size", "12px");

        // Add labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text('Mini-BESTest Score Range');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text('Number of Participants (%)');

        // Title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", margin.top / 2 + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Your Score vs. Population Distribution");
    }

    async function createD3Visualization1() {
        if (typeof d3 === 'undefined') {
            console.warn('D3.js not available for visualization 1');
            return;
        }

        const svg = d3.select("#viz1 svg");
        svg.selectAll("*").remove();

        const width = parseInt(svg.style("width"));
        const height = parseInt(svg.style("height"));
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Load and normalize data
        try {
            const data = await d3.csv("BDSinfo.csv", d => {
                let gender = d.Gender?.trim().toLowerCase();
                if (gender === "m" || gender === "male") gender = "Male";
                else if (gender === "f" || gender === "female") gender = "Female";
                else gender = null; // Exclude unrecognized/other categories

                return {
                    Age: +d.Age,
                    Best_T: +d.Best_T,
                    Gender: gender
                };
            });

            // Filter for valid entries only
            const filtered = data.filter(d =>
                !isNaN(d.Age) &&
                !isNaN(d.Best_T) &&
                (d.Gender === "Male" || d.Gender === "Female")
            );

            const x = d3.scaleLinear()
                .domain(d3.extent(filtered, d => d.Age)).nice()
                .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
                .domain([0, 28])
                .range([height - margin.bottom, margin.top]);

            const color = d3.scaleOrdinal()
                .domain(["Male", "Female"])
                .range(["#000080", "#C11C84"]);

            // Linear regression function
            function linearRegression(xData, yData) {
                const n = xData.length;
                const sumX = d3.sum(xData);
                const sumY = d3.sum(yData);
                const sumXY = d3.sum(xData.map((x, i) => x * yData[i]));
                const sumXX = d3.sum(xData.map(x => x * x));
                
                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                const intercept = (sumY - slope * sumX) / n;
                
                return { slope, intercept };
            }

            // Calculate single regression line for all data
            const xData = filtered.map(d => d.Age);
            const yData = filtered.map(d => d.Best_T);
            const regression = linearRegression(xData, yData);
            
            const xExtent = d3.extent(xData);
            const regressionLine = [
                { x: xExtent[0], y: regression.slope * xExtent[0] + regression.intercept },
                { x: xExtent[1], y: regression.slope * xExtent[1] + regression.intercept }
            ];

            // Axes
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("x", innerWidth / 2 + margin.left)
                .attr("y", 40)
                .attr("fill", "#000")
                .attr("text-anchor", "middle")
                .text("Age");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .append("text")
                .attr("x", -innerHeight / 2)
                .attr("y", -45)
                .attr("transform", "rotate(-90)")
                .attr("fill", "#000")
                .attr("text-anchor", "middle")
                .text("Balance Score (Best_T)");

            // Add single regression line
            const line = d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y));

            svg.append("path")
                .datum(regressionLine)
                .attr("class", "regression-line")
                .attr("d", line)
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr("stroke-dasharray", "5,5")
                .attr("opacity", 0.8);

            // Points (drawn after lines so they appear on top)
            svg.selectAll("circle")
                .data(filtered)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.Age))
                .attr("cy", d => y(d.Best_T))
                .attr("r", 4)
                .attr("fill", d => color(d.Gender))
                .attr("opacity", 0.7);

            // Legend
            const legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width - margin.right - 100},${margin.top + i * 20})`);

            legend.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => color(d));

            legend.append("text")
                .attr("x", 15)
                .attr("y", 9)
                .text(d => d)
                .attr("font-size", "12px");

            // Add regression line indicator to legend
            const regressionLegend = svg.append("g")
                .attr("class", "regression-legend")
                .attr("transform", `translate(${width - margin.right - 100},${margin.top + 50})`);

            regressionLegend.append("line")
                .attr("x1", 0)
                .attr("x2", 10)
                .attr("y1", 5)
                .attr("y2", 5)
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "2,2");

            regressionLegend.append("text")
                .attr("x", 15)
                .attr("y", 9)
                .text("Trend Line")
                .attr("font-size", "11px")
                .attr("fill", "#666");

        } catch (error) {
            console.warn('Could not load CSV data for visualization 1:', error);
            // Create placeholder visualization with sample data
            createSampleVisualization1(svg, width, height, margin);
        }
    }

    function createSampleVisualization1(svg, width, height, margin) {
        // Create sample data for demonstration
        const sampleData = [];
        for (let age = 20; age <= 80; age += 2) {
            sampleData.push({
                Age: age,
                Best_T: Math.max(0, 28 - (age - 20) * 0.15 + Math.random() * 6 - 3),
                Gender: Math.random() > 0.5 ? "Male" : "Female"
            });
        }

        const x = d3.scaleLinear()
            .domain([20, 80])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 28])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(["Male", "Female"])
            .range(["#000080", "#C11C84"]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
            .attr("y", 40)
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .text("Age");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .append("text")
            .attr("x", -(height - margin.top - margin.bottom) / 2)
            .attr("y", -45)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .attr("text-anchor", "middle")
            .text("Balance Score (Best_T)");

        svg.selectAll("circle")
            .data(sampleData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Age))
            .attr("cy", d => y(d.Best_T))
            .attr("r", 4)
            .attr("fill", d => color(d.Gender))
            .attr("opacity", 0.7);

        // Legend
        const legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - margin.right - 100},${margin.top + i * 20})`);

        legend.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => color(d));

        legend.append("text")
            .attr("x", 15)
            .attr("y", 9)
            .text(d => d)
            .attr("font-size", "12px");
    }

    async function createD3Visualization2() {
        if (typeof d3 === 'undefined') {
            console.warn('D3.js not available for visualization 2');
            return;
        }

        const svg = d3.select("#viz2 svg");
        svg.selectAll("*").remove();

        const width = parseInt(svg.style("width"));
        const height = parseInt(svg.style("height"));
        const margin = { top: 30, right: 30, bottom: 60, left: 60 };

        try {
            const data = await d3.csv("BDSinfo.csv", d => ({
                Prosthesis: d["Ortho-Prosthesis"]?.trim(),
                Best_T: +d.Best_T
            }));

            const grouped = d3.rollups(
                data.filter(d => d.Prosthesis && !isNaN(d.Best_T)),
                v => d3.mean(v, d => d.Best_T),
                d => d.Prosthesis
            ).map(([group, avg]) => ({ Prosthesis: group, avgBalance: avg }));

            const x = d3.scaleBand()
                .domain(grouped.map(d => d.Prosthesis))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 28])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-35)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(grouped)
                .enter()
                .append("rect")
                .attr("x", d => x(d.Prosthesis))
                .attr("y", d => y(d.avgBalance))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.bottom - y(d.avgBalance))
                .attr("fill", "#FF9800");

        } catch (error) {
            console.warn('Could not load CSV data for visualization 2:', error);
            // Create sample data
            const data = [
                { Prosthesis: "None", avgBalance: 23.5 },
                { Prosthesis: "Lower Limb", avgBalance: 19.2 },
                { Prosthesis: "Upper Limb", avgBalance: 22.8 }
            ];

            const x = d3.scaleBand()
                .domain(data.map(d => d.Prosthesis))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 28])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-35)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.Prosthesis))
                .attr("y", d => y(d.avgBalance))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.bottom - y(d.avgBalance))
                .attr("fill", "#FF9800");
        }
    }

    async function createD3Visualization3() {
        if (typeof d3 === 'undefined') {
            console.warn('D3.js not available for visualization 3');
            return;
        }

        const svg = d3.select("#viz3 svg");
        svg.selectAll("*").remove();

        const width = parseInt(svg.style("width"));
        const height = parseInt(svg.style("height"));
        const margin = { top: 30, right: 30, bottom: 80, left: 60 };

        try {
            const data = await d3.csv("BDSinfo.csv", d => ({
                Footwear: d.Footwear?.trim(),
                Best_T: +d.Best_T
            }));

            const grouped = d3.rollups(
                data.filter(d => d.Footwear && !isNaN(d.Best_T)),
                v => d3.mean(v, d => d.Best_T),
                d => d.Footwear
            ).map(([footwear, avgBalance]) => ({ Footwear: footwear, avgBalance }));

            // Sort by highest balance
            grouped.sort((a, b) => b.avgBalance - a.avgBalance);

            const x = d3.scaleBand()
                .domain(grouped.map(d => d.Footwear))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 28])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-35)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(grouped)
                .enter()
                .append("rect")
                .attr("x", d => x(d.Footwear))
                .attr("y", d => y(d.avgBalance))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.bottom - y(d.avgBalance))
                .attr("fill", "#4CAF50");

            // Optional: Add values above bars
            svg.selectAll(".label")
                .data(grouped)
                .enter()
                .append("text")
                .attr("x", d => x(d.Footwear) + x.bandwidth() / 2)
                .attr("y", d => y(d.avgBalance) - 5)
                .attr("text-anchor", "middle")
                .attr("font-size", "11px")
                .attr("fill", "#333")
                .text(d => d.avgBalance.toFixed(1));

        } catch (error) {
            console.warn('Could not load CSV data for visualization 3:', error);
            // Create sample data
            const data = [
                { Footwear: "Athletic Shoes", avgBalance: 24.2 },
                { Footwear: "Dress Shoes", avgBalance: 21.8 },
                { Footwear: "Sandals", avgBalance: 20.5 },
                { Footwear: "High Heels", avgBalance: 18.3 },
                { Footwear: "Boots", avgBalance: 22.1 }
            ];

            data.sort((a, b) => b.avgBalance - a.avgBalance);

            const x = d3.scaleBand()
                .domain(data.map(d => d.Footwear))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 28])
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-35)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.Footwear))
                .attr("y", d => y(d.avgBalance))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.bottom - y(d.avgBalance))
                .attr("fill", "#4CAF50");

            svg.selectAll(".label")
                .data(data)
                .enter()
                .append("text")
                .attr("x", d => x(d.Footwear) + x.bandwidth() / 2)
                .attr("y", d => y(d.avgBalance) - 5)
                .attr("text-anchor", "middle")
                .attr("font-size", "11px")
                .attr("fill", "#333")
                .text(d => d.avgBalance.toFixed(1));
        }
    }

    /**
     * Downloads the complete assessment results as a JSON file.
     */
    function downloadResults() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assessmentData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "balance_assessment_full_results.json");
        dlAnchor.click();
    }

    /**
     * Downloads a summary of the predicted score and recommendations as a plain text file.
     */
    function downloadScore() {
        if (finalPredictedScore === null) {
            alert("Score not yet calculated. Please complete the quiz.");
            return;
        }

        const scoreText = `Your Predicted Mini-BESTest Score: ${finalPredictedScore.toFixed(1)}\n` +
                          `Interpretation: ${document.getElementById('scoreInterpretation').textContent}\n` +
                          `Recommendations: ${document.getElementById('recommendations').textContent.replace('Recommendations:', '').trim()}`;

        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(scoreText);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "balance_score_summary.txt");
        dlAnchor.click();
    }

    /**
     * Toggles the results pane between expanded (sidebar) and minimized (corner) states.
     * This function is primarily used on the visualization page.
     */
    function toggleResultsPane() {
        const resultsPane = document.getElementById('resultsPane');
        const visualizationArea = document.getElementById('visualizationArea');
        const toggleButton = resultsPane.querySelector('.toggle-button');

        clearTimeout(autoTransitionTimeout);

        if (resultsPane.classList.contains('minimized')) {
            // Expand the pane
            resultsPane.classList.remove('minimized');
            toggleButton.textContent = 'Minimize Results';
            
            // Make sure visualization area is visible
            visualizationArea.classList.add('active');
            
            // Re-render visualizations if D3 and functions are available
            if (typeof renderAllVisualizations === 'function') {
                renderAllVisualizations();
            }
        } else {
            // Minimize the pane
            resultsPane.classList.add('minimized');
            toggleButton.textContent = 'Expand Results';
            
            // Make sure visualization area is visible and full screen
            visualizationArea.classList.add('active');
            
            // Re-render visualizations if D3 and functions are available
            if (typeof renderAllVisualizations === 'function') {
                renderAllVisualizations();
            }
        }
    }

    /**
     * Resets the entire assessment, clearing all data and returning to the welcome screen.
     */
    function resetAssessment() {
        // Clear any pending timeouts
        clearTimeout(autoTransitionTimeout);

        currentStep = 0; // Reset to welcome screen
        assessmentData = {};
        tmtCompleted = false;
        tmtCurrentNumber = 1;
        tmtStartTime = null;
        finalPredictedScore = null; // Clear stored score

        // Reset all steps visibility
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById('step0').classList.add('active'); // Show welcome screen

        // Clear all input fields and selections
        document.querySelectorAll('input').forEach(input => {
            if (input.type === 'number' || input.type === 'text') {
                input.value = '';
            }
        });
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        document.querySelectorAll('.likert-option').forEach(opt => opt.classList.remove('selected'));

        // Reset TMT display
        initializeTMT(); // This will clear and re-render the grid

        // Clear results section content in resultsPane
        document.getElementById('predictedScore').textContent = '';
        document.getElementById('scoreInterpretation').innerHTML = '';
        document.getElementById('recommendations').innerHTML = '';
        if (typeof d3 !== 'undefined') {
            d3.select('#comparisonChart').selectAll("*").remove(); // Clear D3 comparison chart
        }

        // Also clear visualizations in the visualization area
        if (typeof d3 !== 'undefined') {
            d3.select('#viz1 svg').selectAll("*").remove();
            d3.select('#viz2 svg').selectAll("*").remove();
            d3.select('#viz3 svg').selectAll("*").remove();
        }

        // Reset resultsPane and visualizationArea styles to initial (hidden/default) state
        const resultsPane = document.getElementById('resultsPane');
        const visualizationArea = document.getElementById('visualizationArea');
        const mainContent = document.getElementById('mainContent');

        resultsPane.classList.remove('full-screen-results', 'minimized');
        visualizationArea.classList.remove('active');
        mainContent.classList.remove('active');

        // Show quiz container with a fade-in
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('quizContainer').style.opacity = 1;

        // Reset the scroll position of the quiz container
        document.getElementById('quizContainer').scrollTop = 0;

        updateProgress();
    }

  </script>
</body>
</html>
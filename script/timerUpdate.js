
setInterval(updateTimers, 1000);

function updateTimers(){
  const timers = document.querySelectorAll('.timer');
  timers.forEach((timer, index) => {
    const timerStart = new Date(parseInt(timer.getAttribute('data-time-start')));
    const timerEnd = new Date(parseInt(timer.getAttribute('data-time-end')));
    const timerWhat = timer.getAttribute('data-time-what')
    const currentTime = new Date();
    var calcValue, duration, output, days, hours, minutes, seconds;
    var timeComponents = [];
    switch (timerWhat){
        case "duration":
            calcValue = timerEnd - timerStart; 
            output = timeOutputGenerator(calcValue);
            timer.innerHTML = output; 
        break;

        case "progress":
            calcValue = currentTime - timerStart; 
            output = timeOutputGenerator(calcValue)
            timer.innerHTML = output; 
        break;

        case "elapsed":
            calcValue = currentTime - timerStart; 
            output = timeOutputGenerator(calcValue)
            timer.innerHTML = output + " elapsed"; 
        break;

        case "remaining":
            calcValue = timerEnd - currentTime;
            output = timeOutputGenerator(calcValue)
            timer.innerHTML = output + " remaining"; 
        break;

        case "progressBar":
            duration = timerEnd - timerStart;
            calcValue = currentTime - timerStart; 
            calcValue = Math.min((calcValue/ duration) * 100, 100)
            calcValue = calcValue.toFixed(2);
            timer.value = calcValue; 
        break;
    }



  });

}


function timeOutputGenerator(calcValue){
    seconds = Math.floor((calcValue / 1000) % 60);   // Remaining seconds after minutes
    minutes = Math.floor((calcValue / (1000 * 60)) % 60);  // Remaining minutes after hours
    hours = Math.floor((calcValue / (1000 * 60 * 60)) % 24); // Remaining hours after days
    days = Math.floor(calcValue / (1000 * 60 * 60 * 24));   // Total days

    const timeComponents = []; 
    if (days > 0) timeComponents.push(String(days).padStart(2, '0'));
    if (hours > 0) timeComponents.push(String(hours).padStart(2, '0')); 
    if (minutes > 0) timeComponents.push(String(minutes).padStart(2, '0')); 
    else if (minutes === 0) timeComponents.push('00'); // Changed to check for minutes being exactly 0
    if (seconds > 0) timeComponents.push(String(seconds).padStart(2, '0')); 
    else if (seconds === 0) timeComponents.push('00'); // Changed to check for seconds being exactly 0
    
    
    var output = timeComponents.length > 0 ? timeComponents.join(':') : '0';
    return output
}
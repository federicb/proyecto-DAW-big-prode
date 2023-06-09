
document.addEventListener('DOMContentLoaded', function() {

    const roundSelect = document.getElementById('roundSelect');
    let selectedRound = roundSelect.value;
    filterMatches(selectedRound);
    
    roundSelect.addEventListener('change', function() {
        selectedRound = roundSelect.value;
        filterMatches(selectedRound);
    });  
    
});

// agraga clase select-round a todos los inputs segun el round
function filterMatches(selectedRound) {
    const matchResults = document.querySelectorAll('.match-result');

    for (let i = 0; i < matchResults.length; i++) {
        const matchRound = matchResults[i].getAttribute('data-round');
        const inputs = matchResults[i].querySelectorAll('.forecasts');
        
        if (matchRound === selectedRound) {
            // matchResults[i].classList.add('selected-round');
            matchResults[i].style.display = 'block';
            
            for (let j = 0; j < inputs.length; j++) {
                inputs[j].classList.add('selected-round');
            }
        } else {
            // matchResults[i].classList.remove('selected-round');
            matchResults[i].style.display = 'none';
            
            for (let j = 0; j < inputs.length; j++) {
                inputs[j].classList.remove('selected-round');
            }
        }
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return day + '/' + month + ' ' + hours + ':' + minutes;
}

function validarNumeros(event) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const roundSelect = document.getElementById('roundSelect');
    const roundValue = roundSelect.value;

    const totalPointsInput = document.getElementById('totalPoints');
    const totalPoints = totalPointsInput.value;


    const formData = {};
    formData['round'] = roundValue;
    formData['totalPoints'] = totalPoints;

    document.querySelectorAll('.selected-round').forEach(function(input) {
        const name = input.name;
        const value = input.value;
        formData[name] = value;
        
    });

    // Renvio datos al servidor
    fetch('/add_update', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(function(response) {
        if (response.ok) {
            console.log('Datos recibidos correctamente');
            return response.ok;
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .then(function(data) {
        // Respuesta del servidor
        console.log(data);
        // Realiza redireccionamiento en el lado del servidor
        // window.location.href = req.get('referer');
        window.location.href = '/profile';
    })
    .catch(function(error) {

        console.error(error);
    });
});
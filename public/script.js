const slider = document.getElementById('volume');
const output = document.getElementById('volumeValue');

slider.addEventListener('input', function () {
    output.textContent = this.value;
});

const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('searchResults');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const goal = document.getElementById('searchInput').value;
    const level = document.getElementById('cars').value;
    const budget = document.getElementById('volume').value;
    const location = document.getElementById('location').value;
    const activityTypes = [...document.querySelectorAll('.checkbox-group input:checked')].map(cb => cb.value);

    form.style.display = 'none';
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `<p>Finding the best learning activities for you...</p>`;

    try{
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
            ,
            body: JSON.stringify({ goal, level, location, budget, activityTypes })
        });
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        resultsDiv.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
        console.error(err);
    }

});

function displayResults(results) {
    resultsDiv.innerHTML = `
        <h2>Recommended ProLearning Activities</h2>
        <br></br>
        <button id="backBtn">Back to Search</button>
        <br></br>
        <div id="cards"></div>
    `;

    const cardsDiv = document.getElementById('cards');

    results.forEach(activity => {
        cardsDiv.innerHTML += `
            <div class="card">
                <span class="badge">${activity.type}</span>
                <h3>${activity.name}</h3>
                <p>${activity.why}</p>
                <a href="${activity.url}" target="_blank">Learn More</a>
            </div>
        `;
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        form.style.display = 'block';
    });
}
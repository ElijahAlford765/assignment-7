
const randomSetup = document.getElementById('random-setup');
const randomDelivery = document.getElementById('random-delivery');
const refreshRandom = document.getElementById('refresh-random');
const categoryList = document.getElementById('category-list');
const categorySearch = document.getElementById('category-search');
const searchBtn = document.getElementById('search-category');
const jokesList = document.getElementById('jokes-list');
const addJokeForm = document.getElementById('add-joke-form');

async function loadRandomJoke() {
  try {
    const res = await fetch('/jokebook/random');
    const data = await res.json();

    if (data && data.setup && data.delivery) {
      randomSetup.textContent = data.setup;
      randomDelivery.textContent = data.delivery;
    } else {
      randomSetup.textContent = 'No jokes found.';
      randomDelivery.textContent = '';
    }
  } catch (err) {
    console.error('Error loading random joke:', err);
  }
}

refreshRandom.addEventListener('click', loadRandomJoke);
loadRandomJoke();


async function loadCategories() {
  const res = await fetch('/jokebook/categories');
  const data = await res.json();
  const categories = data.categories || [];
  categoryList.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.addEventListener('click', () => loadJokesByCategory(cat));
    categoryList.appendChild(li);
  });
}


async function loadJokesByCategory(category) {
  const res = await fetch(`/jokebook/category/${category}`);
  const data = await res.json();
  const jokes = data.jokes || [];
  
  jokesList.innerHTML = `<h3>Jokes in "${category}"</h3>`;
  jokes.forEach(j => {
    const div = document.createElement('div');
    div.innerHTML = `<p><strong>${j.setup}</strong><br>${j.delivery}</p>`;
    jokesList.appendChild(div);
  });
}


searchBtn.addEventListener('click', () => {
  const category = categorySearch.value.trim();
  if (category) loadJokesByCategory(category);
});

document.getElementById('add-joke-form').addEventListener('submit', async e => {
  e.preventDefault(); 

  const category = document.getElementById('new-category').value.trim();
  const setup = document.getElementById('new-setup').value.trim();
  const delivery = document.getElementById('new-delivery').value.trim();

  if (!category || !setup || !delivery) {
    alert('Please fill in all fields');
    return;
  }

 
  const res = await fetch('/jokebook/joke/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, setup, delivery })
  });

  if (res.ok) {
    const data = await res.json();
    alert('Joke added successfully!');
    console.log('Server returned:', data);

    
    loadJokesByCategory(category);
    document.getElementById('add-joke-form').reset();
  } else {
    const err = await res.json();
    alert('Failed to add joke: ' + err.error);
  }
});


loadRandomJoke();
loadCategories();

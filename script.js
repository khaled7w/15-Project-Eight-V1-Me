const searchIcon = document.querySelector('.icon1');
const shuffelIcon = document.querySelector('.icon2');
const searchInput = document.getElementById('search');
const showSearch = document.querySelector('.show-search');
const mealContainer = document.querySelector('.meals-container');
const detailsOfMeal = document.querySelector('.details-of-meal');

let mealsData = [];
let ingridents = [];

//search for meal after take input from user
async function fetchMeal() {
  clear();

  const meal = searchInput.value;
  if (!meal) {
    return;
  }
  let meals;
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
    );

    meals = await res.json();
  } catch (err) {
    throw 'Something went wrong ' + err.message;
  }

  const allMeals = Array.from(meals.meals);
  if (!allMeals) {
    return;
  }
  showSearch.textContent = `Search results for '${meal}'`;
  allMeals.forEach((meal) => {
    for (let i = 1; i <= 20; i++) {
      ingridents.push(meal[`strIngredient${i}`]);
    }
    mealsData.push({
      title: meal['strMeal'],
      area: meal['strArea'],
      category: meal['strCategory'],
      allIngridents: [...ingridents],
      img: meal['strMealThumb'],
      instructions: meal['strInstructions'],
    });
  });

  ingridents = [];
  renderMeals();
}

//render meal to the dom
function renderMeals() {
  let title;
  let img;
  mealsData.forEach((meal, index) => {
    title = meal.title;
    img = meal.img;

    //Handle img
    const imgSection = document.createElement('img');
    imgSection.src = `${img}`;
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img-container');
    imgDiv.appendChild(imgSection);

    //Handle title
    const titleSection = document.createElement('h1');
    titleSection.textContent = title;
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('content');
    titleDiv.appendChild(titleSection);

    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    mealDiv.appendChild(imgDiv);
    mealDiv.appendChild(titleDiv);
    mealContainer.appendChild(mealDiv);

    mealDiv.addEventListener('click', () => {
      showDetails(index);
    });
  });
}

//show all details about meal after click it
function showDetails(index) {
  if (mealsData.length === 0) {
    return;
  }
  const title = mealsData[index].title;
  const img = mealsData[index].img;
  const area = mealsData[index].area;
  const category = mealsData[index].category;
  const instructions = mealsData[index].instructions;
  const allIngridents = mealsData[index].allIngridents;

  const mealTitle = document.querySelector('.details-of-meal .meal-title');
  mealTitle.textContent = title;
  const mealImg = document.querySelector('.details-of-meal img');
  mealImg.src = img;
  const mealCountry = document.querySelector('.details-of-meal .meal-data .p1');
  mealCountry.textContent = area;
  const mealCategory = document.querySelector(
    '.details-of-meal .meal-data .p2'
  );
  mealCategory.textContent = category;
  const mealInstruction = document.querySelector(
    '.details-of-meal .meal-instructions p'
  );
  mealInstruction.textContent = instructions;
  const ingridentSection = document.querySelector('.ingrident-section');
  allIngridents.forEach((ingrident) => {
    if (!ingrident) {
      return;
    }
    const span = document.createElement('span');
    span.textContent = ingrident;
    span.classList.add('ingrident');
    ingridentSection.appendChild(span);
  });
  detailsOfMeal.style.display = 'flex';
}

//get a random meal to the user
async function fetchRandomMeal() {
  searchInput.value = '';
  clear();
  let meal;
  try {
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    const data = await res.json();
    meal = await data.meals[0];
  } catch (err) {
    throw 'Something went wrong ' + err.message();
  }

  for (let i = 1; i <= 20; i++) {
    ingridents.push(meal[`strIngredient${i}`]);
  }
  const details = {
    title: meal['strMeal'],
    area: meal['strArea'],
    category: meal['strCategory'],
    allIngridents: [...ingridents],
    img: meal['strMealThumb'],
    instructions: meal['strInstructions'],
  };

  mealsData.push(details);
  renderMeals();
}

function clear() {
  mealContainer.innerHTML = '';
  showSearch.textContent = '';
  detailsOfMeal.style.display = 'none';
  mealsData = [];
  ingridents;
}

searchIcon.addEventListener('click', fetchMeal);
shuffelIcon.addEventListener('click', fetchRandomMeal);
window.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    fetchMeal();
  }
});

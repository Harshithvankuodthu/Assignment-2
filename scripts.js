document.addEventListener('DOMContentLoaded', function () {
    const recipeContainer = document.getElementById('recipes');
    const searchBtn = document.getElementById('search-btn');
    const searchBox = document.getElementById('search-box');
    let allRecipes = [];
    let previousRecipes = [];

    searchBtn.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query !== '') {
            const filteredRecipes = allRecipes.filter(recipe =>
                recipe.strMeal.toLowerCase().includes(query.toLowerCase())
            );
            displayRecipes(filteredRecipes);
        } else {
            alert("Please enter a search term");
        }
    });

    async function fetchVegetarianRecipes() {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`;

        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            if (data.meals) {
                await Promise.all(data.meals.map(meal => fetchRecipeDetails(meal.idMeal)));
            } else {
                recipeContainer.innerHTML = `<p>No vegetarian recipes found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching data from the API:', error);
            recipeContainer.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
        }
    }

    async function fetchChickenRecipes() {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken`;

        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            if (data.meals) {
                await Promise.all(data.meals.map(meal => fetchRecipeDetails(meal.idMeal)));
            } else {
                recipeContainer.innerHTML = `<p>No chicken recipes found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching data from the API:', error);
            recipeContainer.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
        }
    }

    async function fetchRecipeDetails(id) {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            if (data.meals) {
                allRecipes.push(data.meals[0]);
                displayRecipes(allRecipes);
            }
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }

    function displayRecipes(recipes) {
        recipeContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            recipeElement.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image">
                <h2 class="recipe-title">${recipe.strMeal}</h2>
                <div class="recipe-details" style="display: none;">
                    <p><strong>Recipe ID:</strong> ${recipe.idMeal}</p>
                    <p><strong>Category:</strong> ${recipe.strCategory}</p> <!-- Added category -->
                    <p><strong>Origin:</strong> ${recipe.strArea}</p>
                    <h3>Ingredients:</h3>
                    <ul>${getIngredients(recipe).map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                    <h3>Instructions:</h3>
                    <p>${recipe.strInstructions}</p>
                    <button class="go-back-btn">Go Back</button> <!-- Go Back Button -->
                </div>
            `;

            const recipeTitle = recipeElement.querySelector('.recipe-title');
            const recipeImage = recipeElement.querySelector('.recipe-image');
            const details = recipeElement.querySelector('.recipe-details');
            const goBackBtn = recipeElement.querySelector('.go-back-btn');

            const toggleDetails = () => {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            };

            recipeTitle.addEventListener('click', toggleDetails);
            recipeImage.addEventListener('click', toggleDetails);

            goBackBtn.addEventListener('click', () => {
                details.style.display = 'none';
            });

            recipeContainer.appendChild(recipeElement);
        });
    }

    function getIngredients(recipe) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${ingredient} - ${measure}`);
            }
        }
        return ingredients;
    }
    fetchVegetarianRecipes();
    fetchChickenRecipes();
});

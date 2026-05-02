// Recipe display and rendering functionality
class RecipeDisplay {
    constructor() {
        this.recipeGrid = document.getElementById('recipeGrid');
        this.recipeDetail = document.getElementById('recipeDetail');
        this.recipeContent = document.getElementById('recipeContent');
    }
    
    renderRecipeGrid(recipes, onRecipeClick, selectionMode = false, selectedRecipes = new Set()) {
        if (!this.recipeGrid) return;
        
        if (recipes.length === 0) {
            this.recipeGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>No recipes found</h3>
                    <p>Try adjusting your search terms or browse all recipes.</p>
                </div>
            `;
            return;
        }
        
        this.recipeGrid.innerHTML = recipes.map(recipe => 
            this.createRecipeCard(recipe, selectionMode, selectedRecipes.has(recipe.id))
        ).join('');
        
        // Add click listeners to recipe cards
        this.recipeGrid.querySelectorAll('.recipe-card').forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Prevent card click when clicking checkbox
                if (e.target.classList.contains('selection-checkbox')) {
                    return;
                }
                onRecipeClick(recipes[index]);
            });
            
            // Add checkbox click listener
            const checkbox = card.querySelector('.selection-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onRecipeClick(recipes[index]);
                });
            }
        });
    }
    
    createRecipeCard(recipe, selectionMode = false, isSelected = false) {
        const tagsHtml = recipe.tags ? 
            recipe.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        
        const selectionClass = selectionMode ? 'selection-mode' : '';
        const selectedClass = isSelected ? 'selected' : '';
        
        return `
            <div class="recipe-card ${selectionClass} ${selectedClass}" data-recipe-id="${recipe.id}">
                <div class="selection-checkbox"></div>
                <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=Recipe'}" 
                     alt="${recipe.name}" 
                     onerror="if(!this.dataset.errorHandled){this.dataset.errorHandled='true';this.style.display='none';}">
                <div class="recipe-card-content">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <div class="recipe-meta">
                        <span>⏱️ ${recipe.cookingTime} min</span>
                        <span>👥 ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-tags">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderRecipeDetail(recipe) {
        if (!this.recipeContent) return;
        
        const ingredientsHtml = recipe.ingredients.map(ingredient => 
            `<li>${ingredient}</li>`
        ).join('');
        
        const instructionsHtml = recipe.instructions.map((instruction, index) => 
            `<li>${instruction}</li>`
        ).join('');
        
        const tagsHtml = recipe.tags ? 
            recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        
        this.recipeContent.innerHTML = `
            <h2>${recipe.name}</h2>
            
            <div class="recipe-info">
                <div>
                    <strong>⏱️ ${recipe.cookingTime}</strong>
                    <span>minutes</span>
                </div>
                <div>
                    <strong>👥 ${recipe.servings}</strong>
                    <span>servings</span>
                </div>
                <div>
                    <strong>📊 ${recipe.difficulty || 'Medium'}</strong>
                    <span>difficulty</span>
                </div>
                <div>
                    <strong>🍽️ ${recipe.category || 'Main'}</strong>
                    <span>category</span>
                </div>
            </div>
            
            ${recipe.image ? `
                <img src="${recipe.image}" 
                     alt="${recipe.name}" 
                     style="width: 100%; max-width: 500px; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 2rem;"
                     onerror="if(!this.dataset.errorHandled){this.dataset.errorHandled='true';this.style.display='none';}">
            ` : ''}
            
            <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">${recipe.description}</p>
            
            <div class="ingredients">
                <h3>🛒 Ingredients</h3>
                <ul>
                    ${ingredientsHtml}
                </ul>
            </div>
            
            <div class="instructions">
                <h3>👨‍🍳 Instructions</h3>
                <ol>
                    ${instructionsHtml}
                </ol>
            </div>
            
            ${recipe.tags ? `
                <div style="margin-top: 2rem;">
                    <h3>🏷️ Tags</h3>
                    <div class="recipe-tags">
                        ${tagsHtml}
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    renderShoppingList(selectedRecipes) {
        if (!selectedRecipes || selectedRecipes.length === 0) {
            document.getElementById('shoppingListContent').innerHTML = `
                <h2>Shopping List</h2>
                <p>No recipes selected. Go back and select some recipes to generate a shopping list.</p>
            `;
            return;
        }
        
        // Aggregate ingredients from all selected recipes
        const ingredientMap = new Map();
        
        selectedRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                if (ingredientMap.has(ingredient)) {
                    ingredientMap.get(ingredient).recipes.push(recipe.name);
                } else {
                    ingredientMap.set(ingredient, {
                        name: ingredient,
                        recipes: [recipe.name]
                    });
                }
            });
        });
        
        // Sort ingredients alphabetically
        const sortedIngredients = Array.from(ingredientMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
        
        const ingredientsHtml = sortedIngredients.map(ingredient => `
            <div class="ingredient-item">
                <span class="ingredient-name">${ingredient.name}</span>
                <span class="ingredient-recipes">Used in: ${ingredient.recipes.join(', ')}</span>
            </div>
        `).join('');
        
        document.getElementById('shoppingListContent').innerHTML = `
            <h2>Shopping List</h2>
            <p>Ingredients needed for ${selectedRecipes.length} selected recipe${selectedRecipes.length > 1 ? 's' : ''}:</p>
            
            <div class="ingredient-group">
                <h4>All Ingredients (${sortedIngredients.length} items)</h4>
                ${ingredientsHtml}
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                <h4>Selected Recipes:</h4>
                <ul style="margin-top: 0.5rem;">
                    ${selectedRecipes.map(recipe => `<li>${recipe.name} (${recipe.servings} servings)</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Utility method to format cooking time
    formatCookingTime(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? 
                `${hours}h ${remainingMinutes}min` : 
                `${hours}h`;
        }
    }
}

// Initialize display functionality
window.recipeDisplay = new RecipeDisplay();

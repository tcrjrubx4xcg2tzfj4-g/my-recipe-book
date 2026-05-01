// Recipe display and rendering functionality
class RecipeDisplay {
    constructor() {
        this.recipeGrid = document.getElementById('recipeGrid');
        this.recipeDetail = document.getElementById('recipeDetail');
        this.recipeContent = document.getElementById('recipeContent');
    }
    
    renderRecipeGrid(recipes, onRecipeClick) {
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
            this.createRecipeCard(recipe)
        ).join('');
        
        // Add click listeners to recipe cards
        this.recipeGrid.querySelectorAll('.recipe-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                onRecipeClick(recipes[index]);
            });
        });
    }
    
    createRecipeCard(recipe) {
        const tagsHtml = recipe.tags ? 
            recipe.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
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

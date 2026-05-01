// Search functionality for recipes
class RecipeSearch {
    constructor() {
        this.searchDelay = 300; // Debounce delay in milliseconds
        this.searchTimeout = null;
    }
    
    search(recipes, query) {
        if (!query || query.trim() === '') {
            return recipes;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        return recipes.filter(recipe => {
            // Search in recipe name
            if (recipe.name.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in description
            if (recipe.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in ingredients
            if (recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm))) {
                return true;
            }
            
            // Search in tags
            if (recipe.tags && recipe.tags.some(tag => 
                tag.toLowerCase().includes(searchTerm))) {
                return true;
            }
            
            // Search in category
            if (recipe.category && recipe.category.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            return false;
        });
    }
    
    // Advanced search with multiple criteria
    advancedSearch(recipes, criteria) {
        return recipes.filter(recipe => {
            // Check cooking time filter
            if (criteria.maxCookingTime && recipe.cookingTime > criteria.maxCookingTime) {
                return false;
            }
            
            // Check difficulty filter
            if (criteria.difficulty && recipe.difficulty !== criteria.difficulty) {
                return false;
            }
            
            // Check category filter
            if (criteria.category && recipe.category !== criteria.category) {
                return false;
            }
            
            // Check required ingredients (all must be present)
            if (criteria.requiredIngredients && criteria.requiredIngredients.length > 0) {
                const hasAllIngredients = criteria.requiredIngredients.every(required =>
                    recipe.ingredients.some(ingredient =>
                        ingredient.toLowerCase().includes(required.toLowerCase())
                    )
                );
                if (!hasAllIngredients) {
                    return false;
                }
            }
            
            // Check excluded ingredients (none should be present)
            if (criteria.excludedIngredients && criteria.excludedIngredients.length > 0) {
                const hasExcludedIngredient = criteria.excludedIngredients.some(excluded =>
                    recipe.ingredients.some(ingredient =>
                        ingredient.toLowerCase().includes(excluded.toLowerCase())
                    )
                );
                if (hasExcludedIngredient) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Get unique values for filters
    getFilterOptions(recipes) {
        const categories = [...new Set(recipes.map(r => r.category))].filter(Boolean);
        const difficulties = [...new Set(recipes.map(r => r.difficulty))].filter(Boolean);
        const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))];
        const allTags = [...new Set(recipes.flatMap(r => r.tags || []))];
        
        return {
            categories: categories.sort(),
            difficulties: difficulties.sort(),
            ingredients: allIngredients.sort(),
            tags: allTags.sort()
        };
    }
}

// Initialize search functionality
window.recipeSearch = new RecipeSearch();

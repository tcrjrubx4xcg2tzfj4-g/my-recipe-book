// Main application logic
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentView = 'grid'; // 'grid' or 'detail'
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadRecipes();
            this.setupEventListeners();
            this.displayRecipes(this.recipes);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load recipes. Please try again later.');
        }
    }
    
    async loadRecipes() {
        try {
            const response = await fetch('data/recipes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.recipes = data.recipes;
            this.filteredRecipes = [...this.recipes];
        } catch (error) {
            console.error('Error loading recipes:', error);
            // Fallback to empty array if JSON fails to load
            this.recipes = [];
            this.filteredRecipes = [];
        }
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearButton = document.getElementById('clearSearch');
        const backButton = document.getElementById('backButton');
        
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
        });
        
        backButton.addEventListener('click', () => {
            this.showRecipeGrid();
        });
    }
    
    handleSearch(query) {
        if (window.recipeSearch) {
            this.filteredRecipes = window.recipeSearch.search(this.recipes, query);
            this.displayRecipes(this.filteredRecipes);
        }
    }
    
    displayRecipes(recipes) {
        if (window.recipeDisplay) {
            window.recipeDisplay.renderRecipeGrid(recipes, (recipe) => {
                this.showRecipeDetail(recipe);
            });
        }
    }
    
    showRecipeDetail(recipe) {
        this.currentView = 'detail';
        if (window.recipeDisplay) {
            window.recipeDisplay.renderRecipeDetail(recipe);
        }
        
        document.getElementById('recipeGrid').style.display = 'none';
        document.getElementById('recipeDetail').classList.remove('hidden');
    }
    
    showRecipeGrid() {
        this.currentView = 'grid';
        document.getElementById('recipeGrid').style.display = 'grid';
        document.getElementById('recipeDetail').classList.add('hidden');
    }
    
    showError(message) {
        const recipeGrid = document.getElementById('recipeGrid');
        recipeGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.recipeManager = new RecipeManager();
});

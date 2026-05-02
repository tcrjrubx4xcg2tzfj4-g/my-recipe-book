// Main application logic
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentView = 'grid'; // 'grid' or 'detail'
        this.isShuffled = false;
        this.selectedRecipes = new Set();
        this.selectionMode = false;
        
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
        const shuffleButton = document.getElementById('shuffleButton');
        const backButton = document.getElementById('backButton');
        
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
        });
        
        shuffleButton.addEventListener('click', () => {
            this.shuffleRecipes();
        });
        
        backButton.addEventListener('click', () => {
            this.showRecipeGrid();
        });
        
        const selectModeButton = document.getElementById('selectModeButton');
        const viewShoppingListButton = document.getElementById('viewShoppingListButton');
        const clearSelectionsButton = document.getElementById('clearSelectionsButton');
        const backFromShoppingButton = document.getElementById('backFromShoppingButton');
        
        selectModeButton.addEventListener('click', () => {
            this.toggleSelectionMode();
        });
        
        viewShoppingListButton.addEventListener('click', () => {
            this.showShoppingList();
        });
        
        clearSelectionsButton.addEventListener('click', () => {
            this.clearSelections();
        });
        
        backFromShoppingButton.addEventListener('click', () => {
            this.showRecipeGrid();
        });
    }
    
    handleSearch(query) {
        if (window.recipeSearch) {
            this.filteredRecipes = window.recipeSearch.search(this.recipes, query);
            this.displayRecipes(this.filteredRecipes);
        }
    }
    
    shuffleRecipes() {
        // Fisher-Yates shuffle algorithm
        const shuffled = [...this.filteredRecipes];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.filteredRecipes = shuffled;
        this.isShuffled = true;
        this.displayRecipes(this.filteredRecipes);
    }
    
    displayRecipes(recipes) {
        if (window.recipeDisplay) {
            window.recipeDisplay.renderRecipeGrid(recipes, (recipe) => {
                if (this.selectionMode) {
                    this.toggleRecipeSelection(recipe);
                } else {
                    this.showRecipeDetail(recipe);
                }
            }, this.selectionMode, this.selectedRecipes);
        }
    }
    
    toggleSelectionMode() {
        this.selectionMode = !this.selectionMode;
        const selectModeButton = document.getElementById('selectModeButton');
        const viewShoppingListButton = document.getElementById('viewShoppingListButton');
        const clearSelectionsButton = document.getElementById('clearSelectionsButton');
        
        if (this.selectionMode) {
            selectModeButton.textContent = 'Exit Selection';
            selectModeButton.classList.add('active');
            viewShoppingListButton.classList.remove('hidden');
            clearSelectionsButton.classList.remove('hidden');
        } else {
            selectModeButton.textContent = 'Select Recipes';
            selectModeButton.classList.remove('active');
            viewShoppingListButton.classList.add('hidden');
            clearSelectionsButton.classList.add('hidden');
            this.clearSelections();
        }
        
        this.displayRecipes(this.filteredRecipes);
    }
    
    toggleRecipeSelection(recipe) {
        if (this.selectedRecipes.has(recipe.id)) {
            this.selectedRecipes.delete(recipe.id);
        } else {
            this.selectedRecipes.add(recipe.id);
        }
        this.updateSelectionUI();
    }
    
    updateSelectionUI() {
        const viewShoppingListButton = document.getElementById('viewShoppingListButton');
        viewShoppingListButton.textContent = `View Shopping List (${this.selectedRecipes.size})`;
        
        // Update recipe card selection states
        document.querySelectorAll('.recipe-card').forEach(card => {
            const recipeId = parseInt(card.dataset.recipeId);
            if (this.selectedRecipes.has(recipeId)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }
    
    clearSelections() {
        this.selectedRecipes.clear();
        this.updateSelectionUI();
    }
    
    showShoppingList() {
        this.currentView = 'shopping';
        if (window.recipeDisplay) {
            const selectedRecipeObjects = this.recipes.filter(recipe => 
                this.selectedRecipes.has(recipe.id)
            );
            window.recipeDisplay.renderShoppingList(selectedRecipeObjects);
        }
        
        document.getElementById('recipeGrid').style.display = 'none';
        document.getElementById('recipeDetail').classList.add('hidden');
        document.getElementById('shoppingList').classList.remove('hidden');
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
        document.getElementById('shoppingList').classList.add('hidden');
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

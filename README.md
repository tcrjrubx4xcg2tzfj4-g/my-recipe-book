# Personal Recipe Manager

A client-side recipe management web application that allows you to search and browse recipes by name and ingredients. Built with vanilla HTML, CSS, and JavaScript for easy hosting on GitHub Pages.

## Features

- **Recipe Browsing**: View all recipes in a clean, responsive grid layout
- **Search Functionality**: Search recipes by name, ingredients, tags, or category
- **Recipe Details**: Click any recipe to view full ingredients and step-by-step instructions
- **Responsive Design**: Works great on desktop, tablet, and mobile devices
- **Fast & Lightweight**: No external dependencies, loads quickly

## Getting Started

### Local Development

1. Clone this repository
2. Open `index.html` in your web browser
3. Start browsing and searching recipes!

### GitHub Pages Deployment

1. Fork or clone this repository to your GitHub account
2. Go to repository Settings → Pages
3. Set source to "Deploy from a branch" and select "main"
4. Your recipe manager will be available at `https://yourusername.github.io/repository-name`

## Project Structure

```
recipe-manager/
├── index.html              # Main application page
├── css/
│   └── styles.css         # Stylesheet
├── js/
│   ├── app.js            # Main application logic
│   ├── search.js         # Search functionality
│   └── recipe-display.js # Recipe rendering
├── data/
│   └── recipes.json      # Recipe database
└── README.md            # This file
```

## Adding Your Own Recipes

Edit the `data/recipes.json` file to add your own recipes. Each recipe should follow this structure:

```json
{
  "id": 1,
  "name": "Recipe Name",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "cookingTime": 30,
  "servings": 4,
  "difficulty": "easy",
  "category": "dinner",
  "tags": ["tag1", "tag2"]
}
```

## Customization

- **Styling**: Modify `css/styles.css` to change colors, fonts, and layout
- **Functionality**: Extend the JavaScript files to add new features
- **Data**: Add more recipes to `data/recipes.json`

## Browser Support

This application works in all modern browsers that support ES6+ JavaScript features.

## License

This project is open source and available under the MIT License.

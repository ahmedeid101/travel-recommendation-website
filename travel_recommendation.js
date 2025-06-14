// DOM Elements
const searchBtn = document.querySelector('.search-btn');
const resetBtn = document.querySelector('.reset-btn');
const searchInput = document.querySelector('.search-input');
const resultsContainer = document.getElementById('recommendation-results');
const recommendationsContainer = document.querySelector('.recommendations-container');
const heroContent = document.querySelector('.overlay-section');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
//resetBtn.addEventListener('click', handleReset);

// Handle Search
async function handleSearch() {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    try {
        // Show loading state
        resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
        recommendationsContainer.style.display = 'block';
        heroContent.style.display = 'block';

        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) throw new Error('Failed to load data');

        const data = await response.json();
        const normalizedTerm = normalizeKeyword(searchTerm.toLowerCase());

        let results = [];
        if (normalizedTerm === 'beach') {
            results = data.beaches.slice(0, 2);
        } else if (normalizedTerm === 'temple') {
            results = data.temples.slice(0, 2);
        } else if (normalizedTerm === 'country') {
            results = data.countries
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .flatMap(country => country.cities[0]);
        } else {
            results = [
                ...data.beaches,
                ...data.temples,
                ...data.countries.flatMap(country => country.cities)
            ].filter(item =>
                item.name.toLowerCase().includes(normalizedTerm) ||
                item.description.toLowerCase().includes(normalizedTerm)
            );
        }

        displayResults(results);

    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>Error performing search</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Handle Reset
function handleReset() {
    searchInput.value = '';
    recommendationsContainer.style.display = 'none';
    heroContent.style.display = 'block';
}

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  resultsContainer.innerHTML = '';
});

// Display Results
function displayResults(results) {
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No results found. Try "beach", "temple", or country names.</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(item => {
        const timeZone = item.timeZone || 'UTC'; // fallback if not available
        const timeString = new Date().toLocaleTimeString('en-US', {
            timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        return `
            <div class="recommendation-card">
                <div class="recommendation-image">
                    <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='images/default.jpg'">
                </div>
                <div class="recommendation-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p><strong>Local Time:</strong> ${timeString}</p>
                </div>
            </div>
        `;
    }).join('');
}


// Normalize Keyword Variants
function normalizeKeyword(term) {
    const keywordMap = {
        'beaches': 'beach',
        'sea': 'beach',
        'ocean': 'beach',
        'temples': 'temple',
        'shrine': 'temple',
        'countries': 'country',
        'nation': 'country'
    };
    return keywordMap[term] || term;
}





// document.addEventListener('DOMContentLoaded', function() {
//     // Get all elements with proper selectors
//     const elements = {
//         searchBtn: document.querySelector('.search-btn'),
//         resetBtn: document.querySelector('.reset-btn'),
//         searchInput: document.querySelector('.search-input'),
//         heroContent: document.getElementById('hero-content'),
//         recommendationsContainer: document.getElementById('recommendations-container'),
//         resultsContainer: document.getElementById('recommendation-results')
//     };

//     // Debug: Log all found elements
//     console.log('Found elements:', elements);

//     // Verify all critical elements exist
//     let allElementsFound = true;
//     for (const [name, element] of Object.entries(elements)) {
//         if (!element) {
//             console.error(`Missing element: ${name}`);
//             allElementsFound = false;
//         }
//     }

//     if (!allElementsFound) {
//         console.error('Some critical elements are missing from the page!');
//         // Show user-friendly error
//         const errorDiv = document.createElement('div');
//         errorDiv.className = 'global-error';
//         errorDiv.innerHTML = '<p>Page failed to load properly. Please refresh.</p>';
//         document.body.prepend(errorDiv);
//         return;
//     }

//     // If we get here, all elements exist - proceed with setup
//     const {
//         searchBtn,
//         resetBtn,
//         searchInput,
//         heroContent,
//         recommendationsContainer,
//         resultsContainer
//     } = elements;

//     // Event listeners
//     searchBtn.addEventListener('click', handleSearch);
//     resetBtn.addEventListener('click', handleReset);
//     searchInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') handleSearch();
//     });

    // async function handleSearch() {
    //     const searchTerm = searchInput.value.trim();
        
    //     if (!searchTerm) {
    //         alert('Please enter a search term');
    //         return;
    //     }

    //     try {
    //         // Show loading state
    //         resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
    //         recommendationsContainer.style.display = 'block';
    //         heroContent.style.display = 'none';

    //         const response = await fetch('travel_recommendation_api.json');
    //         if (!response.ok) throw new Error('Failed to load data');
            
    //         const data = await response.json();
    //         const normalizedTerm = normalizeKeyword(searchTerm.toLowerCase());

    //         let results = [];
    //         if (normalizedTerm === 'beach') {
    //             results = data.beaches.slice(0, 2);
    //         } else if (normalizedTerm === 'temple') {
    //             results = data.temples.slice(0, 2);
    //         } else if (normalizedTerm === 'country') {
    //             results = data.countries
    //                 .sort(() => 0.5 - Math.random())
    //                 .slice(0, 2)
    //                 .flatMap(country => country.cities[0]);
    //         } else {
    //             results = [
    //                 ...data.beaches,
    //                 ...data.temples,
    //                 ...data.countries.flatMap(country => country.cities)
    //             ].filter(item => 
    //                 item.name.toLowerCase().includes(normalizedTerm) || 
    //                 item.description.toLowerCase().includes(normalizedTerm)
    //             );
    //         }

    //         displayResults(results);
            
    //     } catch (error) {
    //         console.error('Search error:', error);
    //         resultsContainer.innerHTML = `
    //             <div class="error-message">
    //                 <p>Error performing search</p>
    //                 <p>${error.message}</p>
    //             </div>
    //         `;
    //     }
    // }

    // function handleReset() {
    //     searchInput.value = '';
    //     recommendationsContainer.style.display = 'none';
    //     heroContent.style.display = 'block';
    // }

    // function displayResults(results) {
    //     if (!results || results.length === 0) {
    //         resultsContainer.innerHTML = '<p class="no-results">No results found. Try "beach", "temple", or country names.</p>';
    //         return;
    //     }

    //     resultsContainer.innerHTML = results.map(item => `
    //         <div class="recommendation-card">
    //             <div class="recommendation-image">
    //                 <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='images/default.jpg'">
    //             </div>
    //             <div class="recommendation-details">
    //                 <h3>${item.name}</h3>
    //                 <p>${item.description}</p>
    //             </div>
    //         </div>
    //     `).join('');
    // }

    // function normalizeKeyword(term) {
    //     const keywordMap = {
    //         'beaches': 'beach', 'sea': 'beach', 'ocean': 'beach',
    //         'temples': 'temple', 'shrine': 'temple',
    //         'countries': 'country', 'nation': 'country'
    //     };
    //     return keywordMap[term] || term;
    // }

// });

// // Add this CSS for the error message
// const style = document.createElement('style');
// style.textContent = `
// .global-error {
//     background-color: #ffebee;
//     color: #d32f2f;
//     padding: 20px;
//     text-align: center;
//     border-bottom: 2px solid #f44336;
//     font-size: 18px;
// }
// `;
// document.head.appendChild(style);


// document.addEventListener('DOMContentLoaded', function() {
//     // Get DOM elements
//     const searchBtn = document.querySelector('.search-btn');
//     const resetBtn = document.querySelector('.reset-btn');
//     const searchInput = document.querySelector('input[type="text"]');
//     const heroContent = document.getElementById('hero-content');
//     const recommendationsContainer = document.getElementById('recommendations-container');
//     const resultsContainer = document.getElementById('recommendation-results');

//     // Verify all elements exist
//     if (!searchBtn || !resetBtn || !searchInput || !heroContent || !recommendationsContainer || !resultsContainer) {
//         console.error('Critical elements missing!');
//         return;
//     }

//     // Event listeners
//     searchBtn.addEventListener('click', handleSearch);
//     resetBtn.addEventListener('click', handleReset);
//     searchInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') handleSearch();
//     });

//     async function handleSearch() {
//         const searchTerm = searchInput.value.trim();
        
//         if (!searchTerm) {
//             alert('Please enter a search term');
//             return;
//         }

//         try {
//             // Show loading state
//             resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
//             recommendationsContainer.style.display = 'block';
//             heroContent.style.display = 'none';

//             const response = await fetch('travel_recommendation_api.json');
//             if (!response.ok) throw new Error('Failed to load data');
            
//             const data = await response.json();
//             const normalizedTerm = normalizeKeyword(searchTerm.toLowerCase());

//             let results = [];
//             if (normalizedTerm === 'beach') {
//                 results = data.beaches.slice(0, 2);
//             } else if (normalizedTerm === 'temple') {
//                 results = data.temples.slice(0, 2);
//             } else if (normalizedTerm === 'country') {
//                 results = data.countries
//                     .sort(() => 0.5 - Math.random())
//                     .slice(0, 2)
//                     .flatMap(country => country.cities[0]);
//             } else {
//                 results = [
//                     ...data.beaches,
//                     ...data.temples,
//                     ...data.countries.flatMap(country => country.cities)
//                 ].filter(item => 
//                     item.name.toLowerCase().includes(normalizedTerm) || 
//                     item.description.toLowerCase().includes(normalizedTerm)
//                 );
//             }

//             displayResults(results);
            
//         } catch (error) {
//             console.error('Search error:', error);
//             resultsContainer.innerHTML = `
//                 <div class="error-message">
//                     <p>Error performing search</p>
//                     <p>${error.message}</p>
//                 </div>
//             `;
//         }
//     }

//     function handleReset() {
//         searchInput.value = '';
//         recommendationsContainer.style.display = 'none';
//         heroContent.style.display = 'block';
//     }

//     function displayResults(results) {
//         if (!results || results.length === 0) {
//             resultsContainer.innerHTML = '<p class="no-results">No results found. Try "beach", "temple", or country names.</p>';
//             return;
//         }

//         resultsContainer.innerHTML = results.map(item => `
//             <div class="recommendation-card">
//                 <div class="recommendation-image">
//                     <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='images/default.jpg'">
//                 </div>
//                 <div class="recommendation-details">
//                     <h3>${item.name}</h3>
//                     <p>${item.description}</p>
//                 </div>
//             </div>
//         `).join('');
//     }

//     function normalizeKeyword(term) {
//         const keywordMap = {
//             'beaches': 'beach', 'sea': 'beach', 'ocean': 'beach',
//             'temples': 'temple', 'shrine': 'temple',
//             'countries': 'country', 'nation': 'country'
//         };
//         return keywordMap[term] || term;
//     }
// });


// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize the page
//     fetchAndDisplayRecommendations();
    
//     // Set up event listeners
//     document.querySelector('.search-btn').addEventListener('click', handleSearch);
//     document.querySelector('.reset-btn').addEventListener('click', handleReset);
//     document.querySelector('.search-input').addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') handleSearch();
//     });

//     // Display results in the UI
//     function displayResults(results, category) {
//         const resultsContainer = document.getElementById('recommendation-results');
        
//         if (!results || results.length === 0) {
//             resultsContainer.innerHTML = '<p class="message">No results found. Try "beach", "temple", or country names.</p>';
//             return;
//         }

//         // Add category title if provided
//         const categoryTitle = category ? `<h2 class="category-title">${category.toUpperCase()}</h2>` : '';
        
//         resultsContainer.innerHTML = categoryTitle + results.map(item => `
//             <div class="recommendation-card">
//                 <div class="recommendation-image">
//                     <img src="${item.imageUrl}" alt="${item.name}" onerror="this.onerror=null;this.src='images/default.jpg';">
//                 </div>
//                 <div class="recommendation-info">
//                     <h3>${item.name}</h3>
//                     <p>${item.description}</p>
//                 </div>
//             </div>
//         `).join('');
//     }

//     // Handle search functionality
//     async function handleSearch() {
//         const searchTerm = document.querySelector('.search-input').value.trim();
//         const resultsContainer = document.getElementById('recommendation-results');
        
//         if (!searchTerm) {
//             resultsContainer.innerHTML = '<p class="message">Please enter a search term</p>';
//             return;
//         }

//         try {
//             resultsContainer.innerHTML = '<p class="message">Searching...</p>';
//             const response = await fetch('travel_recommendation_api.json');
//             if (!response.ok) throw new Error('Failed to load data');
            
//             const data = await response.json();
//             const normalizedTerm = normalizeKeyword(searchTerm.toLowerCase());

//             // Get recommendations based on keyword category
//             let results = [];
//             let category = '';
            
//             if (normalizedTerm === 'beach') {
//                 results = data.beaches.slice(0, 2); // Get first 2 beaches
//                 category = 'Beach Destinations';
//             } else if (normalizedTerm === 'temple') {
//                 results = data.temples.slice(0, 2); // Get first 2 temples
//                 category = 'Temple Destinations';
//             } else if (normalizedTerm === 'country') {
//                 // Get 2 random cities from different countries
//                 results = data.countries
//                     .sort(() => 0.5 - Math.random())
//                     .slice(0, 2)
//                     .flatMap(country => country.cities[0]);
//                 category = 'Country Destinations';
//             } else {
//                 // Fallback to general search
//                 results = getAllRecommendations(data).filter(item => 
//                     item.name.toLowerCase().includes(normalizedTerm) || 
//                     item.description.toLowerCase().includes(normalizedTerm)
//                 );
//             }

//             displayResults(results, category);
            
//         } catch (error) {
//             console.error('Search error:', error);
//             resultsContainer.innerHTML = `
//                 <div class="error">
//                     <p>Error performing search</p>
//                     <p>${error.message}</p>
//                 </div>
//             `;
//         }
//     }

//     // Handle reset functionality
//     function handleReset() {
//         document.querySelector('.search-input').value = '';
//         fetchAndDisplayRecommendations();
//     }

//     // Normalize search keywords
//     function normalizeKeyword(term) {
//         const keywordMap = {
//             'beaches': 'beach',
//             'beach': 'beach',
//             'sea': 'beach',
//             'ocean': 'beach',
//             'temple': 'temple',
//             'temples': 'temple',
//             'temp': 'temple',
//             'tem': 'temple',
//             'shrine': 'temple',
//             'country': 'country',
//             'countries': 'country',
//             'nation': 'country'
//         };
//         return keywordMap[term] || term;
//     }

//     // Get all recommendations
//     function getAllRecommendations(data) {
//         return [
//             ...data.countries.flatMap(country => country.cities),
//             ...data.beaches,
//             ...data.temples
//         ];
//     }

//     // Fetch and display initial recommendations
//     async function fetchAndDisplayRecommendations() {
//         const resultsContainer = document.getElementById('recommendation-results');
        
//         try {
//             resultsContainer.innerHTML = '<p class="message">Loading recommendations...</p>';
//             const response = await fetch('travel_recommendation_api.json');
//             if (!response.ok) throw new Error('Failed to load data');
            
//             const data = await response.json();
//             // Show 2 random recommendations from each category
//             const sampleRecommendations = [
//                 ...data.beaches.slice(0, 2),
//                 ...data.temples.slice(0, 2),
//                 ...data.countries
//                     // .sort(() => 0.5 - Math.random())
//                     // .slice(0, 2)
//                     .flatMap(country => country.cities)
//             ];
            
//             displayResults(sampleRecommendations);
            
//         } catch (error) {
//             console.error('Fetch error:', error);
//             resultsContainer.innerHTML = `
//                 <div class="error">
//                     <p>Error loading recommendations</p>
//                     <p>${error.message}</p>
//                 </div>
//             `;
//         }
//     }
// });

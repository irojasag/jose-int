import './style.css';

// Problem 1: Render options when user types, the component is ready to use
// Problem 2: Fix the CSS to render as the interviewer explains
// Problem 3: Make this search dynamic

document.querySelector('#app').innerHTML = `
  <div>
    <div class="autocomplete-container">
          <div class="input-wrapper">
              <input 
                  type="text" 
                  class="autocomplete-input" 
                  placeholder="Search for a country... (try typing fast!)"
                  autocomplete="off"
                  spellcheck="false"
              >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
              </svg>
          </div>
          <div class="suggestions-dropdown"></div>
      </div>
  </div>
`;

// Local data for testing - TODO: Replace with API integration
const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Belarus',
  'Belgium',
  'Brazil',
  'Bulgaria',
  'Cambodia',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Latvia',
  'Lebanon',
  'Lithuania',
  'Luxembourg',
  'Malaysia',
  'Mexico',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Pakistan',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Saudi Arabia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Vietnam',
];

class AutoComplete {
  constructor(input, dropdown, data) {
    this.input = input;
    this.dropdown = dropdown;
    this.data = data;
    this.currentIndex = -1;
    this.filteredData = [];
    this.isOpen = false;

    this.init();
  }

  init() {
    this.input.addEventListener('blur', this.handleBlur.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));

    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  searchCountries(query) {
    // Simulate processing delay that would be worse with API calls
    console.log('Searching for:', query); // You'll see this fire rapidly when typing fast

    this.filteredData = this.filterData(this.data, query);
    this.renderSuggestions(query);
    this.showDropdown();
    this.currentIndex = -1;
  }

  filterData(countries, query) {
    return countries
      .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8); // Limit to 8 results
  }

  renderSuggestions(query) {
    if (this.filteredData.length === 0) {
      this.dropdown.innerHTML =
        '<div class="no-results">No countries found</div>';
      return;
    }

    const html = this.filteredData
      .map((item, index) => {
        const highlightedItem = this.highlightMatch(item, query);
        return `<div class="suggestion-item" data-index="${index}">${highlightedItem}</div>`;
      })
      .join('');

    this.dropdown.innerHTML = html;

    // Add click listeners
    this.dropdown.querySelectorAll('.suggestion-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.selectItem(item.textContent);
      });
    });
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="match-highlight">$1</span>');
  }

  updateHighlight() {
    const items = this.dropdown.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
      item.classList.toggle('highlighted', index === this.currentIndex);
    });

    // Scroll highlighted item into view
    if (this.currentIndex >= 0) {
      items[this.currentIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  selectItem(value) {
    this.input.value = value;
    this.hideDropdown();
    this.input.focus();

    // Trigger custom event
    this.input.dispatchEvent(
      new CustomEvent('autocomplete:select', {
        detail: { value },
      })
    );
  }

  handleFocus() {
    if (this.input.value.trim() && this.filteredData.length > 0) {
      this.showDropdown();
    }
  }

  handleBlur() {
    // Delay to allow click events on suggestions
    setTimeout(() => {
      this.hideDropdown();
    }, 150);
  }

  handleDocumentClick(e) {
    if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
      this.hideDropdown();
    }
  }

  showDropdown() {
    this.dropdown.classList.add('show');
    this.isOpen = true;
  }

  hideDropdown() {
    this.dropdown.classList.remove('show');
    this.isOpen = false;
    this.currentIndex = -1;
  }
}

// Initialize autocomplete
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.autocomplete-input');
  const dropdown = document.querySelector('.suggestions-dropdown');

  const autocomplete = new AutoComplete(input, dropdown, countries);

  // Listen for selection events
  input.addEventListener('autocomplete:select', (e) => {
    console.log('Selected:', e.detail.value);
  });
});

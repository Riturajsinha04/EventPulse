document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 LaunchForge client scripts initialized.');

  // Smooth Category Filter Pill Selection
  const filterChips = document.querySelectorAll('.chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const selectedCategory = chip.getAttribute('data-category');
      const urlParams = new URLSearchParams(window.location.search);
      
      if (selectedCategory === 'All') {
        urlParams.delete('category');
      } else {
        urlParams.set('category', selectedCategory);
      }
      
      window.location.search = urlParams.toString();
    });
  });

  // Sort Selector Change Listener
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('sort', e.target.value);
      window.location.search = urlParams.toString();
    });
  }
});

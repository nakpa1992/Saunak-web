document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const imageCount = 75;
  const images = [];
  let currentIndex = 0;

  // Vytvoření a přidání obrázků do galerie
  for (let i = 1 ; i <= imageCount; i++) {
    const img = document.createElement('img');
    img.src = `./gallery/Saunak1/${i}.jpg`;

    img.alt = 'sauna';
    img.classList.add('thumb');

 

    img.addEventListener('click', () => {
      currentIndex = i;
      showImage();
    });

    images.push(img);
    gallery.appendChild(img);
  }


  // Zobrazit obrázek v lightboxu
  function showImage() {
    lightboxImg.src = images[currentIndex].src;
    lightbox.style.display = 'flex';
  }

  // Předchozí obrázek
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // zabrání zavření lightboxu
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  });

  // Další obrázek
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // zabrání zavření lightboxu
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  });

  // Zavření lightboxu kliknutím mimo obrázek
  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });


  
});


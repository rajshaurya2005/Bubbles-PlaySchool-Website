/* =============================================
   GALLERY.JS — Bubbles Playschool
   Handles: GLightbox initialization + Filter logic
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =============================================
       GLIGHTBOX INITIALIZATION
       ============================================= */
    if (typeof GLightbox !== 'undefined') {
        var lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            closeButton: true,
            loop: true,
            autoplayVideos: false
        });
    }

    /* =============================================
       FILTER BUTTONS
       ============================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active button
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            galleryItems.forEach(function (item) {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    item.classList.add('hidden');
                    item.style.animation = '';
                }
            });

            // Re-initialize GLightbox after filtering so it only shows visible items
            if (typeof GLightbox !== 'undefined') {
                setTimeout(function () {
                    GLightbox({
                        selector: '.gallery-item:not(.hidden) .glightbox',
                        touchNavigation: true,
                        closeButton: true,
                        loop: true
                    });
                }, 100);
            }
        });
    });

});

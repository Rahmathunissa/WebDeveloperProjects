
// Smooth navigation and project interactions

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(event) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

console.log("Rahmath's portfolio loaded successfully!");

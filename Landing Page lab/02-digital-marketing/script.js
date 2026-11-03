
// BluePeak Digital - Website interactions

document.addEventListener("DOMContentLoaded", () => {

    // Close mobile navigation after clicking a menu link
    const navLinks = document.querySelectorAll(
        "#mainNav .nav-link"
    );

    const navCollapse = document.getElementById("mainNav");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (
                window.innerWidth < 992 &&
                navCollapse.classList.contains("show")
            ) {
                bootstrap.Collapse.getOrCreateInstance(
                    navCollapse
                ).hide();
            }
        });
    });

    console.log("BluePeak Digital website loaded successfully!");

});

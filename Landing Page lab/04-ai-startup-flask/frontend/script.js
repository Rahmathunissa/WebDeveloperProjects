
document.addEventListener("DOMContentLoaded", () => {

    // 1. Update footer year
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Smooth scrolling and mobile navigation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (targetId.length > 1) {
                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    const navMenu = document.getElementById("mainNav");

                    if (
                        navMenu &&
                        navMenu.classList.contains("show") &&
                        window.bootstrap
                    ) {
                        bootstrap.Collapse
                            .getOrCreateInstance(navMenu)
                            .hide();
                    }
                }
            }
        });
    });

    // 3. Enquiry form connected to Flask
    const enquiryForm = document.getElementById("enquiryForm");
    const formMessage = document.getElementById("formMessage");

    console.log("Enquiry form found:", enquiryForm);

    if (enquiryForm) {

        enquiryForm.addEventListener("submit", async function (event) {

            // Stop browser from refreshing
            event.preventDefault();
            event.stopPropagation();

            console.log("FORM SUBMISSION INTERCEPTED");

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = "Please complete all fields.";
                return;
            }

            const submitButton = enquiryForm.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) {
                submitButton.disabled = true;
            }

            formMessage.textContent = "Sending your enquiry...";

            try {

                console.log("Sending request to Flask...");

                const response = await fetch(
                    "https://neuraflow-backend.onrender.com/api/enquiries",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            message: message
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                formMessage.textContent = result.message;
                formMessage.style.color = "#159C88";

                enquiryForm.reset();

            } catch (error) {

                console.error("Enquiry error:", error);

                formMessage.textContent =
                    "Unable to send your enquiry. Please try again.";

                formMessage.style.color = "#d9534f";

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }
        });
    } 

});

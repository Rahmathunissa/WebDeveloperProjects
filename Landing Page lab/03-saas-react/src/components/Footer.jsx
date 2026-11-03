
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#" className="logo">
            Task<span>Flow</span>
          </a>
          <p>
            Helping teams work smarter, stay organized
            and achieve more every day.
          </p>
        </div>

        <div className="footer-column">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQs</a>
        </div>

        <div className="footer-column">
          <h4>Get in touch</h4>
          <a href="mailto:hello@taskflow.example">
            Email us
          </a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TaskFlow. Concept website created for portfolio purposes.</p>
        <p>Designed with React ❤️</p>
      </div>
    </footer>
  );
}

export default Footer;

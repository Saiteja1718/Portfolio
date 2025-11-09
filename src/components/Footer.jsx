import { motion } from 'framer-motion';
import { FaHeart, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <motion.div
          className="footer-main"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="footer-title">Sai Teja Dusari</h3>
          <p className="footer-subtitle">
            Data Science Graduate Student at Columbia University
          </p>
          <p className="footer-description">
            Passionate AI researcher dedicated to developing innovative machine learning solutions for real-world challenges.
          </p>
          
          <div className="footer-socials">
            <motion.a
              href="https://github.com/Saiteja1718"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/sai-teja-dusari-a627b02b4"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="mailto:saitejadusari1718@gmail.com"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaEnvelope />
            </motion.a>
          </div>
        </motion.div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Sai Teja Dusari. Made with <FaHeart className="heart-icon" /> using React & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

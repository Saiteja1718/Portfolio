import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="home" className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-tag" variants={itemVariants}>
          <span className="status-dot"></span>
          Available for opportunities
        </motion.div>

        <motion.h1 className="hero-title" variants={itemVariants}>
          Hi, I'm <span className="gradient-text">Sai Teja Dusari</span>
        </motion.h1>

        <motion.p className="hero-subtitle" variants={itemVariants}>
          AI Researcher & Data Science Graduate Student
        </motion.p>

        <motion.p className="hero-description" variants={itemVariants}>
          Passionate about developing innovative machine learning solutions for real-world 
          challenges. Currently pursuing Data Science at Columbia University.
        </motion.p>

        <motion.div className="hero-buttons" variants={itemVariants}>
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#projects')}
          >
            View My Work
          </motion.button>
          <motion.a
            href="https://drive.google.com/drive/u/0/folders/1LehdeBwuPQwxdK3JBJFK2GlR7AHUfwMp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Resume
          </motion.a>
        </motion.div>

        <motion.div className="hero-socials" variants={itemVariants}>
          <motion.a
            href="https://github.com/Saiteja1718"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#6366f1' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/sai-teja-dusari-a627b02b4"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#6366f1' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            href="mailto:saitejadusari1718@gmail.com"
            whileHover={{ scale: 1.2, color: '#6366f1' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaEnvelope />
          </motion.a>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          variants={itemVariants}
          onClick={() => scrollToSection('#about')}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaArrowDown />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </section>
  );
};

export default Hero;

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaGraduationCap, FaAward, FaBrain, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import './About.css';
import Profile from '../assets/profile.jpg';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px', amount: 0.2 });
  const [imageError, setImageError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  const education = [
    {
      degree: 'B.Tech in Artificial Intelligence',
      institution: 'SRM Institute of Science and Technology',
      duration: '2021–2025',
      gpa: 'GPA: 9.58',
    },
    {
      degree: 'High School',
      institution: 'Telangana Board',
      duration: '2019–2021',
      gpa: '96%',
    },
  ];

  const achievements = [
    'India AI Fellowship (INR 1 lakh)',
    'SRM Merit Scholarship (INR 43,000)',
    '4th place in Ada Lovelace Hackathon',
    'Runner-up in SRM Cricket Championship',
  ];

  const researchFocus = [
    'Machine Learning & Deep Learning',
    'Medical AI & Diagnostics',
    'Computer Vision & Image Processing',
    'Natural Language Processing',
  ];

  return (
    <section id="about" className="section about" ref={ref}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        About Me
      </motion.h2>

      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="about-image-wrapper" variants={itemVariants}>
          <div className="about-image-container">
            {!imageError ? (
              <img 
                src={Profile}
                alt="Sai Teja Dusari" 
                className="about-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="about-image-placeholder">
                <FaUser />
                <span>Add your photo</span>
              </div>
            )}
            <div className="image-border"></div>
          </div>
        </motion.div>

        <motion.div className="about-content" variants={itemVariants}>
          <div className="about-intro">
            <h3>Personal Information</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope />
                <span>saitejadusari1718@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+1 646 515 8585</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>New York, United States</span>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3><FaBrain /> Research Focus</h3>
            <div className="research-grid">
              {researchFocus.map((focus, index) => (
                <motion.div
                  key={index}
                  className="research-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {focus}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="about-section">
            <h3><FaGraduationCap /> Education</h3>
            <div className="education-list">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="education-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.7 + index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <h4>{edu.degree}</h4>
                  <p className="institution">{edu.institution}</p>
                  <div className="edu-details">
                    <span>{edu.duration}</span>
                    <span className="gpa">{edu.gpa}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="about-section">
            <h3><FaAward /> Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="achievement-item"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaAward className="achievement-icon" />
                  <span>{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;

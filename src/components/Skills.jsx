import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaPython, FaCode, FaTools } from 'react-icons/fa';
import { SiTensorflow, SiScikitlearn, SiPandas, SiNumpy } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px', amount: 0.2 });

  const skillsData = [
    {
      category: 'Languages',
      icon: <FaCode />,
      skills: [
        { name: 'Python', level: 95 },
        { name: 'C', level: 80 },
        { name: 'C++', level: 80 },
        { name: 'HTML', level: 85 },
        { name: 'CSS', level: 85 },
        { name: 'JavaScript', level: 80 },
      ],
    },
    {
      category: 'Frameworks & Libraries',
      icon: <SiTensorflow />,
      skills: [
        { name: 'TensorFlow', level: 90 },
        { name: 'Keras', level: 90 },
        { name: 'Scikit-learn', level: 95 },
        { name: 'NumPy', level: 95 },
        { name: 'Pandas', level: 95 },
        { name: 'Matplotlib', level: 85 },
        { name: 'Seaborn', level: 85 },
        { name: 'Django', level: 75 },
      ],
    },
    {
      category: 'Tools & Platforms',
      icon: <FaTools />,
      skills: [
        { name: 'Google Colab', level: 90 },
        { name: 'GitHub', level: 90 },
        { name: 'VS Code', level: 95 },
        { name: 'Git', level: 85 },
      ],
    },
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  return (
    <section id="skills" className="section skills" ref={ref}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        Technical Skills
      </motion.h2>

      <motion.div
        className="skills-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {skillsData.map((category, index) => (
          <motion.div
            key={index}
            className="skill-card"
            variants={cardVariants}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="skill-header">
              <div className="skill-icon">{category.icon}</div>
              <h3>{category.category}</h3>
            </div>
            <div className="skills-list">
              {category.skills.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;

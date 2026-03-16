import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCode, FaTools } from 'react-icons/fa';
import { SiTensorflow } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const ref = useRef(null);
  const isMobile = window.innerWidth < 768;
  const isInView = useInView(ref, {
    once: true,
    margin: isMobile ? '0px' : '-100px',
    amount: isMobile ? 0.1 : 0.2,
  });

  const skillsData = [
    {
      category: 'Programming Languages',
      icon: <FaCode />,
      skills: [
        { name: 'Python', level: 95 },
        { name: 'SQL', level: 90 },
        { name: 'R', level: 85 },
        { name: 'C/C++', level: 85 },
        { name: 'MATLAB', level: 80 },
        { name: 'HTML', level: 85 },
        { name: 'CSS', level: 85 },
        { name: 'JavaScript', level: 85 },
      ],
    },
    {
      category: 'Data Analysis & Visualization',
      icon: <FaTools />,
      skills: [
        { name: 'Excel', level: 90 },
        { name: 'Tableau', level: 85 },
        { name: 'Power BI', level: 85 },
        { name: 'Matplotlib', level: 90 },
        { name: 'Seaborn', level: 90 },
      ],
    },
    {
      category: 'Machine Learning & Libraries',
      icon: <SiTensorflow />,
      skills: [
        { name: 'Scikit-learn', level: 95 },
        { name: 'NumPy', level: 95 },
        { name: 'Pandas', level: 95 },
        { name: 'NLTK', level: 85 },
        { name: 'spaCy', level: 85 },
        { name: 'Transformers', level: 85 },
        { name: 'OpenCV', level: 85 },
        { name: 'Torchvision', level: 80 },
      ],
    },
    {
      category: 'Frameworks',
      icon: <SiTensorflow />,
      skills: [
        { name: 'TensorFlow', level: 90 },
        { name: 'Keras', level: 90 },
        { name: 'PyTorch', level: 85 },
        { name: 'LangChain', level: 85 },
        { name: 'LlamaIndex', level: 80 },
        { name: 'RAG', level: 85 },
        { name: 'Streamlit', level: 85 },
        { name: 'PySpark', level: 80 },
      ],
    },
    {
      category: 'Cloud & Platforms',
      icon: <FaTools />,
      skills: [
        { name: 'AWS', level: 85 },
        { name: 'Azure', level: 80 },
        { name: 'GCP', level: 80 },
      ],
    },
    {
      category: 'Tools and Data Platforms',
      icon: <FaTools />,
      skills: [
        { name: 'ETL Tools', level: 85 },
        { name: 'A/B Testing', level: 80 },
        { name: 'Git / GitHub', level: 90 },
        { name: 'Docker', level: 80 },
        { name: 'Snowflake', level: 80 },
        { name: 'Databricks', level: 80 },
        { name: 'RAG', level: 85 },
        { name: 'Prompt Engineering', level: 90 },
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
        ease: [0.25, 0.46, 0.45, 0.94],
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
          ease: [0.25, 0.46, 0.45, 0.94],
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

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px', amount: 0.2 });

  const projects = [
    {
      title: 'ResumeFit: AI Semantic Matching for Jobs',
      description: 'End-to-end system matching resumes to 70+ job descriptions using sentence-transformer embeddings and Random Forest classifier for semantic similarity scoring',
      tags: ['Python', 'NLP', 'Streamlit', 'Machine Learning', 'Transformers'],
      github: 'https://github.com/Saiteja1718/Resume-Matcher',
      type: 'Academic Project',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
    },
    {
      title: 'Heart Arrhythmia Detection (HVD-RF Classifier)',
      description: 'Hilbert Vibration Decomposition + Domain Adaptation achieving 98% accuracy',
      tags: ['Python', 'Machine Learning', 'Signal Processing', 'Random Forest'],
      github: 'https://github.com/Saiteja1718/Arrhythmia_Classification',
      type: 'Research Project',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    },
    {
      title: 'Brain Tumor Classification',
      description: 'CBAM-based CNN Autoencoder with attention mechanism achieving 95% accuracy',
      tags: ['TensorFlow', 'CNN', 'Deep Learning', 'Medical AI'],
      github: 'https://github.com/Saiteja1718/Brain_Tumor',
      type: 'Research Project',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop',
    },
    {
      title: 'Neural Machine Translation',
      description: 'Transformer with 100M+ parameters, BLEU score: 6 for English to Tamil translation',
      tags: ['TensorFlow', 'Transformers', 'NLP', 'Deep Learning'],
      github: 'https://github.com/Saiteja1718/Neural-Machine-Translation--English-to-Tamil',
      type: 'Academic Project',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
    },
    {
      title: 'Movie Recommendation Engine',
      description: 'Content-based + Collaborative filtering using cosine similarity',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'Data Science'],
      github: 'https://github.com/Saiteja1718/Movie-Recommendation-System',
      type: 'Academic Project',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
    },
    {
      title: 'AI-Powered Medical Diagnosis System',
      description: 'ML/DL systems for medical diagnosis using Decision Trees, Random Forest, CNN',
      tags: ['Python', 'TensorFlow', 'Medical AI', 'CNN'],
      github: 'https://github.com/Saiteja1718',
      type: 'Academic Project',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
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
    <section id="projects" className="section projects" ref={ref}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        Projects
      </motion.h2>

      <motion.div
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="project-card"
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-overlay">
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub />
                </motion.a>
              </div>
              <div className="project-type">{project.type}</div>
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;

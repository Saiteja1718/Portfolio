import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaFileAlt, FaExternalLinkAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import './Publications.css';

const Publications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px', amount: 0.2 });

  const publications = [
    {
      title: 'CBAM-Based Hybrid CNN-Autoencoder Model for Multiclass Classification of Brain Tumor Images',
      authors: 'Sai Teja Dusari et al.',
      journal: 'Springer SSIT Series',
      year: '2024',
      status: 'Accepted',
      link: 'https://drive.google.com/drive/u/0/folders/1LEDMddP-BqyPB9wuA2pwK_xQyiWivF07',
    },
    {
      title: 'HVD-Random Forest Classifier Based-Domain Adapted Multiclass Classification of Human Heart Arrhythmia',
      authors: 'Dr. Pritam Khan, Sai Teja Dusari et al.',
      journal: 'IEEE Transactions on Systems, Man, Cybernetics: Systems',
      year: '2025',
      status: 'Accepted',
      link: 'https://drive.google.com/drive/u/0/folders/1LEDMddP-BqyPB9wuA2pwK_xQyiWivF07',
    },
    {
      title: 'Consumer Behavior and Sustainability in Virtual Worlds',
      authors: 'Sai Teja Dusari et al.',
      journal: 'Springer Nature book, Green Metaverse: Fuzzy Logic Approaches to Sustainable Virtual Worlds',
      year: '2025',
      status: 'Accepted',
      link: 'https://drive.google.com/drive/u/0/folders/1LEDMddP-BqyPB9wuA2pwK_xQyiWivF07',
    },
    {
      title: 'Governance and Policy for a Green Metaverse',
      authors: 'Aravind, Sai Teja Dusari et al.',
      journal: 'Springer Nature book, Green Metaverse: Fuzzy Logic Approaches to Sustainable Virtual Worlds',
      year: '2025',
      status: 'Under Review',
      link: 'https://drive.google.com/drive/u/0/folders/1LEDMddP-BqyPB9wuA2pwK_xQyiWivF07',
    },
    {
      title: 'Smart Vision-Based Automated Quantity Estimation and Product Identification',
      authors: 'Dr. R. Udhendhran, Sai Teja Dusari et al.',
      journal: 'Scopus indexed AIP proceedings',
      year: '2025',
      status: 'Accepted',
      link: 'https://drive.google.com/drive/u/0/folders/1LEDMddP-BqyPB9wuA2pwK_xQyiWivF07',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  };

  return (
    <section id="publications" className="section publications" ref={ref}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        Publications
      </motion.h2>

      <motion.div
        className="publications-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {publications.map((pub, index) => (
          <motion.div
            key={index}
            className="publication-card"
            variants={cardVariants}
            whileHover={{ x: 10, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="publication-icon">
              <FaFileAlt />
            </div>
            <div className="publication-content">
              <h3 className="publication-title">{pub.title}</h3>
              <p className="publication-authors">{pub.authors}</p>
              <p className="publication-journal">{pub.journal}</p>
              <div className="publication-footer">
                <span className="publication-year">{pub.year}</span>
                <span className={`publication-status ${pub.status === 'Accepted' ? 'accepted' : 'review'}`}>
                  {pub.status === 'Accepted' ? <FaCheckCircle /> : <FaClock />}
                  {pub.status}
                </span>
                <motion.a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="publication-link"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaExternalLinkAlt />
                  View
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Publications;

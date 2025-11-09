import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px', amount: 0.2 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'sending', 'success', 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending your message...');
    setStatusType('sending');

    const serviceId = 'service_tjclv0w';
    const templateId = 'template_6420cqd';
    const publicKey = 'TIs2S7VBwo33UP5eT';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'saitejadusari1718@gmail.com',
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setStatus('✅ Message sent successfully! I will get back to you soon.');
          setStatusType('success');
          setTimeout(() => {
            setStatus('');
            setStatusType('');
            setFormData({ name: '', email: '', message: '' });
          }, 5000);
        },
        (error) => {
          console.error('FAILED...', error);
          setStatus('❌ Failed to send message. Please try emailing me directly at saitejadusari1718@gmail.com');
          setStatusType('error');
          setTimeout(() => {
            setStatus('');
            setStatusType('');
          }, 5000);
        }
      );
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'saitejadusari1718@gmail.com',
      link: 'mailto:saitejadusari1718@gmail.com',
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: '+1 646 515 8585',
      link: 'tel:+16465158585',
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Location',
      value: 'New York, United States',
      link: null,
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/sai-teja-dusari',
      link: 'https://linkedin.com/in/sai-teja-dusari-a627b02b4',
    },
    {
      icon: <FaGithub />,
      label: 'GitHub',
      value: 'github.com/Saiteja1718',
      link: 'https://github.com/Saiteja1718',
    },
  ];

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

  return (
    <section id="contact" className="section contact" ref={ref}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        Get In Touch
      </motion.h2>

      <motion.p
        className="contact-subtitle"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ 
          duration: 0.7, 
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        I'm always open to discussing new opportunities, research collaborations, or just having a chat about AI and machine learning. Feel free to reach out!
      </motion.p>

      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="contact-info-section" variants={itemVariants}>
          <h3>Contact Information</h3>
          <div className="contact-info-list">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="contact-info-item"
                whileHover={{ x: 5 }}
              >
                <div className="contact-icon">{info.icon}</div>
                <div className="contact-details">
                  <span className="contact-label">{info.label}</span>
                  {info.link ? (
                    <a href={info.link} target="_blank" rel="noopener noreferrer" className="contact-value">
                      {info.value}
                    </a>
                  ) : (
                    <span className="contact-value">{info.value}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.form className="contact-form" onSubmit={handleSubmit} variants={itemVariants}>
          <h3>Send me a message</h3>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="form-input"
            ></textarea>
          </div>
          {status && (
            <div className={`form-status ${statusType}`}>
              {status}
            </div>
          )}
          <motion.button
            type="submit"
            className="submit-btn"
            disabled={statusType === 'sending'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane />
            Send Message
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Contact;

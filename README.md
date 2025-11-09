# Sai Teja Dusari - Portfolio Website

A modern, animated portfolio website built with React, Vite, and Framer Motion.

## Features

- 🎨 Clean and modern design with smooth animations
- 📱 Fully responsive for all device sizes
- ⚡ Fast performance with Vite
- 🎭 Beautiful animations powered by Framer Motion
- 📧 Contact form with validation
- 🔗 Social media integration
- 📄 Projects and publications showcase

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Styling:** CSS3 with custom properties

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Replace the placeholder profile image:
   - Add your profile image to `src/assets/profile.jpg`
   - The uploaded image should be named `profile.jpg`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit the local URL shown in the terminal (usually `http://localhost:5173`)

## Build for Production

To create a production-ready build:

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Customization

### Update Personal Information

Edit the following files to customize your information:

- `src/components/Hero.jsx` - Main landing section
- `src/components/About.jsx` - About section with education and achievements
- `src/components/Skills.jsx` - Technical skills
- `src/components/Projects.jsx` - Project portfolio
- `src/components/Publications.jsx` - Research publications
- `src/components/Contact.jsx` - Contact information

### Color Scheme

The color scheme can be customized in `src/index.css` by modifying the CSS variables:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #ec4899;
  /* ... more colors */
}
```

## Project Structure

```
Portfolio/
├── public/
├── src/
│   ├── assets/
│   │   └── profile.jpg
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Hero.jsx
│   │   ├── Hero.css
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Skills.jsx
│   │   ├── Skills.css
│   │   ├── Projects.jsx
│   │   ├── Projects.css
│   │   ├── Publications.jsx
│   │   ├── Publications.css
│   │   ├── Contact.jsx
│   │   ├── Contact.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Deployment

You can deploy this portfolio to various platforms:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "vite build && gh-pages -d dist"`
3. Run: `npm run deploy`

## License

This project is open source and available for personal use.

## Contact

- **Email:** saitejadusari1718@gmail.com
- **LinkedIn:** [linkedin.com/in/sai-teja-dusari-a627b02b4](https://linkedin.com/in/sai-teja-dusari-a627b02b4)
- **GitHub:** [github.com/Saiteja1718](https://github.com/Saiteja1718)

---

Made with ❤️ using React & Framer Motion

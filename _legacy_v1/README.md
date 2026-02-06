# Portfolio Website - Jostin Lopez (J0571N)

A polished, local-first portfolio website built with accessible HTML/CSS and a Python build script.

## Project Structure
```
portfolio-site/
├── data/
│   └── projects.json       # Source of truth for project list
├── assets/                 # Images (placeholders provided)
├── css/
│   └── style.css           # Mian styles
├── templates/
│   └── index.html          # HTML Template
├── scripts/
│   └── generate_portfolio.py # Build script
├── resume.md               # CV Content
├── index.html              # Generated site (output)
└── README.md               # This file
```

## How to Edit

### 1. Update Projects
Edit `data/projects.json`. Each project has fields for title, description, tags, and images.

### 2. Update Content
Edit `resume.md` for text updates. Some bio text in `templates/index.html` may also need direct editing if you want to change the layout structure text.

### 3. Replace Images
Place your real images in the `assets/` folder and update the filenames in `data/projects.json` or `index.html`.
- `assets/portrait.png`: Your profile picture.
- `assets/project-placeholder.png`: Default project thumbnail.

## Build Instructions

### Requirements
- Python 3.x
- `jinja2` (Install via `pip install jinja2`)

### Generate Site
Run the build script to generate the static `index.html`:
```bash
python scripts/generate_portfolio.py
```

### Local Dev
You can simple open `index.html` in your browser, or run a simple python server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deployment
1. Commit your changes.
2. Push to your GitHub repository.
3. Enable **GitHub Pages** in your repo settings and point it to the root directory (where `index.html` is).

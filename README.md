# Portfolio V2.5 - J0571N

A high-performance, animated, and data-driven portfolio built with React 18, Vite, and TailwindCSS.

## 🚀 Key Features

- **Data-Driven Architecture**: All projects, design tokens, and text are managed through configuration files.
- **Internationalization (i18n)**: One-click toggle between English and Spanish.
- **Edit Mode**: Dedicated authoring interface (`Ctrl + Shift + E`) to generate project JSON.
- **Centralized Theming**: Modify the entire look and feel via `design-tokens.json`.
- **Responsive & Animated**: Crafted with Framer Motion for smooth transitions and full mobile support.

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS (Design-token integrated)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **i18n**: i18next

## 📂 Project Structure

```
src/
├── components/     # React components
├── config/         # Centralized configuration
│   ├── design-tokens.json  # UI tokens (colors, fonts, animations)
│   ├── constants.js        # Global app constants
│   └── projects.schema.json# JSON Schema for project validation
├── data/           # Content data
│   └── projects.json       # Source of truth for projects
├── locales/        # Translation files (en/es)
├── utils/          # Helper functions (theme applier, focus trap)
└── i18n.js         # i18n configuration
```

## ⚙️ How to use

### 1. Development
```bash
npm install
npm run dev
```

### 2. Customizing Design
Edit `src/config/design-tokens.json`. Changes here update both standard CSS variables and Tailwind utilities.

### 3. Adding Projects (Edit Mode)
1. Run the app in development mode.
2. Press `Ctrl + Shift + E` to open the **Project Editor**.
3. Fill in project details and click **Generate JSON**.
4. Copy the output and paste it into `src/data/projects.json`.

### 4. Updating Translations
Translations live in `src/locales/en/common.json` and `src/locales/es/common.json`.

## 📜 Legal & Compliance

- **Privacy Policy**: Functional modal implemented in the footer.
- **Terms of Service**: Functional modal implemented in the footer.
- **Accessibility**: Semantic HTML and keyboard-navigable components.

## 🚢 Deployment

Deployed via GitHub Pages (or any static host like Vercel/Netlify).
1. Run `npm run build`.
2. Push the `dist` folder or use a GitHub Action for automatic deployment.

### 📁 Required Production Assets
Before deploying, ensure these files exist in the `/public` folder:
- `favicon.ico`: Your site's browser icon.
- `resume.pdf`: Your downloadable/viewable resume.
- `assets/og-image.png`: Social media preview image (referenced in `index.html`).

### 💾 Important: Persistence
This is a **static site**. The "CMS Command Center" saves changes to your **local browser's storage** for testing.
To make changes permanent for all visitors:
1. Open the CMS (`Ctrl + Shift + E`).
2. Go to the **JSON** tab.
3. Copy the content for Projects or Settings.
4. Overwrite the corresponding file in `src/data/` (e.g., `src/data/projects.json`).
5. **Commit and Push** these changes to your Git repository.

---

Built with ❤️ by J0571N.

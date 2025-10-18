# Group 35 - Interactive Digital Art Experience

An interactive digital art piece created with p5.js. The piece combines different mechanics and techniques to create an explorable world that unfolds through user interaction. 

## About

The purpose of developing this creative piece was to create an interactive art world that invites people to explore a detailed digital landscape. 
We wanted to combine multiple artistic techniques into one unified canvas. 
But rather than a static canvas with subtle details, we created an immersive experience that takes you through individual parts of the artwork.

## Technologies Used

- **p5.js** - Creative coding and canvas rendering
- **Tone.js** - Audio synthesis and music generation
- **ml5.js** - Machine learning integration
- **Lenis** - Smooth scrolling library

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local development server (like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code)

### Installation

1. Clone the repository

2. Open the project in your code editor

3. Start a local development server:
   - Using VS Code with Live Server: Right-click on `index.html` and select "Open with Live Server"

### Project Structure Overview

- **`assets/`** - Static files including audio files and all favicon files
- **`features/`** - Interactive functionality like audio management, animations, initialization
- **`layers/`** - Individual visual layers that make up the scrollable landscape (clouds, mountains, fields, sky, stars, trees, wind)
- **`project.js`** - Main file that combines all layers and features

## Commit Convention

Project follows a structured commit message convention to maintain clear project history:

- **`feat:`** - New features
  - Example: `feat: add morph feature`
  - With scope: `feat(setup): add morph layer setup`

- **`refactor:`** - Code refactoring without changing functionality
  - Example: `refactor: organize file structure`
  - With scope: `refactor(project): set max scroll to fixed const`

## Interaction

- **Scroll** through the page to explore different sections of the artwork
- **Move your hand** across the canvas to position and interact with elements
- The canvas is fixed while the content scrolls
- Various visual and audio elements respond to your scroll position

## Contributors

Group 35

Reinis Muiznieks,
Mercy Kramlich



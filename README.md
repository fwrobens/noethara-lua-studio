# Noethara Lua Studio

Build a premium desktop-style app called Noethara in React, with smooth animations. Keep the layout of the attached Aether design: a centered floating top nav bar, a workspace file sidebar, a code editor with file tabs, a bottom console, and a run bar. Include a second Discover page in the same style, as shown in the attached image.

Replace the top Studio/Discover/Library tabs with icon-only tabs that have depth: they lift on hover, sink on press, and share one sliding active indicator with a spring animation. Use a custom icon set with a duotone fill for the active tab and a subtle glow behind it. Give the file tabs the same treatment.

The workspace directory should let users create, rename, and delete folders and files, with animated transitions.

Make it a general Lua script workspace, not a game tool. Use mock data only. Do not include game connection, attaching to clients, script injection, or any feature that runs code in Roblox or other games. Replace "Attach" with a neutral label, keep the Run button to print mock output in the console, and replace the game-script Discover feed with a browsable template library.

Make it feel premium and modern: smooth transitions, subtle depth, and respect the reduced-motion setting. Build it as a web app first.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e662972-5c11-4ba9-a88f-d0f2e9145eac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

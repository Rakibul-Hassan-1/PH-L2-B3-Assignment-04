## Assignment--Shad-CN

## Installation Steps for Shadcn UI in Vite + React Project

### Create Project

Start by creating a new React project using Vite with TypeScript template:

```bash
npm create vite@latest
```

### Installation Steps

1. **Install Tailwind CSS**

   ```bash
   npm install tailwindcss @tailwindcss/vite
   npm install -D @types/node
   ```

2. **Update src/index.css**
   Replace everything in `src/index.css` with:

   ```css
   @import "tailwindcss";
   ```

3. **Configure TypeScript**
   Update your `tsconfig.json`:

   ```json
   {
     "files": [],
     "references": [
       {
         "path": "./tsconfig.app.json"
       },
       {
         "path": "./tsconfig.node.json"
       }
     ],
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

   Update your `tsconfig.app.json`:

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

4. **Update vite.config.ts**

   ```typescript
   import path from "path";
   import tailwindcss from "@tailwindcss/vite";
   import react from "@vitejs/plugin-react";
   import { defineConfig } from "vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

5. **Add Shadcn CLI**

   ```bash
   npx shadcn@latest init
   ```

   When prompted, configure your settings. For the base color, you can choose 'Neutral' or any other color you prefer.

6. **Update vite.config.ts**
   Add this configuration to handle path aliases:

   ```ts
   import path from "path";
   import react from "@vitejs/plugin-react";
   import { defineConfig } from "vite";

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

7. **Add Components**
   You can now add any component from Shadcn UI using the CLI:
   ```bash
   npx shadcn-ui@latest add button
   ```

## Usage Example

Here's how to use a component in your app:

```tsx
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
```

## Available Components

Visit [Shadcn UI Components](https://ui.shadcn.com/docs/components) to see all available components and their documentation."

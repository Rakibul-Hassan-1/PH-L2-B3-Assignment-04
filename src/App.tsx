import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;

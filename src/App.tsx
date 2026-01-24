import { CircuitFlow } from "./components/circuit-flow";
import { ThemeProvider } from "./components/providers/theme-provider";

const App = () => {
  return (
    <ThemeProvider>
      <CircuitFlow />
    </ThemeProvider>
  );
};

App.displayName = "App";
export default App;

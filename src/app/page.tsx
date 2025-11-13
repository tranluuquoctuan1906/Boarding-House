import { HomePage } from "./components/home";
import { Provider } from "./components/provider";

export default function Home() {
  return (
    <Provider>
      <HomePage />
    </Provider>
  );
}
import { App } from "antd";
import Create from "./components/create";
import HistoriesTable from "./components/histories-table";

export default function Home() {
  return (
    <App>
      <div className="p-4">
        <Create />
        <HistoriesTable />
      </div>
    </App>
  );
}

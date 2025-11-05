import { App } from "antd";
import Create from "./components/create";
import HistoriesTable from "./components/histories-table";

export default function Home() {
  return (
    <App>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Create />
        </div>
        <HistoriesTable />
      </div>
    </App>
  );
}

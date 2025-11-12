import Create from "./components/create";
import HistoriesTable from "./components/histories-table";
import { Provider } from "./components/provider";

export default function Home() {
  return (
    <Provider>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Create />
        </div>
        <HistoriesTable />
      </div>
    </Provider>
  );
}

import axios from "axios";
import { RulesProvider, useRules } from "./components/RulesContext";
import { QueryGroup } from "./components/QueryGroup";

function App() {
  const rules = useRules();

  // console.log(rules);

  const handleClick = async () => {
    try {
      await axios.post("/api/save-rules", {});
      alert("Submitted");
    } catch {
      alert("Error");
    }
  };

  return (
    <>
      <RulesProvider>
        <h1>Query Builder</h1>
        <div className="query-builder-container">
          <div className="query-builder-query">
            <QueryGroup index={0} data={rules} />
          </div>

          <div className="query-builder-actions">
            <button type="button" onClick={handleClick}>
              Submit
            </button>
            <button type="button" onClick={handleClick}>
              Cancel
            </button>
          </div>
        </div>
      </RulesProvider>
    </>
  );
}

export default App;

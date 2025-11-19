import axios from "axios";
import { RulesProvider, useRules } from "./components/RulesContext";
import { QueryGroup } from "./components/QueryGroup";
import { useState } from "react";

function App() {
  const [rules, setRules] = useState({
    combinator: "AND",
    conditions: [],
  });

  console.log("App", rules);

  const handleClick = async () => {
    try {
      await axios.post("/api/save-rules", {});
      alert("Submitted");
    } catch {
      alert("Error");
    }
  };

  const callback = (data: any) => {
    console.log("callback", data, "rules", rules);

    // group
    // if (data.container) {
    //   return;
    // }

    // fields
    setRules((prev: any) => {
      const result = { ...prev };

      result.conditions.push(data);

      return result;
    });
  };

  return (
    <>
      <pre>{JSON.stringify(rules, null, 2)}</pre>

      <h1>Query Builder</h1>
      <div className="query-builder-container">
        <div className="query-builder-query">
          <QueryGroup index={0} data={rules} callback={callback} />
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
    </>
  );
}

export default App;

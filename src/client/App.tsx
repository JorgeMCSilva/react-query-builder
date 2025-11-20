import axios from "axios";
import { useState } from "react";
import { RuleStorageService } from "./services/RuleStorageService";
import { Rule, RulePayload } from "./model";
import { QueryGroup } from "./features/QueryBuilder/QueryGroup";

function App() {
  const [rules, setRules] = useState({
    id: Math.random().toString(36),
    combinator: "AND",
    conditions: [],
  } as Rule);

  RuleStorageService.setRoot(rules);

  const handleClick = () => {
    const validatedRules = RuleStorageService.validate();

    if (RuleStorageService.hasErrors) {
      setRules({ ...validatedRules });

      console.log("validatedRules", validatedRules);

      return;
    }

    // prep data before posting
    post(RuleStorageService.getPayload());
  };

  const post = async (data: RulePayload) => {
    try {
      await axios.post("/api/save-rules", data);
      alert("Submitted");
    } catch {
      alert("Error");
    }
  };
  const reactivityTrigger = () => {
    setRules(() => ({ ...RuleStorageService.rulesDataStorage }));
  };

  RuleStorageService.setCallback(reactivityTrigger);

  return (
    <>
      {/* {console.log("inline app", rules)} */}
      {/* <pre>
        STORAGE: {JSON.stringify(RuleStorageService.rulesDataStorage, null, 2)}
      </pre> */}

      <h1>Query Builder</h1>
      <div className="query-builder-container">
        <div className="query-builder-query">
          <QueryGroup data={rules} />
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

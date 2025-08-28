import React from 'react';

interface Scenario {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ScenarioListProps {
  scenarios: Scenario[];
  onLoad: (scenarioId: string) => void;
  onDelete: (scenarioId: string) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onLoad, onDelete }) => {
  // Add safety checks for undefined or null values
  if (!scenarios || !Array.isArray(scenarios)) {
    return (
      <div className="calculation-prompt">
        <p>No scenarios data available</p>
      </div>
    );
  }
  
  if (scenarios.length === 0) {
    return (
      <div className="calculation-prompt">
        <p>No scenarios saved yet. Create and save your first scenario!</p>
      </div>
    );
  }

  return (
    <div className="scenarios-list">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="scenario-item">
          <div className="scenario-info">
            <h4>{scenario.name}</h4>
            <p>Created: {new Date(scenario.created_at).toLocaleDateString()}</p>
            <p>Updated: {new Date(scenario.updated_at).toLocaleDateString()}</p>
          </div>
          <div className="scenario-actions">
            <button
              className="load-scenario-button"
              onClick={() => onLoad(scenario.id)}
            >
              Load
            </button>
            <button
              className="delete-scenario-button"
              onClick={() => onDelete(scenario.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioList;


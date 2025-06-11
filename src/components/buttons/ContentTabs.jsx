import React from "react";
import { ToggleButton } from ".";

const ContentTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8 border-b border-gray-700">
      <div className="flex space-x-1">
        <ToggleButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          All POVs
        </ToggleButton>
        <ToggleButton
          active={activeTab === "trending"}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </ToggleButton>
        <ToggleButton
          active={activeTab === "latest"}
          onClick={() => setActiveTab("latest")}
        >
          Latest
        </ToggleButton>
        <ToggleButton
          active={activeTab === "awp"}
          onClick={() => setActiveTab("awp")}
        >
          AWP Plays
        </ToggleButton>
        <ToggleButton
          active={activeTab === "rifle"}
          onClick={() => setActiveTab("rifle")}
        >
          Rifle Plays
        </ToggleButton>
      </div>
    </div>
  );
};

export default ContentTabs;

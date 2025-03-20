// TabNavigation.tsx
import React from 'react';
import './TabNavigation.css';
import axios from 'axios';
import TableTeam from './interface/TableTeam';

export interface TabNavigationProps {
  teams: TableTeam[];
  updateTeams: (teams: TableTeam[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ teams, updateTeams, activeTab, setActiveTab }) => {
  const tabs = ['Sammanlagt', 'Hemma', 'Borta'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === 'Hemma') {
      axios.get('http://localhost:3000/team-stats/home')
        .then((response) => {
          let teamsStats: TableTeam[] = response.data;
          teamsStats.sort((a: TableTeam, b: TableTeam) => b.Points - a.Points);
          updateTeams(teamsStats);
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (tab === 'Borta') {
      axios.get('http://localhost:3000/team-stats/away')
        .then((response) => {
          let teamsStats: TableTeam[] = response.data;
          teamsStats.sort((a: TableTeam, b: TableTeam) => b.Points - a.Points);
          updateTeams(teamsStats);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios.get('http://localhost:3000/team-stats')
        .then((response) => {
          let teamsStats: TableTeam[] = response.data;
          teamsStats.sort((a: TableTeam, b: TableTeam) => b.Points - a.Points);
          updateTeams(teamsStats);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

import React from "react";

import { IOption } from "./../../models";

interface IProps {
  options?: IOption[];
  userVote?: string;
  handleVoting: (value: string) => void;
}

export const Voting: React.FC<IProps> = props => {
  const { options, userVote, handleVoting } = props;

  const renderOptions = () => (
    <div className="voting-list mt-1 d-flex flex-row">
      {options &&
        options.map(opt => (
          <div className="voting-list-item" key={opt.value}>
            <input
              type="radio"
              name="optradio"
              id={opt.value}
              checked={opt.value === userVote}
              onChange={() => handleVoting(opt.value || "")}
            />
            <label htmlFor={opt.value}>{opt.value}</label>
          </div>
        ))}
    </div>
  );

  return (
    <div className="content-holder">
      <div className="panel panel-primary">
        <div className="subtitle">Vote</div>
        {renderOptions()}
      </div>

      <div className="panel panel-primary">
        <div className="subtitle">Results</div>
        <div className="mt-1"></div>
      </div>
    </div>
  );
};

import React from "react";

import { IOption, IVote } from "./../../models";

interface IProps {
  options?: IOption[];
  votes?: IVote[];
  userVote?: string;
  handleVoting: (value: string) => void;
}

export const Voting: React.FC<IProps> = props => {
  const { options, userVote, votes, handleVoting } = props;

  // const groupBy = <TItem, TKey>(items: Array<TItem>, key: TKey) => {
  //   return items.reduce((acc, current) => {
  //     let _acc = [].concat();
  //     (_acc[current[key]] = _acc[current[key]] || []).push(current);
  //     return acc;
  //   }, []);
  // };

  // const filteredVotes = groupBy(votes || [], "vote");

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

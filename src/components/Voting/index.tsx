import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { IOption, IVote } from './../../models';

interface IProps {
    options?: IOption[];
    votes?: IVote[];
    userVote?: string;
    isShowing?: boolean;
    toggleShow: () => void;
    handleReset: () => void;
    handleVoting: (value: string) => void;
}

export const Voting: React.FC<IProps> = props => {
    const { options, userVote, votes, isShowing, toggleShow, handleReset, handleVoting } = props;
    const votesCount = votes ? votes.length : 0;

    // TODO: fix functionality for grouping itema
    // TODO: fix typescript issues
    const groupBy = <TItem, TKey>(items: Array<TItem>, key: TKey) => {
        return items.reduce((acc, current) => {
            //@ts-ignore
            (acc[current[key]] = acc[current[key]] || []).push(current);
            return acc;
        }, []);
    };

    const filteredVotes = groupBy<IVote, string>(votes || [], 'vote');

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
                            onChange={() => handleVoting(opt.value || '')}
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
                <div className="d-flex flex-row flex-align-flex-end">
                    <div className="subtitle">Results</div>
                    <button className="btn ml-1 mr-1 bg-success" onClick={toggleShow}>
                        {!isShowing ? 'Show' : 'Hide'}
                    </button>
                    <button className="btn bg-danger" onClick={handleReset}>Reset</button>
                </div>
                <div className="mt-1">
                    {isShowing && (
                        <div className="d-flex flex-column">
                            {!isEmpty(filteredVotes) ? (
                                filteredVotes.map((vote, index) => {
                                    //@ts-ignore
                                    const len = vote.length;
                                    return (
                                        <div
                                            key={index}
                                            className="panel bg-warning result-list-item"
                                            style={{ width: `${(len / votesCount) * 100}%` }}
                                        >
                                            {index}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="panel bg-primary text-center">Empty results</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

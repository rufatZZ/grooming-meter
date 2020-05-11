import React from 'react';
import isEmpty from 'lodash/isEmpty';

import { IOption, IVotesInfo } from 'shared/models';

interface IProps {
    options?: IOption[];
    votesList: IVotesInfo;
    userVote?: string;
    isShowing?: boolean;
    toggleShow: () => void;
    handleReset: () => void;
    handleVoting: (value: string) => void;
}

export const Voting: React.FC<IProps> = props => {
    const { options, userVote, votesList, isShowing, toggleShow, handleReset, handleVoting } = props;
    const { votes, length: votesLen = 0, average } = votesList || ({} as IVotesInfo);

    const renderOptions = () => (
        <div className="voting-list mt-1 d-flex flex-row flex-wrap">
            {options &&
                options.map(opt => (
                    <div className="voting-list-item mb-1" key={opt.value}>
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
        <>
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
                    <button className="btn bg-danger" onClick={handleReset}>
                        Reset
                    </button>
                </div>
                {isShowing && (
                    <div className="mt-1">
                        {!isEmpty(votes) ? (
                            <div className="d-flex flex-row flex-align-center bg-primary px-1 py-1">
                                <div style={{ width: '75%' }}>
                                    <div className="d-flex flex-column">
                                        {votes.map((vote, index) => {
                                            return (
                                                vote && (
                                                    <div
                                                        key={index}
                                                        className="panel bg-warning result-list-item"
                                                        style={{ width: `${(vote.length / votesLen) * 100}%` }}
                                                    >
                                                        {index}
                                                    </div>
                                                )
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="ml-1" style={{ width: '25%' }}>
                                    <div className="panel final-result text-center">
                                        <span className="d-block final-result-title">Final</span>
                                        <span className="d-block final-result-body">{average}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="panel bg-primary text-center">Empty results</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

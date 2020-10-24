import clsx from 'clsx';
import React from 'react';

import { Loading } from 'shared/components/Loading';
import { IOption, IVotesInfo } from 'shared/models';
import { isEmpty } from 'shared/utils/object';

interface IProps {
    options: IOption[];
    votesList: IVotesInfo;
    loading: boolean;
    userVote?: string;
    isShowing?: boolean;
    toggleShow: () => void;
    handleReset: () => void;
    handleVoting: (value: string) => void;
}

export const Voting: React.FC<IProps> = props => {
    const { options, loading, userVote, votesList, isShowing, toggleShow, handleReset, handleVoting } = props;
    const { votes, length: votesLen = 0, average } = votesList || ({} as IVotesInfo);

    const getClassNames = (opt: IOption) => clsx('voting-list-item', 'mb-1', { selected: opt.value === userVote });

    const renderOptions = () => (
        <div className="voting-list mt-1 d-flex flex-row flex-wrap">
            {!isEmpty(options) &&
                options.map(opt => (
                    <div className={getClassNames(opt)} key={opt.value} onClick={() => handleVoting(opt.value || '')}>
                        <span>{opt.value}</span>
                    </div>
                ))}
        </div>
    );

    const renderVotingVisual = () =>
        votes.map(
            (vote, index) =>
                vote && (
                    <div key={index} className="panel bg-warning result-list-item" style={{ width: `${(vote.length / votesLen) * 100}%` }}>
                        {index}
                    </div>
                ),
        );

    const renderResults = () => (
        <div className="mt-1">
            <Loading isLoading={loading}>
                {!isEmpty(votes) ? (
                    <div className="d-flex flex-row flex-align-center bg-primary px-1 py-1">
                        <div style={{ width: '75%' }}>
                            <div className="d-flex flex-column">{renderVotingVisual()}</div>
                        </div>

                        <div className="ml-1" style={{ width: '25%' }}>
                            <div className="panel final-result text-center">
                                <span className="d-block final-result-title">Final</span>
                                <span className="d-block final-result-body">{average}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="panel bg-primary text-center  px-2 py-2">{loading ? 'Calculating...' : 'Empty results'}</div>
                )}
            </Loading>
        </div>
    );

    return (
        <>
            <div className="panel panel-primary">
                <div className="subtitle">Vote</div>
                {renderOptions()}
            </div>

            <div className="panel panel-primary">
                <div className="d-flex flex-row flex-align-baseline">
                    <div className="subtitle">Results</div>
                    <button className="btn ml-1 mr-1 bg-success" onClick={toggleShow}>
                        {!isShowing ? 'Show' : 'Hide'}
                    </button>
                    <button className="btn bg-danger" onClick={handleReset}>
                        Reset
                    </button>
                </div>
                {isShowing && renderResults()}
            </div>
        </>
    );
};

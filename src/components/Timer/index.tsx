import React from "react";

interface IProps {
  timer?: string;
}

export const Timer: React.FC<IProps> = props => {
  const { timer } = props;

  return (
    <div className="timer">
      <div className="panel mb-1">
        <span className="subtitle">Time</span>
        <br />
        <div className="timer-time text-center">
          <span>{timer}</span>
        </div>
      </div>
    </div>
  );
};

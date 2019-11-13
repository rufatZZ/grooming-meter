import React from "react";

export const Timer: React.FC = () => {
  return (
    <div className="timer">
      <div className="panel mb-1">
        <span className="subtitle">Time</span>
        <br />
        <div className="timer-time text-center">
          <span>12:53</span>
        </div>
      </div>
    </div>
  );
};

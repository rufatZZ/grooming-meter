import React, { useEffect, useState } from 'react';
import moment from 'moment';

interface IProps {
    time?: number;
    loading?: boolean;
}

export const Timer: React.FC<IProps> = props => {
    const { time, loading } = props;
    const initialValue = '--.--';
    const [currentTime, setTime] = useState(initialValue);

    /** setInterval side effect for timer  */
    useEffect(() => {
        if (time) {
            const creationDateSeconds = new Date(time).getTime();
            const diffDate = () => Math.round((Date.now() - creationDateSeconds) / 1000);
            const formattedDateDiff = () =>
                moment()
                    .startOf('day')
                    .seconds(diffDate())
                    .format(diffDate() >= 3600 ? 'HH:mm:ss' : 'mm:ss');

            const interval = setInterval(() => setTime(formattedDateDiff()), 1000);
            return () => clearInterval(interval);
        }
    });

    return (
        <div className="timer">
            <div className="panel mb-1">
                <span className="subtitle">Time</span>
                <br />
                <div className="timer-time text-center">
                    <span>{loading ? `${initialValue}` : currentTime}</span>
                </div>
            </div>
        </div>
    );
};

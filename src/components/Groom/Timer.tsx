import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface IProps {
    time?: number;
    loading?: boolean;
}

export const Timer: React.FC<IProps> = props => {
    const { time, loading } = props;
    const initialValue = '--.--';
    const [currentTime, setTime] = useState(initialValue);
    const [timeDiff, setTimeDiff] = useState(0);
    const isTimeUp = () => timeDiff && timeDiff > 40;

    const getClassNames = () => classNames('timer-time', 'text-center', { 'off-limit': isTimeUp(), 'on-limit': !isTimeUp() });

    const formatDateDiff = (diff: number) => {
        setTimeDiff(diff);

        return moment()
            .startOf('day')
            .seconds(diff)
            .format(diff >= 3600 ? 'HH:mm:ss' : 'mm:ss');
    };

    /** setInterval side effect for timer  */
    useEffect(() => {
        if (time) {
            const creationDateSeconds = new Date(time).getTime();
            const diffDate = () => Math.round((Date.now() - creationDateSeconds) / 1000);
            const formattedDateDiff = formatDateDiff(diffDate());
            const interval = setInterval(() => setTime(formattedDateDiff), 1000);

            return () => clearInterval(interval);
        }
    });

    return (
        <div className="timer">
            <div className="panel">
                <span className="subtitle">Time</span>
                <div className={getClassNames()}>
                    <span>{loading ? `${initialValue}` : currentTime}</span>
                </div>
            </div>
        </div>
    );
};

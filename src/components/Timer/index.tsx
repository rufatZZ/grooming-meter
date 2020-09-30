import React, { useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

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
            <div className="panel mb-1">
                <span className="subtitle">Time</span>
                <br />
                <div className={`${classNames('timer-time', 'text-center', { 'off-limit': isTimeUp(), 'on-limit': !isTimeUp() })}`}>
                    <span>{loading ? `${initialValue}` : currentTime}</span>
                </div>
            </div>
        </div>
    );
};

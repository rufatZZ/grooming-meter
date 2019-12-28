const _  = require('lodash');

const avgerageSum = arr => {
    const sum = arr.reduce((a, b) => {
        return a + parseInt(b.vote);
    }, 0);

    const avg = !_.isEmpty(arr) && sum ? sum / arr.length : 0;

    return parseFloat(avg.toFixed(2)).toString();
};

const groupBy = (items, key) => {
    return items.reduce((acc, current) => {
        (acc[current[key]] = acc[current[key]] || []).push(current);
        return acc;
    }, []);
};

module.exports = {
    avgerageSum,
    groupBy,
};

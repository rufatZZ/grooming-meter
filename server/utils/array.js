const groupBy = (items, key) => {
    return items.reduce((acc, current) => {
        (acc[current[key]] = acc[current[key]] || []).push(current);
        return acc;
    }, []);
};

module.exports = {
    groupBy,
};

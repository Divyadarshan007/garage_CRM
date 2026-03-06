/**
 * Returns the current date and time in Indian Standard Time (IST).
 * IST is UTC + 5:30.
 * @returns {Date} The current date adjusted to IST.
 */
const getISTDate = () => {
    const now = new Date();
    // Use Intl.DateTimeFormat for robust formatting in IST (UTC+5:30)
    // with 12-hour clock (hour12: true)
    return now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

module.exports = { getISTDate };

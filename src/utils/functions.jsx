class Functions {
    static range = (start, stop, step = 1) =>
        Array.from({ length: Math.floor((stop - start) / step) + 1 }, (_, i) => start + i * step);

    static checkString = (str, str1, str2) => {
        return str === str1 || str === str2 || str1.includes(str) || str2.includes(str);
    };

    static checkStrings = (str, strList) => {
        let condition = false;
        for (const stri of strList) {
            const temp = str === stri || stri.includes(str);
            condition = condition || temp;
        }
        return condition;
    };

    static getToday = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    };

    static formatDate = (date) => {
        const format = new Date(date);
        const result = `${format.getDate()}/${format.getMonth() + 1}/${format.getFullYear()}`;
        return result;
    };

    static formatNumber(num) {
        let roundedNum = Math.round(num);
        return roundedNum.toLocaleString();
    }
}

export default Functions;
export const capitalize = function (string) {
    if (!string)
        return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function dateToYMD(dateString) {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}

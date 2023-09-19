export default function FormatStatus(string:string) {
    if (string) {
        return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replace('_',' ');
    }
}
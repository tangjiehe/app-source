export default function cssClassName(...names: any): string {
    let className = '';
    for (let name of names) {
        if (typeof name === 'string') {
            className += name + ' ';
        } else if (typeof name === 'object') {
            for (const [cName, active] of Object.entries(name)) {
                className += active ? cName + ' ' : '';
            }
        }
    }
    return className;
}
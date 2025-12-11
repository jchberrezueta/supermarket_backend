
export const isIntNumeric = (value: string): boolean => {
    return ( (!isNaN(parseFloat(value)) && isFinite(Number(value))) && (value.indexOf('.') === -1) );
}

export const formatDate = (fecha: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
        fecha.getFullYear() +
        '-' + pad(fecha.getMonth() + 1) +
        '-' + pad(fecha.getDate()) +
        ' ' + pad(fecha.getHours()) +
        ':' + pad(fecha.getMinutes()) +
        ':' + pad(fecha.getSeconds())
    );
}

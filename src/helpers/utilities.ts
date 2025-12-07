
export const isIntNumeric = (value: string): boolean => {
    return ( (!isNaN(parseFloat(value)) && isFinite(Number(value))) && (value.indexOf('.') === -1) );
}
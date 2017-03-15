function temperatureConverter(val, from, to) {
    if (
        typeof val === 'undefined' ||
        typeof from === 'undefined' ||
        typeof to === 'undefined' ||
        val.toString() !== val
    ) return null;
    val = parseFloat(val);
    var res = val;
    switch (true) {
        case from.toLocaleLowerCase() === 'f' && to.toLocaleLowerCase() === 'c':
            res = (val - 32) * 5 / 9;
            break;
        case from.toLocaleLowerCase() === 'f' && to.toLocaleLowerCase() === 'k':
            res = (val + 459.67) * 5 / 9;
            break;
        case from.toLocaleLowerCase() === 'c' && to.toLocaleLowerCase() === 'k':
            res = val + 273.15;
            break;
        case from.toLocaleLowerCase() === 'c' && to.toLocaleLowerCase() === 'f':
            res = val * 5 / 9 + 32;
            break;
        case from.toLocaleLowerCase() === 'k' && to.toLocaleLowerCase() === 'f':
            res = val * 9 / 5 - 459.67;
            break;
        case from.toLocaleLowerCase() === 'k' && to.toLocaleLowerCase() === 'c':
            res = val - 273.15;
            break;
        default:
    }
    return res;
}
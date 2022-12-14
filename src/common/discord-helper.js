String.prototype.toString = function (...formats) {
    if (!formats) return this

    for (const format of formats) {
        switch (format) {
            case 'italic':
                return '*' + this + '*'
            case 'bold':
                return '**' + this + '**'
            default:
                return this
        }
    }
}

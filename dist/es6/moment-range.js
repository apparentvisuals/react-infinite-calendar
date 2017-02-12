var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import moment from 'moment';

//-----------------------------------------------------------------------------
// Constants
//-----------------------------------------------------------------------------

var INTERVALS = {
    year: true,
    quarter: true,
    month: true,
    week: true,
    day: true,
    hour: true,
    minute: true,
    second: true
};

//-----------------------------------------------------------------------------
// Date Ranges
//-----------------------------------------------------------------------------

export var DateRange = function () {
    function DateRange(start, end) {
        _classCallCheck(this, DateRange);

        var s = start;
        var e = end;

        if (arguments.length === 1 || end === undefined) {
            if ((typeof start === 'undefined' ? 'undefined' : _typeof(start)) === 'object' && start.length === 2) {
                var _start = _slicedToArray(start, 2);

                s = _start[0];
                e = _start[1];
            } else if (typeof start === 'string') {
                var _start$split = start.split('/');

                var _start$split2 = _slicedToArray(_start$split, 2);

                s = _start$split2[0];
                e = _start$split2[1];
            }
        }

        this.start = s === null ? moment(-8640000000000000) : moment(s);
        this.end = e === null ? moment(8640000000000000) : moment(e);
    }

    _createClass(DateRange, [{
        key: 'adjacent',
        value: function adjacent(other) {
            var sameStartEnd = this.start.isSame(other.end);
            var sameEndStart = this.end.isSame(other.start);

            return sameStartEnd && other.start.valueOf() <= this.start.valueOf() || sameEndStart && other.end.valueOf() >= this.end.valueOf();
        }
    }, {
        key: 'add',
        value: function add(other) {
            if (this.overlaps(other)) {
                return new this.constructor(moment.min(this.start, other.start), moment.max(this.end, other.end));
            }

            return null;
        }
    }, {
        key: 'by',
        value: function by(interval) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: false, step: 1 };

            var range = this;

            return _defineProperty({}, Symbol.iterator, function () {
                var exclusive = options.exclusive || false;
                var step = options.step || 1;
                var diff = Math.abs(range.start.diff(range.end, interval)) / step;
                var iteration = 0;

                return {
                    next: function next() {
                        var current = range.start.clone().add(iteration * step, interval);
                        var done = exclusive ? !(iteration < diff) : !(iteration <= diff);

                        iteration += 1;

                        return {
                            done: done,
                            value: done ? undefined : current
                        };
                    }
                };
            });
        }
    }, {
        key: 'byRange',
        value: function byRange(interval) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: false, step: 1 };

            var range = this;
            var step = options.step || 1;
            var diff = this.valueOf() / interval.valueOf() / step;
            var exclusive = options.exclusive || false;
            var unit = Math.floor(diff);
            var iteration = 0;

            return _defineProperty({}, Symbol.iterator, function () {
                if (unit === Infinity) {
                    return { done: true };
                }

                return {
                    next: function next() {
                        var current = moment(range.start.valueOf() + interval.valueOf() * iteration * step);
                        var done = unit === diff && exclusive ? !(iteration < unit) : !(iteration <= unit);

                        iteration += 1;

                        return {
                            done: done,
                            value: done ? undefined : current
                        };
                    }
                };
            });
        }
    }, {
        key: 'toArray',
        value: function toArray(by, exclusive) {
            var acc = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.by(by, exclusive)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var unit = _step.value;

                    acc.push(unit);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return acc;
        }
    }, {
        key: 'center',
        value: function center() {
            var center = this.start.valueOf() + this.diff() / 2;
            return moment(center);
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new this.constructor(this.start, this.end);
        }
    }, {
        key: 'contains',
        value: function contains(other) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: false };

            var start = this.start.valueOf();
            var end = this.end.valueOf();
            var oStart = other.valueOf();
            var oEnd = other.valueOf();

            if (other instanceof DateRange) {
                oStart = other.start.valueOf();
                oEnd = other.end.valueOf();
            }

            var startInRange = start < oStart || start <= oStart && !options.exclusive;
            var endInRange = end > oEnd || end >= oEnd && !options.exclusive;

            return startInRange && endInRange;
        }
    }, {
        key: 'diff',
        value: function diff(unit, rounded) {
            return this.end.diff(this.start, unit, rounded);
        }
    }, {
        key: 'duration',
        value: function duration(unit, rounded) {
            return this.diff(unit, rounded);
        }
    }, {
        key: 'intersect',
        value: function intersect(other) {
            var start = this.start.valueOf();
            var end = this.end.valueOf();
            var oStart = other.start.valueOf();
            var oEnd = other.end.valueOf();

            if (start <= oStart && oStart < end && end < oEnd) {
                return new this.constructor(oStart, end);
            } else if (oStart < start && start < oEnd && oEnd <= end) {
                return new this.constructor(start, oEnd);
            } else if (oStart < start && start <= end && end < oEnd) {
                return this;
            } else if (start <= oStart && oStart <= oEnd && oEnd <= end) {
                return other;
            }

            return null;
        }
    }, {
        key: 'isEqual',
        value: function isEqual(other) {
            return this.start.isSame(other.start) && this.end.isSame(other.end);
        }
    }, {
        key: 'isSame',
        value: function isSame(other) {
            return this.isEqual(other);
        }
    }, {
        key: 'overlaps',
        value: function overlaps(other) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { adjacent: false };

            var intersect = this.intersect(other) !== null;

            if (options.adjacent && !intersect) {
                return this.adjacent(other);
            }

            return intersect;
        }
    }, {
        key: 'reverseBy',
        value: function reverseBy(interval) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: false, step: 1 };

            var range = this;

            return _defineProperty({}, Symbol.iterator, function () {
                var exclusive = options.exclusive || false;
                var step = options.step || 1;
                var diff = Math.abs(range.start.diff(range.end, interval)) / step;
                var iteration = 0;

                return {
                    next: function next() {
                        var current = range.end.clone().subtract(iteration * step, interval);
                        var done = exclusive ? !(iteration < diff) : !(iteration <= diff);

                        iteration += 1;

                        return {
                            done: done,
                            value: done ? undefined : current
                        };
                    }
                };
            });
        }
    }, {
        key: 'reverseByRange',
        value: function reverseByRange(interval) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { exclusive: false, step: 1 };

            var range = this;
            var step = options.step || 1;
            var diff = this.valueOf() / interval.valueOf() / step;
            var exclusive = options.exclusive || false;
            var unit = Math.floor(diff);
            var iteration = 0;

            return _defineProperty({}, Symbol.iterator, function () {
                if (unit === Infinity) {
                    return { done: true };
                }

                return {
                    next: function next() {
                        var current = moment(range.end.valueOf() - interval.valueOf() * iteration * step);
                        var done = unit === diff && exclusive ? !(iteration < unit) : !(iteration <= unit);

                        iteration += 1;

                        return {
                            done: done,
                            value: done ? undefined : current
                        };
                    }
                };
            });
        }
    }, {
        key: 'subtract',
        value: function subtract(other) {
            var start = this.start.valueOf();
            var end = this.end.valueOf();
            var oStart = other.start.valueOf();
            var oEnd = other.end.valueOf();

            if (this.intersect(other) === null) {
                return [this];
            }if (oStart <= start && start < end && end <= oEnd) {
                return [];
            } else if (oStart <= start && start < oEnd && oEnd < end) {
                return [new this.constructor(oEnd, end)];
            } else if (start < oStart && oStart < end && end <= oEnd) {
                return [new this.constructor(start, oStart)];
            } else if (start < oStart && oStart < oEnd && oEnd < end) {
                return [new this.constructor(start, oStart), new this.constructor(oEnd, end)];
            } else if (start < oStart && oStart < end && oEnd < end) {
                return [new this.constructor(start, oStart), new this.constructor(oStart, end)];
            }

            return [];
        }
    }, {
        key: 'toDate',
        value: function toDate() {
            return [this.start.toDate(), this.end.toDate()];
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.start.format() + '/' + this.end.format();
        }
    }, {
        key: 'valueOf',
        value: function valueOf() {
            return this.end.valueOf() - this.start.valueOf();
        }
    }]);

    return DateRange;
}();

//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(momentJS) {
    var newMoment = momentJS;
    /**
     * Build a date range.
     */
    newMoment.range = function range(start, end) {
        var m = this;

        if (INTERVALS.hasOwnProperty(start)) {
            return new DateRange(moment(m).startOf(start), moment(m).endOf(start));
        }

        return new DateRange(start, end);
    };

    /**
     * Alias of static constructor.
     */
    newMoment.fn.range = moment.range;

    /**
     * Expose constructor
     */
    newMoment.range.constructor = DateRange;

    /**
     * Check if the current moment is within a given date range.
     */
    newMoment.fn.within = function within(range) {
        return range.contains(this.toDate());
    };

    return momentJS;
}
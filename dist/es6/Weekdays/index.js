var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent, PropTypes } from 'react';
import moment from 'moment';
import range from 'lodash/range';
import { scrollbarSize } from '../utils';
var style = {
	'root': 'Cal__Weekdays__root',
	'day': 'Cal__Weekdays__day'
};

var Weekdays = function (_PureComponent) {
	_inherits(Weekdays, _PureComponent);

	function Weekdays() {
		_classCallCheck(this, Weekdays);

		return _possibleConstructorReturn(this, (Weekdays.__proto__ || Object.getPrototypeOf(Weekdays)).apply(this, arguments));
	}

	_createClass(Weekdays, [{
		key: 'render',
		value: function render() {
			var theme = this.props.theme;


			return React.createElement(
				'ul',
				{ className: style.root, style: { backgroundColor: theme.weekdayColor, color: theme.textColor.active, paddingRight: scrollbarSize }, 'aria-hidden': true },
				range(0, 7).map(function (val, index) {
					return React.createElement(
						'li',
						{ key: 'Weekday-' + index, className: style.day },
						moment().weekday(index).format('ddd')
					);
				})
			);
		}
	}]);

	return Weekdays;
}(PureComponent);

Weekdays.propTypes = {
	locale: PropTypes.object,
	theme: PropTypes.object
};
export default Weekdays;
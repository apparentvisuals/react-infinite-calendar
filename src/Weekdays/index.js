import React, {PureComponent, PropTypes} from 'react';
import moment from 'moment';
import range from 'lodash/range';
import {scrollbarSize} from '../utils';
const style = require('./Weekdays.scss');


export default class Weekdays extends PureComponent {
	static propTypes = {
		locale: PropTypes.object,
		theme: PropTypes.object
	};

	render() {
		let {theme} = this.props;

		return (
			<ul className={style.root} style={{backgroundColor: theme.weekdayColor, color: theme.textColor.active, paddingRight: scrollbarSize}} aria-hidden={true}>
				{range(0,7).map((val, index) => {
					return (
						<li key={`Weekday-${index}`} className={style.day}>{moment().weekday(index).format('ddd')}</li>
					);
				})}
			</ul>
		);
	}
}

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';

class CounterText extends React.PureComponent {
  render() {
    const { initialValue } = this.props;
    return (
      <p className="title is-size-1">
        {initialValue}
      </p>
    );
  }
}

CounterText.propTypes = {
  initialValue: PropTypes.any.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll('[data-component="CounterText"]')].forEach(el => {
    ReactDOM.hydrate(<CounterText {...window.FOOData[el.getAttribute('data-compId')]} />, el);
  });
}

export default CounterText;

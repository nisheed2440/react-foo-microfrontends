import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
class CounterButtons extends React.PureComponent {
  render() {
    const { addText, subtractText } = this.props;
    return (
      <div className="field has-addons" style={{ marginTop: 10 }}>
        <p className="control">
          <button className="button">
            <span>{subtractText}</span>
          </button>
        </p>
        <p className="control">
          <button className="button">
            <span>{addText}</span>
          </button>
        </p>
      </div>
    );
  }
}

CounterButtons.propTypes = {
  addText: PropTypes.string.isRequired,
  subtractText: PropTypes.string.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll('[data-component="CounterButtons"]')].forEach(el => {
    ReactDOM.hydrate(<CounterButtons {...window.FOOData[el.getAttribute('data-compId')]} />, el);
  });
}

export default CounterButtons;

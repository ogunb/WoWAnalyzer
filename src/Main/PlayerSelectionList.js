import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';

import AVAILABLE_CONFIGS from 'Parser/AVAILABLE_CONFIGS';
import UnsupportedSpec from 'Parser/UnsupportedSpec/CONFIG';

import makeAnalyzerUrl from './makeAnalyzerUrl';

class PlayerSelectionList extends Component {
  static propTypes = {
    report: PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      friendlies: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    fightId: PropTypes.number.isRequired,
    combatants: PropTypes.arrayOf(PropTypes.shape({

    })).isRequired,
  };

  componentWillUnmount() {
    ReactTooltip.hide();
  }

  render() {
    const { report, fightId, combatants } = this.props;

    return (
      <ul className="list selection players">
        {combatants.length === 0 && (
          <li className="text-danger" style={{ padding: '15px 22px' }}>
            Could not find any players in this report. Make sure the log is recorded with Advanced Combat Logging enabled. You can enable this in-game in the network settings.
          </li>
        )}
        {
          report.friendlies
            .sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              } else if (a.name < b.name) {
                return -1;
              } else {
                return 0;
              }
            })
            .map(friendly => {
              const combatant = combatants.find(combatant => combatant.sourceID === friendly.id);
              if (!combatant) {
                return null;
              }
              let config = AVAILABLE_CONFIGS.find(config => config.spec.id === combatant.specID);
              if (!config) {
                if (process.env.NODE_ENV === 'development') {
                  config = UnsupportedSpec;
                } else {
                  return null;
                }
              }
              const spec = config.spec;
              const specClassName = spec.className.replace(' ', '');

              return (
                <li key={friendly.id} className="item selectable">
                  <Link to={makeAnalyzerUrl(report, fightId, friendly.name)}>
                    <img src={`/specs/${specClassName}-${spec.specName.replace(' ', '')}.jpg`} alt="Spec logo" />{' '}
                    {friendly.name} ({spec.specName} {spec.className === 'Unsupported' ? `${spec.className} - ${friendly.type}` : spec.className})
                  </Link>
                </li>
              );
            })
        }
      </ul>
    );
  }
}

export default PlayerSelectionList;

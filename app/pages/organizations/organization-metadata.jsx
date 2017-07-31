import React from 'react';

const OrganizationMetadataStat = ({ value, label }) => (
  <div className="organization-metadata-stat">
    <div className="organization-metadata-stat__value">{value > 0 ? { value } : 0}</div>
    <div className="organization-metadata-stat__label">{label}</div>
  </div>
);

OrganizationMetadataStat.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

export default class OrganizationMetadata extends React.Component {
  constructor(props) {
    super(props);

    this.extractStat = this.extractStat.bind(this);
  }

  extractStat(statName) {
    const projects = this.props.organization.projects;
    return projects.reduce((accum, project) => accum + project[statName], 0);
  }

  renderStatus(project) {
    const percentComplete = Math.random();

    return (
      <div className="project-metadata-status-bar">
        <svg width="100%" height="1em" viewBox="0 0 1 1" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="linear-gradient">
              <stop offset="14%" stopColor="#E45950" />
              <stop offset="79%" stopColor="#F0B200" />
            </linearGradient>
          </defs>
          <rect fill="url(#linear-gradient)" stroke="none" x="0" y="0" width={percentComplete} height="1" />
          <rect fill="hsl(0, 0%, 75%)" stroke="none" x={percentComplete} y="0" width={1 - percentComplete} height="1" />
        </svg>
        <br />
        {project.display_name} is {Math.floor(percentComplete * 100)}% Complete
      </div>
    );
  }

  render() {
    const organization = this.props.organization;

    return (
      <div className="organization-metadata">
        <div className="organization-metadata__title">{organization.display_name}{' '}Statistics</div>
        <div className="organization-metadata-stats">
          <OrganizationMetadataStat
            label="Volunteers"
            value={this.extractStat('classifiers_count').toLocaleString()}
          />
          <OrganizationMetadataStat
            label="Classifications"
            value={this.extractStat('classifications_count').toLocaleString()}
          />
          <OrganizationMetadataStat
            label="Subjects"
            value={this.extractStat('subjects_count').toLocaleString()}
          />
        </div>
        {organization.projects.map((project) => {
          return (<div>{this.renderStatus(project)}</div>);
        })}
      </div>
    );
  }

}

OrganizationMetadata.propTypes = {
  organization: React.PropTypes.shape({
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired
};

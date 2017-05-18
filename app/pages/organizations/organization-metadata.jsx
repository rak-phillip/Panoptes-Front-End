import React from 'react';

const OrganizationMetadataStat = ({value, label}) =>
  <div className="project-metadata-stat">
    <div className="project-metadata-stat__value">{value}</div>
    <div className="project-metadata-stat__label">{label}</div>
  </div>

OrganizationMetadataStat.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

export default class OrganizationMetaData extends React.Component {
  constructor(props) {
    super(props);

    this.extractStat = this.extractStat.bind(this);
  }

  extractStat(statName){
    const projects = this.props.organization.projects;
    return projects.reduce((accum,project)=>accum+project[statName],0);
  }

  render() {
    const organization = this.props.organization;

    return (
      <div className="project-home-page__container">
        <div className="project-metadata">
          <span>{organization.display_name}{' '}Statistics</span>

          <div className="project-metadata-stats">
            <OrganizationMetadataStat label="Volunteers" value={this.extractStat('classifiers_count').toLocaleString()} />
            <OrganizationMetadataStat label="Classifications" value={this.extractStat('classifications_count').toLocaleString()} />
            <OrganizationMetadataStat label="Subjects" value={this.extractStat('subjects_count').toLocaleString()} />
            <OrganizationMetadataStat label="Completed Subjects" value={this.extractStat('retired_subjects_count').toLocaleString()} />
          </div>

        </div>
      </div>
    );
  }
}

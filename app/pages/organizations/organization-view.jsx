import React from 'react';
import ProjectCardList from '../projects/project-card-list';
import OrganizationMetaData from './organization-metadata';

const OrganizationView = ({ organization }) => (
  <div className="secondary-page all-resources-page">
    <section className="hero projects-hero">
      <div className="hero-container">
        <h1>{organization.display_name}</h1>
        <p>{organization.description}</p>
      </div>
    </section>
    <section className="resources-container">
      <div style={{ paddingTop: '1em' }}>
        <ProjectCardList projects={organization.projects} />
      </div>
    </section>
    <section>
      <OrganizationMetaData organization={organization} />
    </section>
  </div>
);

OrganizationView.propTypes = {
  organization: React.PropTypes.node.isRequired
};

export default OrganizationView;

import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ProjectCardList from '../projects/project-card-list';

counterpart.registerTranslations('en', {
  organizationsList: {
    title: 'Organizations'
  }
});

const OrganizationsPage = ({ organizations }) => (
  <div className="secondary-page all-resources-page">
    <section className="hero projects-hero">
      <div className="hero-container">
        <Translate content="organizationsList.title" component="h1" />
      </div>
    </section>
    <section className="resources-container">
      THIS IS THE ORGANIZATIONS LIST PAGE, CONGRATULATIONS YOU DID IT
      <section className="resources-container">
        <div style={{ paddingTop: '1em' }}>
          <ProjectCardList organizations={organizations} />
        </div>
      </section>
    </section>
  </div>
);

OrganizationsPage.propTypes = {

};

export default OrganizationsPage;

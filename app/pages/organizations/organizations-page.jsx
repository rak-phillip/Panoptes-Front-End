import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  projectsHome: {
    title: 'Organizations'
  }
});

const OrganizationsPage = (props) => {
  return (
    <div className="secondary-page all-resources-page">
      <section className="hero projects-hero">
        <div className="hero-container">
          <Translate content="projectsHome.title" component="h1" />
        </div>
      </section>
      <section className="resources-container">
        THIS IS THE ORGANIZATIONS LIST PAGE, CONGRATULATIONS YOU DID IT
      </section>
    </div>
  );
};

export default OrganizationsPage;

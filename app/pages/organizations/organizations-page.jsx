import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import PageSelector from '../projects/projects-page-selector';
import ProjectCardList from '../projects/project-card-list';

counterpart.registerTranslations('en', {
  projectsHome: {
    title: 'Organizations',
  },
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
        <ProjectCardList projects={props.organizations} />
        {props.pages > 1 &&
          <PageSelector
            currentPage={+page}
            totalPages={props.pages}
            onChange={props.onPageChange}
          />}
      </section>
    </div>
  );
};

export default OrganizationsPage; 
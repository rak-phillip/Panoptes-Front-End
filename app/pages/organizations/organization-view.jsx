import React from 'react';

const OrganizationView = ({ organization }) =>
    <div className="secondary-page all-resources-page">
      <section className="hero projects-hero">
        <div className="hero-container">
          <h1>{organization.display_name}</h1>
          <p>{organization.description}</p>
        </div>
      </section>
      <section className="resources-container">
        <ul>
          {organization.projects.map((project) => {
            return (
              <li>{project.display_name}</li>
            )
          })}
        </ul>
      </section>
    </div>

export default OrganizationView;

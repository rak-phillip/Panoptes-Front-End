import React from 'react';

const OrganizationView = ({ organization }) =>
  <div> im an organization look at me i am organization {organization.id} my name is {organization.display_name}
    <ul>
      {organization.projects.map((project) => {
        return (
          <li>{project.display_name}</li>
        )
      })}
    </ul>
  </div>;

export default OrganizationView;

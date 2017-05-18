// TODO: remove this
/* eslint-disable no-console */
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      organization: { projects: [] }
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);

    this.fetchOrganization(props.params.organization_id);
  }

  componentDidMount(page = 1) {
    const query = { page };

    apiClient.type('projects').get(query)
      .then((projects) => {
        this.setState({ projects });
      }).catch((e => console.error(e)));

    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.params.organization_id);
  }

  fetchOrganization(id) {
    // this.setState({ organization: { id }});
    apiClient.type('organizations').get(id).then((organization) => {
      organization.projects = [];
      this.setState({ organization });
      this.fetchProjects(organization);
    });
  }

  fetchProjects(organization) {
    organization.get('projects').then((projects) => {
      const org = this.state.organization;
      org.projects = projects;
      this.setState({ organization: org })
    });
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { organization: this.state.organization })
    )[0];
  }

}

OrganizationContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default OrganizationContainer;

import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      organization: { projects: [] }
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
  }

  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.params.organization_id);
  }

  fetchOrganization(id) {
    if (this.state.fetching) return;

    this.setState({ fetching: true });
    apiClient.type('organizations').get(id).then((organization) => {
      organization.projects = []; // eslint-disable-line no-param-reassign
      this.setState({ organization });
      this.fetchProjects(organization);
    });
  }

  fetchProjects(organization) {
    organization.get('projects').then((projects) => {
      const org = this.state.organization;
      org.projects = projects;
      this.setState({ organization: org, fetching: false });
    });
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { organization: this.state.organization })
    )[0];
  }

}

OrganizationContainer.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default OrganizationContainer;

import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import OrganizationsPage from './organizations-page';

class OrganizationsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organizations: []
    };

    this.fetchOrganizations = this.fetchOrganizations.bind(this);
  }

  componentDidMount() {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    apiClient.type('organizations').get()
      .then((organizations) => {
        console.log(organizations.length)
        this.setState({ organizations });
      }).catch((e => console.error(e))); // eslint-disable-line no-console
  }

  render() {
    return (
      <OrganizationsPage organizations={this.state.organizations} />
    );
  }
}

export default OrganizationsContainer;

import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import OrganizationsPage from './organizations-page';

class OrganizationsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      organizations: []
    };

    this.fetchOrganizations = this.fetchOrganizations.bind(this);
  }

  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillReceiveProps() {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    if (this.state.fetching || this.state.organizations.length > 0) return;

    this.setState({ fetching: true });
    apiClient.type('organizations').get()
      .then((organizations) => {
        this.setState({ organizations, fetching: false });
      }).catch((e => console.error(e))); // eslint-disable-line no-console
  }

  render() {
    return (
      <OrganizationsPage organizations={this.state.organizations} />
    );
  }
}

export default OrganizationsContainer;

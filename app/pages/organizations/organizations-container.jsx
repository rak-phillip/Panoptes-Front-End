// TODO: remove this
/* eslint-disable no-console */
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

  // componentWillReceiveProps(nextProps) {
  //
  // }

  // onPageChange(newParams) {
  //   const query = Object.assign({}, this.props.location.query, newParams);
  //   const results = [];
  //   Object.keys(query).map((key) => {
  //     if (query[key] === '') {
  //       results.push(delete query[key]);
  //     }
  //     return results;
  //   });
  //   const newLocation = Object.assign({}, this.props.location, { query });
  //   newLocation.search = '';
  //   browserHistory.push(newLocation);
  // }

  fetchOrganizations(page = 1) {
    const query = { page };

    apiClient.type('organizations').get(query)
      .then((organizations) => {
        this.setState({ organizations });
      }).catch((e => console.error(e)));
  }

  render() {
    return (
      // <OrganizationsPage organizations={this.state.organizations} onPageChange={onPageChange} />
      <OrganizationsPage organizations={this.state.organizations} />
    );
  }
}

export default OrganizationsContainer;

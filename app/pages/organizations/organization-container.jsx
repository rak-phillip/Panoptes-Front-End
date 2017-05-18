// TODO: remove this
/* eslint-disable no-console */
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      organization: {}
    };

    this.renderChildren = this.renderChildren.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);

    this.fetchOrganization(props.params.organization_id);
  }

  componentDidMount(page = 1) {
    const query = { page };

    apiClient.type('projects').get(query)
      .then((projects) => {
        this.setState({ projects });
      }).catch((e => console.error(e)));
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.params.organization_id);
  }

  fetchOrganization(id) {
    // this.setState({ organization: { id }});
    apiClient.type('organizations').get(id).then(organization =>
      this.setState({ organization })
    );
  }

  renderChildren() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { organization: this.state.organization })
    );
  }

  render() {
    return (
      // <div>{this.props.children}</div>
      <div>{this.renderChildren()}</div>
    );
  }
}

OrganizationContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default OrganizationContainer;

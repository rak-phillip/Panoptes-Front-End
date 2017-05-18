// TODO: remove this
/* eslint-disable no-console */
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      projects: []
    };
  }

  componentDidMount(page = 1) {
    const query = { page };

    apiClient.type('projects').get(query)
      .then((projects) => {
        this.setState({ projects });
      }).catch((e => console.error(e)));
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

OrganizationContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default OrganizationContainer;

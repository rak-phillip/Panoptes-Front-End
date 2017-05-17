import React from 'react';
import ProjectCardList from '../projects/project-card-list';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      projects: []
    };
  }

  componentDidMount(page = 1) {
    const query = {
      page: page
    };

    apiClient.type('projects').get(query)
      .then((projects) => {
        this.setState({ projects })
      }).catch((e => console.error(e));
  }

  render() {
    return (
      <OrganizationPage projects={this.state.projects} /> 
    );
  }
}

export default OrganizationContainer;
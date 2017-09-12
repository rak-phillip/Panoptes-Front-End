import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import Thumbnail from '../../components/thumbnail';
import getSubjectLocation from '../../lib/get-subject-location';

class Recents extends React.Component {
  constructor() {
    super();
    this.state = {
      recents: []
    };
    document.documentElement.classList.add('on-secondary-page');
  }

  componentDidMount() {
    const { user } = this.props;
    user.get('recents', { project_id: this.props.project.id, sort: '-created_at' })
    .then(recents => this.setState({ recents }));
  }

  componentWillUnmount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  render() {
    const { project } = this.props;
    return (
      <div className="secondary-page has-project-context">
        <div className="hero collections-hero">
          <div className="hero-container">
            <Translate content="classifier.recents" component="h1" />
          </div>
        </div>
        <ul className="collections-card-list">
          {this.state.recents.map((recent) => {
            const { type, format, src } = getSubjectLocation(recent);
            return (
              <li key={recent.id} className="collection-card">
                <Link to={`/projects/${project.slug}/talk/subjects/${recent.links.subject}`}>
                  <Thumbnail
                    alt={`Subject ${recent.links.subject}`}
                    src={src}
                    type={type}
                    format={format}
                    height={250}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Recents.propTypes = {
  project: React.PropTypes.shape({
    id: React.PropTypes.string
  }).isRequired,
  user: React.PropTypes.shape({
    get: React.PropTypes.func
  }).isRequired
};

export default Recents;
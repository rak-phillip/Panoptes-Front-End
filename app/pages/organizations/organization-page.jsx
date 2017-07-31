import React from 'react';
import ProjectCardList from '../projects/project-card-list';
import Thumbnail from '../../components/thumbnail';
import { Markdown } from 'markdownz';
import OrganizationMetadata from './organization-metadata';

const AVATAR_SIZE = 100;

class OrganizationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundHeight: null
    };

    this.resizeBackground = this.resizeBackground.bind(this);
  }

  componentDidMount() {
    this.resizeBackground();
    addEventListener('resize', this.resizeBackground);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resizeBackground);
  }

  resizeBackground() {
    const orgHero = this.organizationHero;
    if (orgHero) {
      const sectionBottom = orgHero.getBoundingClientRect().bottom;
      const sectionHeight = document.body.scrollTop + sectionBottom;
      if (this.state.backgroundHeight !== sectionHeight) {
        this.setState({ backgroundHeight: sectionHeight });
      }
    }
  }

  render() {
    let backgroundStyle = {};
    if (this.props.organizationBackground) {
      backgroundStyle = {
        backgroundImage: `url(${this.props.organizationBackground.src})`,
        height: this.state.backgroundHeight
      };
    }

    return (
      <div className="organization-page">
        <div
          className="project-background"
          style={backgroundStyle}
        />
        <div className="project-home-page">
          <section
            className="organization-hero"
            ref={(node) => { this.organizationHero = node; }}
          >
            <div className="organization-hero__container">
              {this.props.organizationAvatar &&
                <Thumbnail
                  src={this.props.organizationAvatar.src}
                  className="avatar organization-hero__avatar"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />}
              <div>
                <h1 className="organization-hero__title">{this.props.organization.display_name}</h1>
                <h5 className="organization-hero__description">{this.props.organization.description}</h5>
              </div>
            </div>
          </section>
          <section className="resources-container">
            <div className="organization-projects">
              <ProjectCardList projects={this.props.organization.projects} />
            </div>
          </section>
          <section className="organization-details">
            <div className="organization-talk">
              <div className="organization-talk__title">Recent comments on talk</div>
              <div className="organization-talk__content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
              <button>Read More</button>
            </div>
            <div className="organization-intro">
              <div className="organization-intro__title">About {this.props.organization.display_name}</div>
              <div className="organization-intro__content">
                <Markdown>
                  {this.props.organization.introduction}
                </Markdown>
              </div>
              {this.props.organization.introduction.length > 800 ?
                (<button>Read More</button>) : null }
            </div>
          </section>
          <section>
            <OrganizationMetadata organization={this.props.organization} />
          </section>
        </div>
      </div>);
  }
}

OrganizationPage.defaultProps = {
  organization: {},
  organizationAvatar: null,
  organizationBackground: null
};

OrganizationPage.propTypes = {
  organization: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;

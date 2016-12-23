import React from 'react';
import { Link, IndexLink } from 'react-router';
import DragReorderable from 'drag-reorderable';
import ModalFormDialog from 'modal-form/dialog';
import LoadingIndicator from '../../components/loading-indicator';
import WorkflowCreateForm from './workflow-create-form';

export default class EditProjectPage extends React.Component {
  labPath(postFix = '') {
    return (`/lab/${this.props.project.id}${postFix}`);
  }

  renderWorkflowList() {
    return this.props.workflows.map((workflow) => {
      return (
        <li key={workflow.id}>
          <Link to={this.labPath(`/workflow/${workflow.id}`)} className="nav-list-item" activeClassName="active">
            {workflow.display_name}
            {(this.props.project.configuration && workflow.id === this.props.project.configuration.default_workflow) &&
              <span title="Default workflow">{' '}*{' '}</span>}
          </Link>
        </li>
      );
    });
  }

  renderSubjectSetList() {
    return this.props.subjectSets.map((subjectSet) => {
      const subjectSetListLabel = subjectSet.display_name || <i>{'Untitled subject set'}</i>;

      return (
        <li key={subjectSet.id}>
          <Link to={this.labPath(`/subject-set/${subjectSet.id}`)} activeClassName="active" className="nav-list-item" title="A subject is an image (or group of images) to be analyzed.">{subjectSetListLabel}</Link>
        </li>
      );
    });
  }

  render() {
    const propsWithoutChildren = Object.assign({}, this.props);
    delete propsWithoutChildren.children;

    return (
      <div className="columns-container content-container">
        <div>
          <ul className="nav-list">
            <li><div className="nav-list-header">{`Project ${this.props.project.id}`}</div></li>

            <li><IndexLink to={this.labPath()} activeClassName='active' className="nav-list-item" title="Input the basic information about your project, and set up its home page.">
              Project details
            </IndexLink></li>
            <li><Link to={this.labPath('/about')} activeClassName='active' className="nav-list-item" title="Enter content for Research, Results, FAQ and Education.">
              About
            </Link></li>
            <li><Link to={this.labPath('/collaborators')} activeClassName='active' className="nav-list-item" title="Add people to your team and specify what their roles are so that they have the right access to the tools they need (including access to the project while it’s private).">
              Collaborators
            </Link></li>
            <li><Link to={this.labPath('/guide')} activeClassName='active' className="nav-list-item" title="Create a persistent guide that can be viewed within your project">
              Field guide
            </Link></li>
            <li><Link to={this.labPath('/tutorial')} activeClassName='active' className="nav-list-item" title="Create a pop-up tutorial for your project’s classification interface">
              Tutorial
            </Link></li>
            {(this.props.project.experimental_tools.includes('mini-course')) &&
              <li><Link to={this.labPath('/mini-course')} activeClassName='active' className="nav-list-item" title="Create a pop-up mini-course for your project’s classification interface">
                Mini-course
              </Link></li>}
            <li><Link to={this.labPath('/media')} activeClassName='active' className="nav-list-item" title="Add any images you’d like to use in this project’s introduction, science case, results, FAQ, or education content pages.">
              Media
            </Link></li>
            <li><Link to={this.labPath('/visibility')} activeClassName='active' className="nav-list-item" title="Decide whether your project is public and whether it's ready to go live.">
              Visibility
            </Link></li>
            <li><Link to={this.labPath('/talk')} activeClassName='active' className="nav-list-item" title="Setup project specific discussion boards">
              Talk
            </Link></li>
            <li><Link to={this.labPath('/data-exports')} activeClassName='active' className="nav-list-item" title="Get your project's data exports">
              Data Exports
            </Link></li>

            <li>
              <br />
              <div className="nav-list-header">Workflows</div>
              <DragReorderable
                tag="ul"
                className="nav-list"
                items={this.props.workflows}
                render={this.renderWorkflowList} onChange={this.props.handleWorkflowReorder}
              />

              <div className="nav-list-item">
                <button type="button" onClick={this.showCreateWorkflow} disabled={this.props.workflowCreationInProgress} title="A workflow is the sequence of tasks that you’re asking volunteers to perform.">
                  New workflow{' '}
                  <LoadingIndicator off={!this.props.workflowCreationInProgress} />
                </button>
              </div>
            </li>

            {this.props.workflowCreationInProgress &&
              <ModalFormDialog tag="div">
                <WorkflowCreateForm
                  onSubmit={this.props.workflowActions.createWorkflowForProject}
                  onCancel={this.props.hideCreateWorkflow}
                  onSuccess={this.props.handleWorkflowCreation}
                  projectID={this.props.project.id}
                  workflowActiveStatus={!this.props.project.live}
                />
              </ModalFormDialog>}

            <li>
              <br />
              <div className="nav-list-header">Subject sets</div>
              <ul className="nav-list">
                {this.renderSubjectSetList()}

                <li className="nav-list-item">
                  <button type="button" onClick={this.props.createNewSubjectSet} disabled={this.props.subjectSetCreationInProgress} title="A subject is an image (or group of images) to be analyzed.">
                    New subject set{' '}
                    <LoadingIndicator off={!this.props.subjectSetCreationInProgress} />
                  </button>{' '}
                  {this.props.subjectSetCreationError &&
                    <div className="form-help error">{this.props.subjectSetCreationError.message}</div>}
                </li>
              </ul>
            </li>

            <li>
              <br />
              <div className="nav-list-header">Need some help?</div>
              <ul className="nav-list">
                <li>
                  <Link className="nav-list-item" to="/help">Read a tutorial</Link>
                </li>
                <li>
                  <Link to="/talk/18" className="nav-list-item">Ask for help on talk</Link>
                </li>
                <li>
                  <Link to="/help/glossary" className="nav-list-item">Glossary</Link>
                </li>
              </ul>
            </li>
          </ul>

          <br />
          <div className="nav-list-header">Other actions</div>
          <small>
            <button type="button" className="minor-button" disabled={this.props.deletionInProgress} onClick={this.props.deleteProject}>
              Delete this project <LoadingIndicator off={!this.props.deletionInProgress} />
            </button>
          </small>{' '}
          {this.props.deletionError &&
            <div className="form-help error">{this.props.deletionError.message}</div>}
        </div>

        <hr />

        <div className="column">
          {React.cloneElement(this.props.children, propsWithoutChildren)}
        </div>
      </div>
    );
  }
}

EditProjectPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

EditProjectPage.defaultProps = {
  createNewSubjectSet: () => {},
  deleteProject: () => {},
  deletionInProgress: false,
  handleWorkflowCreation: () => {},
  handleWorkflowReorder: () => {},
  hideCreateWorkflow: () => {},
  project: { id: '2' },
  subjectSetCreationInProgress: false,
  workflowCreationInProgress: false
};

EditProjectPage.propTypes = {
  children: React.PropTypes.node,
  createNewSubjectSet: React.PropTypes.func,
  deleteProject: React.PropTypes.func,
  deletionError: React.PropTypes.shape({
    message: React.PropTypes.string
  }),
  deletionInProgress: React.PropTypes.bool,
  handleWorkflowCreation: React.PropTypes.func,
  handleWorkflowReorder: React.PropTypes.func,
  hideCreateWorkflow: React.PropTypes.func,
  project: React.PropTypes.shape({
    configuration: React.PropTypes.shape({
      default_workflow: React.PropTypes.string
    }),
    experimental_tools: React.PropTypes.array,
    id: React.PropTypes.string,
    live: React.PropTypes.bool
  }).isRequired,
  subjectSetCreationError: React.PropTypes.shape({
    message: React.PropTypes.string
  }),
  subjectSetCreationInProgress: React.PropTypes.bool,
  subjectSets: React.PropTypes.arrayOf(React.PropTypes.object),
  workflowActions: React.PropTypes.shape({
    createWorkflowForProject: React.PropTypes.func
  }),
  workflowCreationInProgress: React.PropTypes.bool,
  workflows: React.PropTypes.arrayOf(React.PropTypes.object)
};

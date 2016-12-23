import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import workflowActions from './actions/workflow';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';
import EditProjectPage from './edit-project-page';

const DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set';
const DELETE_CONFIRMATION_PHRASE = 'I AM DELETING THIS PROJECT';

export default class EditProjectPageController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deletionError: null,
      deletionInProgress: false,
      error: null,
      subjectSets: null,
      subjectSetCreationError: null,
      subjectSetCreationInProgress: false,
      workflows: null,
      workflowCreationInProgress: false
    };

    this.setupListener = this.setupListener.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
    this.hideCreateWorkflow = this.hideCreateWorkflow.bind(this);
    this.handleWorkflowCreation = this.handleWorkflowCreation.bind(this);
    this.handleWorkflowReorder = this.handleWorkflowReorder.bind(this);
    this.createNewSubjectSet = this.createNewSubjectSet.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  componentDidMount() {
    this.setupListener(this.props.project);
    Promise.all([
      this.props.project.get('subject_sets', { sort: 'display_name', page_size: 100 }),
      getWorkflowsInOrder(this.props.project, { fields: 'display_name' })
    ]).then(([subjectSets, workflows]) => {
      this.setState({ subjectSets, workflows });
      subjectSets.forEach((subjectSet) => {
        this.setupListener(subjectSet);
      });
      workflows.forEach((workflow) => {
        this.setupListener(workflow);
      });
    }).catch((error) => { this.setState({ error }); });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      this.context.router.push('/lab');
    }
  }

  componentWillUnmount() {
    this.removeListener(this.props.project);
    this.state.subjectSets.forEach((subjectSet) => {
      this.removeListener(subjectSet);
    });
    this.state.workflows.forEach((workflow) => {
      this.removeListener(workflow);
    });
  }

  setupListener(resource) {
    resource.listen('change', this.forceUpdate); // Need a better solution
  }

  removeListener(resource) {
    resource.stopListening('change', this.forceUpdate);
  }

  showCreateWorkflow() {
    this.setState({ workflowCreationInProgress: true });
  }

  hideCreateWorkflow() {
    this.setState({ workflowCreationInProgress: false });
  }

  handleWorkflowCreation(workflow) {
    this.hideCreateWorkflow();
    const newLocation = Object.assign({}, this.props.location, { pathname: `/lab/${this.props.project.id}/workflow/${workflow.id}` });
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    this.props.project.uncacheLink('subject_sets'); // An "expert" subject set is automatically created with each workflow.
  }

  handleWorkflowReorder(newOrder) {
    const newOrderIDs = newOrder.map((workflow) => {
      return (workflow.id);
    });
    this.props.project.update({
      'configuration.workflow_order': newOrderIDs
    }).save();
  }

  createNewSubjectSet() {
    const subjectSet = apiClient.type('subject_sets').create({
      display_name: DEFAULT_SUBJECT_SET_NAME,
      links: { project: this.props.project.id }
    });

    this.setState({
      subjectSetCreationError: null,
      subjectSetCreationInProgress: true
    });

    subjectSet.save()
      .then(() => {
        this.context.router.push(`/lab/${this.props.project.id}/subject-set/${subjectSet.id}`);
      }).catch((error) => {
        this.setState({ subjectSetCreationError: error });
      }).then(() => {
        this.props.project.uncacheLink('subject_sets');
        this.setState({ subjectSetCreationInProgress: false });
      });
  }

  deleteProject() {
    this.setState({ deletionError: null });

    const confirmed = prompt(`
      You are about to delete this project and all its data!
      Enter ${DELETE_CONFIRMATION_PHRASE} to confirm.
    `) === DELETE_CONFIRMATION_PHRASE;

    if (confirmed) {
      this.setState({ deletionInProgress: true });

      this.props.project.delete()
        .then(() => {
          this.context.router.push('/lab');
        }).catch((error) => {
          this.setState({ deletionError: error });
        }).then(() => {
          this.setState({ deletionInProgress: false });
        });
    }
  }

  render() {
    const handlers = {
      hideCreateWorkflow: this.hideCreateWorkflow,
      showCreateWorkflow: this.showCreateWorkflow,
      handleWorkflowCreation: this.handleWorkflowCreation,
      handleWorkflowReorder: this.handleWorkflowReorder,
      createNewSubjectSet: this.createNewSubjectSet,
      deleteProject: this.deleteProject,
      workflowActions: this.props.workflowActions
    };

    const propsToChild = Object.assign({}, this.state, handlers);

    return (
      <EditProjectPage {...propsToChild} />
    );
  }
}

EditProjectPageController.contextTypes = {
  router: React.PropTypes.object.isRequired
};

EditProjectPageController.defaultProps = {
  params: { projectID: 0 },
  workflowActions: workflowActions
};

EditProjectPageController.propTypes = {
  project: React.PropTypes.shape({
    delete: React.PropTypes.func,
    get: React.PropTypes.func,
    id: React.PropTypes.string,
    uncacheLink: React.PropTypes.func,
    update: React.PropTypes.func
  })
};

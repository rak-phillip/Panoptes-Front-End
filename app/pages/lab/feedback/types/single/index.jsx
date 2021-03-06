import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import SingleEditForm from './single-edit-form';

counterpart.registerTranslations('en', {
  singleFeedbackEditor: {
    addType: 'Add a feedback type',
    edit: 'Edit',
    del: 'Delete'
  }
});

export default class SingleFeedbackEditor extends React.Component {
  constructor(props) {
    super(props);
    this.checkForBrokenAnswers = this.checkForBrokenAnswers.bind(this);
    this.deleteFeedbackItem = this.deleteFeedbackItem.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.renderFeedbackItem = this.renderFeedbackItem.bind(this);
    this.saveFeedbackChange = this.saveFeedbackChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { task } = this.props;
    const prevTask = prevProps.task;
    const { feedback, answers } = task;
    if (prevTask && feedback.types && feedback.types.length && answers.length !== prevTask.answers.length) {
      this.checkForBrokenAnswers(task, prevTask);
    }
  }

  checkForBrokenAnswers(task, oldTask) {
    // If an answer is added or deleted, that might break our feedback, as it
    // works by tracking the index of the correct answer. This goes through the
    // answers, tries to match any that have moved, and adds a flag where a
    // required answer has been deleted.
    /* eslint-disable no-underscore-dangle */
    const newAnswerKeys = task.answers.map(answer => answer._key);
    const oldAnswerKeys = oldTask.answers.map(answer => answer._key);
    /* eslint-enable no-underscore-dangle */

    const checkedFeedback = task.feedback.types.reduce((changeSet, feedbackType, index) => {
      const newChangeSet = Object.assign({}, changeSet);
      const answerIndex = parseInt(feedbackType.answerIndex, 10);
      if (newAnswerKeys[answerIndex] !== oldAnswerKeys[answerIndex]) {
        const newAnswerIndex = newAnswerKeys.indexOf(oldAnswerKeys[answerIndex]);
        if (newAnswerIndex > -1) {
          newChangeSet[index] = { answerIndex: newAnswerIndex.toString() };
        } else {
          newChangeSet[index] = { answerIndex: '', valid: false };
        }
      }
      return newChangeSet;
    }, {});

    if (Object.keys(checkedFeedback).length) {
      const fixedFeedback = Object.assign({}, task.feedback);
      Object.keys(checkedFeedback).forEach((index) => {
        const fixedFeedbackItem = Object.assign({}, fixedFeedback.types[index], checkedFeedback[index]);
        fixedFeedback.types.splice(index, 1, fixedFeedbackItem);
      });
      this.props.saveFeedbackFn(fixedFeedback);
    }
  }

  deleteFeedbackItem(index) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.types.splice(index, 1);
    this.props.saveFeedbackFn(newFeedback);
  }

  openEditModal(feedback = {}, index = -1) {
    ModalFormDialog.alert(<SingleEditForm
      feedback={feedback}
      index={index}
      task={this.props.task}
      onSubmit={this.saveFeedbackChange}
    />, {
      required: true
    })
    .catch(error => console.error(error));
  }

  saveFeedbackChange(changed, index) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.types = newFeedback.types || [];

    if (index > -1) {
      newFeedback.types.splice(index, 1, changed);
    } else {
      newFeedback.types.push(changed);
    }

    return this.props.saveFeedbackFn(newFeedback);
  }

  renderFeedbackItem(item, index) {
    const editModalFn = this.openEditModal.bind(this, item, index);
    const deleteItem = this.deleteFeedbackItem.bind(this, index);
    const showIcon = (item.valid) ? null : (<i className="fa fa-exclamation-circle fa-fw" />);

    return (
      <div key={`field-${item.id}`} className="feedback-section__feedback-item">
        {showIcon}
        <span className="feedback-section__feedback-item-label">{item.id}</span>
        <button onClick={editModalFn}>
          <Translate content="singleFeedbackEditor.edit" />
        </button>
        <button onClick={deleteItem}>
          <Translate content="singleFeedbackEditor.del" />
        </button>
      </div>
    );
  }

  render() {
    const { feedback } = this.props.task;
    const isThereFeedback = feedback.types && feedback.types.length;
    const feedbackItems = (isThereFeedback) ? feedback.types.map(this.renderFeedbackItem) : null;

    return (
      <div className="feedback-section">
        <div>
          {feedbackItems}
          <button
            className="feedback-section__new-feedback-button standard-button"
            onClick={this.openEditModal.bind(this, undefined, undefined)}
          >
            <i className="fa fa-plus-circle" />
            {' '}
            <Translate content="singleFeedbackEditor.addType" />
          </button>
        </div>
      </div>
    );
  }
}

SingleFeedbackEditor.propTypes = {
  task: React.PropTypes.shape({
    feedback: React.PropTypes.shape({
      types: React.PropTypes.array(React.PropTypes.shape({
        answerIndex: React.PropTypes.string
      }))
    }),
    answers: React.PropTypes.arrayOf(React.PropTypes.shape({
      _key: React.PropTypes.number
    }))
  }),
  saveFeedbackFn: React.PropTypes.func
};

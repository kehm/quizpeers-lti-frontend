import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Publish from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import CombineTermsTask from '../components/CombineTermsTask';
import MultipleChoiceTask from '../components/MultipleChoiceTask';
import Summary from '../components/Summary';
import formatDate from '../../utils/format-date';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import { getSubmission, saveAnswers, submitQuiz } from '../../utils/api/submissions';
import StartQuizButton from '../components/buttons/StartQuizButton';
import NameImageTask from '../components/NameImageTask';

/**
 * Render quiz assignment for student
 */
const Quiz = ({ assignment, onExpired }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();
    const [started, setStarted] = useState(false);
    const [submission, setSubmission] = useState(undefined);
    const [selected, setSelected] = useState(0);
    const [openConfirm, setOpenConfirm] = useState(undefined);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(undefined);

    /**
     * Get quiz submission and tasks
     */
    useEffect(() => {
        if (!submission) {
            const getQuizSubmission = async () => {
                try {
                    const tmpSubmission = await getSubmission(
                        assignment.id || assignment.assignment_id,
                        started,
                    );
                    setSubmission(tmpSubmission);
                    if (!tmpSubmission.tasks) setError(language.dictionary.errorQuiz);
                    setError(undefined);
                } catch (err) {
                    if (err.response && err.response.status === 405) {
                        onExpired();
                    } else if (started || !err.response || err.response.status !== 404) {
                        setError(language.dictionary.internalAPIError);
                    }
                }
            };
            getQuizSubmission();
        } else if (submission && !started) {
            if (submission.status === 'STARTED') {
                setStarted(true);
            } else setSuccess(true);
        }
    }, [started, submission]);

    /**
     * Update task index from URL change
     */
    useEffect(() => {
        try {
            if (submission) {
                let sel = 0;
                if (location.hash === '#summary') {
                    sel = submission.tasks.length;
                } else {
                    const params = new URLSearchParams(location.search);
                    const taskId = parseInt(params.get('task'), 10);
                    const taskIndex = submission.tasks.findIndex(
                        (element) => element.task.id === taskId,
                    );
                    if (taskIndex === -1 && submission.tasks.length < assignment.size) {
                        sel = submission.tasks.length;
                    } else if (taskIndex > -1 && taskIndex < submission.tasks.length) {
                        sel = taskIndex;
                    }
                }
                setSelected(sel);
            }
        } catch (err) {
            setSelected(0);
        }
    }, [location.search, location.hash, submission]);

    /**
     * Scroll to top when changing task
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selected]);

    /**
     * Submit quiz answers to API
     */
    const handleSubmit = async () => {
        try {
            await submitQuiz(submission.id);
            setSuccess(true);
        } catch (err) {
            if (err.response && err.response.status === 405) {
                onExpired();
            } else setError(language.dictionary.submissionError);
        }
    };

    /**
     * Save quiz answers to server
     */
    const handleSaveAnswers = async () => {
        try {
            await saveAnswers(
                submission.id,
                submission.tasks.map((task) => ({ id: task.task.id, answer: task.answer })),
            );
        } catch (err) {
            if (err.response && err.response.status === 405) {
                onExpired();
            } else setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Change selected answer for the task
     *
     * @param {string} type Task type
     * @param {int} answer Selected option/relation
     */
    const handleChangeAnswer = (type, answer) => {
        const tmpSubmission = { ...submission };
        if (type === 'MULTIPLE_CHOICE') {
            if (tmpSubmission.tasks[selected].answer === answer) {
                tmpSubmission.tasks[selected].answer = undefined;
            } else tmpSubmission.tasks[selected].answer = answer;
        } else tmpSubmission.tasks[selected].answer = answer;
        setSubmission(tmpSubmission);
    };

    /**
     * Go to next task
     *
     * @param {int} index Task index
     */
    const handleNext = async (index) => {
        await handleSaveAnswers();
        const params = new URLSearchParams();
        if (index > -1 && submission.tasks.length > index) {
            params.append('task', submission.tasks[index].task.id);
        } else if (submission.tasks.length === index) {
            history.push({ hash: 'summary' });
            return;
        }
        history.push({ search: params.toString() });
    };

    /**
     * Render quiz submit button
     *
     * @returns JSX
     */
    const renderSubmitBtn = () => (
        <span className="absolute right-0">
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<Publish />}
                onClick={() => setOpenConfirm(language.dictionary.textConfirmSubmit)}
            >
                {language.dictionary.btnSubmitAnswers}
            </Button>
        </span>
    );

    /**
     * Render back button
     *
     * @returns JSX
     */
    const renderBackButton = () => (
        <Button
            variant="contained"
            color="default"
            size="large"
            startIcon={<NavigateBefore />}
            onClick={() => handleNext(selected - 1)}
        >
            {language.dictionary.btnPrev}
        </Button>
    );

    /**
     * Render navigation buttons
     *
     * @returns JSX
     */
    const renderNavigation = () => (
        <div className="mt-10">
            {selected !== 0 && renderBackButton()}
            {submission.tasks.length !== selected ? (
                <span className="absolute right-0">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<NavigateNext />}
                        onClick={() => handleNext(selected + 1)}
                    >
                        {language.dictionary.btnNext}
                    </Button>
                </span>
            ) : renderSubmitBtn()}
        </div>
    );

    /**
     * Render quiz header
     *
     * @returns JSX
     */
    const renderQuizHeader = () => {
        if (selected < submission.tasks.length) {
            let taskPoints = (assignment.points / 100) * submission.tasks[selected].fraction;
            taskPoints = Math.round(taskPoints * 100) / 100;
            return (
                <div className="mr-2">
                    <h3 className="text-right">
                        {`${language.dictionary.labelTask}: ${selected + 1}${assignment && '/'}${submission.tasks.length}`}
                    </h3>
                    <h3 className="text-right">
                        {`${language.dictionary.labelPoints} ${taskPoints}`}
                    </h3>
                </div>
            );
        }
        return (
            <div className="mb-10">
                <p className="mb-6">{language.dictionary.infoSubmit}</p>
                {renderBackButton()}
                {renderSubmitBtn()}
            </div>
        );
    };

    /**
     * Render task
     *
     * @returns JSX
     */
    const renderTask = () => {
        const assignmentTask = submission.tasks[selected];
        if (assignmentTask.task.type === 'MULTIPLE_CHOICE') {
            return (
                <MultipleChoiceTask
                    key={assignmentTask.task.id}
                    task={assignmentTask.task}
                    value={assignmentTask.answer}
                    onChangeAnswer={(answer) => handleChangeAnswer(
                        assignmentTask.task.type,
                        answer,
                    )}
                />
            );
        }
        if (assignmentTask.task.type === 'COMBINE_TERMS') {
            return (
                <CombineTermsTask
                    key={assignmentTask.task.id}
                    task={assignmentTask.task}
                    values={assignmentTask.answer}
                    selectable
                    onChangeAnswer={(answer) => handleChangeAnswer(
                        assignmentTask.task.type,
                        answer,
                    )}
                />
            );
        }
        if (assignmentTask.task.type === 'NAME_IMAGE') {
            return (
                <NameImageTask
                    key={assignmentTask.task.id}
                    task={assignmentTask.task}
                    value={assignmentTask.answer}
                    glossary={assignment.glossary}
                    onChangeAnswer={(answer) => handleChangeAnswer(
                        assignmentTask.task.type,
                        answer,
                    )}
                />
            );
        }
        return null;
    };

    /**
     * Render quiz assignment
     *
     * @returns JSX
     */
    const renderQuizAssignment = () => {
        if (!started) {
            return (
                <StartQuizButton
                    assignment={assignment}
                    onStart={(timer) => setOpenConfirm(assignment.timer
                        ? `${language.dictionary.textConfirmStart} ${timer}`
                        : language.dictionary.textConfirmStart)}
                />
            );
        }
        if (submission && submission.tasks && !error) {
            return (
                <>
                    <h3 className="text-blue-600 mb-10 text-center">
                        {language.dictionary.labelSubDeadline}
                        <span className="font-bold">{formatDate(submission.deadline)}</span>
                    </h3>
                    {renderQuizHeader()}
                    {submission.tasks.length === selected
                        ? <Summary tasks={submission.tasks} />
                        : renderTask()}
                    {renderNavigation()}
                </>
            );
        }
        return null;
    };

    return (
        <div className="relative pb-20">
            <h1 className="mb-10 text-center">{assignment.title}</h1>
            {success ? (
                <div className="pb-10">
                    <h2 className=" mb-4 text-blue-600">{language.dictionary.quizSuccess}</h2>
                    <p>{language.dictionary.findResult}</p>
                </div>
            ) : renderQuizAssignment()}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            <ConfirmDialog
                openContent={openConfirm}
                onClose={() => setOpenConfirm(undefined)}
                onConfirm={() => {
                    if (openConfirm === language.dictionary.textConfirmSubmit) {
                        handleSubmit();
                    } else setStarted(true);
                }}
            />
        </div>
    );
};

export default Quiz;

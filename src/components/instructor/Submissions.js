import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams, useLocation } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';
import EvaluateTask from './EvaluateTask';
import QuizSubmission from './QuizSubmission';
import SubmissionList from '../components/lists/SubmissionList';
import { getPendingSubmissions, getPublishedSubmissions, publishResults } from '../../utils/api/submissions';
import { getAssignment, publishSolution } from '../../utils/api/assignments';
import { createTaskGroup, getIncludedTasks, getTaskGroups } from '../../utils/api/tasks';
import BackButton from '../components/buttons/BackButton';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import CreateGroupDialog from '../components/dialogs/CreateGroupDialog';
import CreateTaskDialog from '../components/dialogs/CreateTaskDialog';
import SubmissionsBar from '../components/SubmissionsBar';
import SubmissionsNav from '../components/buttons/SubmissionsNav';
import TaskGroupList from '../components/lists/TaskGroupList';
import SubmissionListHeader from '../components/SubmissionListHeader';

/**
 * Render view for the teacher to evaluate submissions and publish the results
 */
const Submissions = () => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();
    const { id } = useParams();
    const [tab, setTab] = useState(0);
    const [assignment, setAssignment] = useState(undefined);
    const [pendingSubmissions, setPendingSubmissions] = useState(undefined);
    const [publishedSubmissions, setPublishedSubmissions] = useState(undefined);
    const [submissions, setSubmissions] = useState(undefined);
    const [selected, setSelected] = useState(undefined);
    const [includedTasks, setIncludedTasks] = useState(undefined);
    const [publish, setPublish] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [groups, setGroups] = useState(undefined);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);
    const [openCreateTask, setOpenCreateTask] = useState(false);

    /**
     * Get submissions
     *
     * @param initialized Get assignment if false
     */
    const getSubmissions = async (initialized) => {
        try {
            const pending = await getPendingSubmissions(id);
            const published = await getPublishedSubmissions(id);
            const all = pending.concat(published);
            setPendingSubmissions(pending);
            setPublishedSubmissions(published);
            setSubmissions(all);
            if (!initialized) {
                const tmpAssignment = await getAssignment(id);
                const tmpIncluded = await getIncludedTasks([id]);
                setAssignment(tmpAssignment);
                setIncludedTasks(tmpIncluded);
            }
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Set pending or published submissions list
     */
    useEffect(() => {
        getSubmissions(assignment);
    }, [assignment]);

    /**
     * Update submission index from URL submission parameter
     */
    useEffect(() => {
        try {
            if (submissions) {
                const params = new URLSearchParams(location.search);
                const submissionId = params.get('submission');
                const selectedTab = parseInt(params.get('tab'), 10);
                const index = submissions.findIndex((element) => element.id === submissionId);
                if (index > -1) {
                    setSelected(index);
                } else setSelected(undefined);
                if (selectedTab > -1 && selectedTab < 3) setTab(selectedTab);
            }
        } catch (err) {
            setSelected(undefined);
        }
    }, [location.search, submissions]);

    /**
     * Get task groups from API
     */
    useEffect(() => {
        if (!groups) {
            const getGroups = async () => {
                try {
                    const arr = await getTaskGroups(id);
                    setGroups(arr);
                } catch (err) {
                    setError(language.dictionary.internalAPIError);
                }
            };
            getGroups();
        }
    }, [groups]);

    /**
     * Publish selected submission results
     */
    const handlePublish = async () => {
        try {
            await publishResults(assignment.id, publish);
            setAssignment(undefined);
            setError(undefined);
        } catch (err) {
            setError(language.dictionary.publishError);
        }
    };

    /**
     * Publish/unpublish quiz solution
     */
    const handlePublishSolution = async () => {
        try {
            await publishSolution(assignment.id);
            setAssignment(undefined);
            setError(undefined);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Create new task group
     *
     * @param {Object} values Title and description
     */
    const handleCreateGroup = async (values) => {
        try {
            await createTaskGroup(values.name, values.description, id);
            setOpenCreateGroup(false);
            setGroups(undefined);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Select/deselect submissions
     *
     * @param {boolean} select True if select
     * @param {int} submissionId Submission ID (select all if undefined)
     */
    const handleSelect = (select, submissionId) => {
        const arr = [...submissions];
        if (submissionId) {
            const tmpSub = arr.find((element) => element.id === submissionId);
            if (tmpSub.status !== 'PENDING') tmpSub.selected = select;
        } else arr.forEach((element) => { if (element.status === 'EVALUATED') element.selected = select; });
        setSubmissions(arr);
    };

    /**
     * Go to next submission
     *
     * @param {int} index Submission index
     */
    const handleNext = (index) => {
        const params = new URLSearchParams();
        if (index > -1) {
            if (tab === 0 && pendingSubmissions.length > index) {
                params.append('submission', pendingSubmissions[index].id);
            } else if (tab === 1 && publishedSubmissions.length > index) {
                params.append('submission', publishedSubmissions[index].id);
            }
        }
        params.append('tab', tab);
        history.push({ search: params.toString() });
    };

    /**
     * Go to submission/task
     *
     * @param {Object} task Task
     */
    const handleClickTask = (task) => {
        const params = new URLSearchParams(location.search);
        params.set('submission', task.submission_id);
        params.set('task', task.id);
        history.push({ search: params.toString() });
    };

    /**
     * Render selected submission
     *
     * @returns JSX
     */
    const renderContent = () => {
        if (submissions[selected].assignment.type === 'TASK_SUBMISSION') {
            return (
                <EvaluateTask
                    submissions={submissions}
                    index={selected}
                    groups={groups}
                    onEvaluated={() => setAssignment(undefined)}
                />
            );
        }
        return (
            <QuizSubmission
                submission={submissions[selected]}
                status={assignment.status}
                onClick={(ids) => setPublish(ids)}
            />
        );
    };

    /**
     * Render assignment status notification
     *
     * @returns JSX
     */
    const renderAssignmentStatus = () => {
        if (assignment.type === 'TASK_SUBMISSION') {
            return <p>{language.dictionary.headerNotFinished}</p>;
        }
        return <p>{language.dictionary.headerNotFinishedQuiz}</p>;
    };

    /**
     * Render submission
     *
     * @returns JSX
     */
    const renderSubmission = () => (
        <>
            <BackButton
                label={language.dictionary.btnSubmissionReturn}
                onClick={() => handleNext(undefined)}
                color="inherit"
            />
            {tab !== 2 && (
                <SubmissionsNav
                    index={selected}
                    tab={tab}
                    total={submissions.length}
                    lengthPending={pendingSubmissions.length}
                    onNext={(index) => handleNext(index)}
                />
            )}
            <hr className="mt-2" />
            <h2 className="my-6">
                {language.dictionary.headerSubmissionBy}
                <span className="font-light">
                    {submissions[selected].quizpeers_user
                        && submissions[selected].quizpeers_user.name
                        ? submissions[selected].quizpeers_user.name
                        : submissions[selected].id}
                </span>
            </h2>
            {assignment && assignment.status === 'STARTED' && renderAssignmentStatus()}
            {renderContent()}
        </>
    );

    /**
     * Render list of all submissions or selected submission
     *
     * @returns JSX
     */
    const renderPage = () => {
        if (selected !== undefined) return renderSubmission();
        return (
            <>
                <SubmissionsBar tab={tab} assignment={assignment} />
                <SubmissionListHeader
                    tab={tab}
                    submissions={submissions}
                    status={assignment.status}
                    type={assignment.type}
                    pending={pendingSubmissions}
                    published={publishedSubmissions ? publishedSubmissions.length : 0}
                    onSelect={(val) => handleSelect(val)}
                    onPublish={(arr) => setPublish(arr)}
                    onCreateGroup={() => setOpenCreateGroup(true)}
                    onCreateTask={() => setOpenCreateTask(true)}
                    onToggleSolution={() => handlePublishSolution()}
                />
                {tab === 2 ? (
                    <TaskGroupList
                        groups={groups}
                        includedTasks={includedTasks}
                        onClickTask={(task) => handleClickTask(task)}
                    />
                ) : (
                    <SubmissionList
                        submissions={tab === 0 ? pendingSubmissions : publishedSubmissions}
                        status={assignment.status}
                        maxScore={assignment ? assignment.points : 0}
                        selectable={tab === 0}
                        onClickListItem={(index) => handleNext(index)}
                        onSelect={(val, subId) => handleSelect(val, subId)}
                    />
                )}
            </>
        );
    };

    return (
        <div className="p-4 rounded max-w-xl relative m-auto">
            <h1 className="mb-2">{language.dictionary.headerSubmissions}</h1>
            {error && <p className="text-red-600">{error}</p>}
            {assignment && submissions && renderPage()}
            <CreateGroupDialog
                openDialog={openCreateGroup}
                onCreate={(values) => handleCreateGroup(values)}
                onClose={() => setOpenCreateGroup(false)}
                error={error}
            />
            <CreateTaskDialog
                openDialog={openCreateTask}
                assignment={assignment}
                onClose={() => setOpenCreateTask(false)}
                onSuccess={() => setAssignment(undefined)}
                onError={() => setError(language.dictionary.internalAPIError)}
                error={error}
            />
            <ConfirmDialog
                openContent={publish && language.dictionary.textConfirmPublish}
                onClose={() => setPublish(undefined)}
                onConfirm={() => handlePublish()}
            />
        </div>
    );
};

export default Submissions;

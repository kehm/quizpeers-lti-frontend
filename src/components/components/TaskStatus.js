import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import EditOutlined from '@material-ui/icons/EditOutlined';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render task status
 */
const TaskStatus = ({ task, status, onEdit }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="flex">
            <dl className="grid">
                {task.score !== null && (
                    <>
                        <dt className="col-start-1 font-bold">
                            {language.dictionary.labelScore}
                            :
                        </dt>
                        <dd className="text-blue-600 col-start-2 ml-10">{task.score}</dd>
                    </>
                )}
                <dt className="col-start-1 font-bold">
                    {language.dictionary.labelInclude}
                </dt>
                <dd className="text-blue-600 col-start-2 ml-10">
                    {task.status === 'EVALUATED_INCLUDE' ? language.dictionary.labelYes : language.dictionary.labelNo}
                </dd>
            </dl>
            <span className="absolute right-8 mt-2">
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    endIcon={<EditOutlined />}
                    onClick={() => onEdit()}
                >
                    {status === 'EVALUATED_PUBLISHED' ? language.dictionary.btnEdit : language.dictionary.btnEditEval}
                </Button>
            </span>
        </div>
    );
};

export default TaskStatus;

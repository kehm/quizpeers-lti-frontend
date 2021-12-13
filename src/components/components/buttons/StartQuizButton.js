import React, { useContext } from 'react';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';
import formatDate from '../../../utils/format-date';

/**
 * Render start quiz button
 */
const StartQuizButton = ({ assignment, onStart }) => {
    const { language } = useContext(LanguageContext);

    let timer;
    if (assignment.timer) {
        let hrs = assignment.timer[0];
        let mins = assignment.timer[1];
        hrs = assignment.timer[0] > 0 && `${assignment.timer[0]} ${language.dictionary.hours}`;
        mins = assignment.timer[1] > 0 && `${assignment.timer[1]} ${language.dictionary.mins}`;
        timer = `${language.dictionary.textConfirmStart1} ${hrs || ''} ${hrs && mins ? `${language.dictionary.and} ` : ''}${mins || ''} ${language.dictionary.textConfirmStart2}!`;
    }

    return (
        <>
            <p className="mb-10">
                {language.dictionary.quizIsDue}
                <span className="font-bold">{formatDate(assignment.deadline)}</span>
                {`. ${language.dictionary.infoSaveAnswers}`}
            </p>
            <div className="text-center">
                {assignment.timer && <p className="text-blue-600 mb-10">{timer}</p>}
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<PlayArrow />}
                    onClick={() => onStart(timer)}
                >
                    {language.dictionary.btnStartQuiz}
                </Button>
            </div>
        </>
    );
};

export default StartQuizButton;

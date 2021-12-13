import React, { useEffect, useState } from 'react';
import '../styles/app.css';
import '../styles/tailwind.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import materialTheme from '../styles/material-ui';
import LanguageContext from '../context/LanguageContext';
import { dictionary } from '../languages/language';
import CreateAssignment from './instructor/CreateAssignment';
import Submissions from './instructor/Submissions';
import Assignment from './learner/Assignment';
import getUserRole from '../utils/api/auth';

/**
 * App entry point
 */
const App = () => {
  // Set default language
  const languageState = {
    language: 'en',
    dictionary: dictionary.en,
  };

  const [language, setLanguage] = useState(languageState);
  const languageValue = { language, setLanguage };
  const [instructor, setInstructor] = useState(false);
  const [learner, setLearner] = useState(false);

  /**
   * Set language and authorize
   */
  useEffect(() => {
    const getRole = async () => {
      const [isInstructor, isLearner] = await getUserRole();
      setInstructor(isInstructor);
      setLearner(isLearner);
    };
    getRole();
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang === 'nb') {
      setLanguage({ language: 'no_bm', dictionary: dictionary.no_bm });
    } else if (lang === 'nn') {
      setLanguage({ language: 'no_ny', dictionary: dictionary.no_ny });
    } else if (lang && lang.startsWith('en', 0)) {
      setLanguage({ language: 'en', dictionary: dictionary.en });
    }
  }, []);

  /**
   * Render assignment
   *
   * @returns JSX
   */
  const renderAssignment = () => {
    if (learner) return <Assignment />;
    if (instructor) return <Submissions />;
    return null;
  };

  return (
    <BrowserRouter>
      <LanguageContext.Provider value={languageValue}>
        <ThemeProvider theme={materialTheme}>
          <Switch>
            <Route path="/create" exact render={() => (instructor && <CreateAssignment />)} />
            <Route path="/assignment/:id" exact render={() => renderAssignment()} />
          </Switch>
        </ThemeProvider>
      </LanguageContext.Provider>
    </BrowserRouter>
  );
};

export default App;

# QuizPeers LTI
## React.js Frontend

Related project: <https://github.com/kehm/quizpeers-lti-backend>

QuizPeers is an external tool/LTI (Learning Tools Interoperability) for Canvas LMS (Learning Management System).

With QuizPeers you can create two types of assignments:
1. Task Assignments: Each student must submit a specified number of tasks that can later be used to generate a quiz. 
   The teacher must grade each submitted task on a scale of 0-10 and decide if the submitted task is of high enough 
   quality to be included in a quiz. The total score for each student can be published to Canvas.
2. Quiz Assignments: Students are quized on either a definite set or a random subset of the tasks submitted by other students in a task assignment.
   Tasks can be of difficulties low, medium or high and the student is given a specified number of tasks from each difficulty or task group.
   Scores are generated automatically when the student submits his/her answers. The teacher can review the scores before publishing them to Canvas.

The React.js frontend loads in an iframe in Canvas. The user is presented either the instructor view or the learner view, depending on the user's role in Canvas. 

This project is created by the University of Bergen (UiB), Norway (Copyright).



export const signup = user => (
    fetch("api/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      } 
    })
  );
  
  export const login = user => (
    fetch("api/session", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    })
  );

  export const logout = () => (
    fetch("api/session", { 
        method: "DELETE"
    })
  );

  export const getSurveys = () => (

    fetch("/api/survey/surveys", {
      method: "GET",
    })
);

  export const getSurvey = surveyId => (
    fetch("/api/survey/"+surveyId, {
      method: "GET",
    })
);

  export const getSurveyWithResponses = surveyId => (
      fetch("/api/analytics/survey/"+surveyId, {
        method: "GET",
      })
  )

  export const getManagerAuthoredSurveys = () => (

      fetch("/api/analytics/surveys", {
        method: "GET",
      })
);

  export const getEmployees = async () => (
    fetch("/api/employees", {
      method: "GET",
    })
  )

  export const checkLoggedIn = async (preloadedState) => {
    const response =  await fetch('/api/session');
    const { user } =  await response.json();
    if (user) {
      preloadedState = {
        session: user
      };
    }
    return preloadedState;
  };


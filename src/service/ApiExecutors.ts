import Api from "./ApiConfig";

export const getLanguages = () => {
  return Api()
    .get(`https://judge0-ce.p.rapidapi.com/languages`)
    .then((result: any) => {
      return result.data;
    });
};

export const getSingleLanguage = (id: string) => {
  return Api()
    .get(`https://judge0-ce.p.rapidapi.com/languages/${id}`)
    .then((result: any) => {
      return result.data;
    });
};

export const postSubmission = (data: any) => {
  return Api()
    .post(
      `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*`,
      data
    )
    .then((result: any) => {
      return result.data;
    });
};

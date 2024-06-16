import Api from "./Api";

export default {
  async login(payload) {
    return await Api().post("auth/login", payload);
  },

  async getAccessToken(refreshToken) {
    return await Api().post(`auth/access-token`, {
      refreshToken,
    });
  },

  // Student
  async getStudentDetails() {
    return await Api().get("/details");
  },

  // Batch
  async getStudentBatch() {
    return await Api().get("/batch");
  },

  // Subject
  async getSingleSubject(id) {
    return await Api().get("/subject/" + id);
  },

  // Unit
  async getSingleUnit(id) {
    return await Api().get("/unit/" + id);
  },

  // Submit Unit Quiz
  async submitUnitQuiz(payload) {
    return await Api().post("/unit-quiz", payload);
  },

  // Single Unit Quiz
  async getSingleUnitQuiz(id) {
    return await Api().get("/unit-quiz/" + id);
  },

  // Get Unit Quiz Responses
  async getAllQuizResponses(params) {
    return await Api().get("/unit-quiz-responses", { params });
  },
};

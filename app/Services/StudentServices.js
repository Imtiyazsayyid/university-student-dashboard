import Api from "./Api";

const StudentServices = {
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

  // Get All Assignments
  async getAllAssignments(params) {
    return await Api().get("/assignments", { params });
  },

  async getSingleAssignment(id) {
    return await Api().get("/assignment/" + id);
  },

  async submitAssignment(payload) {
    return await Api().post("/assignment", payload);
  },

  // Events
  async getAllEvents(params) {
    return await Api().get("/events", { params });
  },

  async getSingleEvent(id) {
    return await Api().get("/event/" + id);
  },

  async participateInEvent(payload) {
    return await Api().post("/join-event-participants", payload);
  },

  async leaveEvent(eventId) {
    return await Api().delete(`/leave-event/${eventId}`);
  },
};

export default StudentServices;

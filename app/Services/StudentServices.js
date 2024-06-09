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
};

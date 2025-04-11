const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const userModel = require("../models/User");

const fetchAllDoctors = async () => {
  try {
    const doctors = await userModel
      .find({ role: "doctor", isApproved: true })
      .select("id practice");

    const formatDoctor = doctors.map((doctor) => ({
      id: doctor._id.toString(),
      practice: doctor.practice,
    }));

    return JSON.stringify(formatDoctor, null, 2);
  } catch (err) {
    console.error(err);
  }
};

exports.getAllDoctors = tool(fetchAllDoctors, {
  name: "fetch_all_doctors",
  description: "Fetch all doctors from the database",
  schema: z.object({
    symptoms: z.string().describe("The symptoms the user is experiencing"),
  }),
});

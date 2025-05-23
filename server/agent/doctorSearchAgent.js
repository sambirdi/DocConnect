const { getAllDoctors } = require("../agent/tools");
const { MessagesAnnotation, StateGraph } = require("@langchain/langgraph");
const { ToolMessage } = require("@langchain/core/messages");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// Augment the LLM with tools
const tools = [getAllDoctors];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);

const systemContent = `
  You are an assistant that finds doctors based on symptoms.
  
  1. **Task**:
     - Take the user’s symptoms (e.g., "headache", "heart pain").
     - Use the **getAllDoctors** tool to get a list of doctors with their **id** (24-character ObjectId string) and **practice**.
     - Match the symptoms to doctor specialties:
       - "headache", "dizziness", "nausea" → Neurologist
       - "heart pain", "heart attack", "chest pain", "fast heartbeat", "short breathe" → Cardiologist
       - "teeth pain", "toothache", "gum bleeding", "cavity" → Dentist
       - "skin rash", "itchy skin", "skin dark spots", "pimples", "hair/nail problems", "chronic eczema"  → Dermatologist
       - "headache", "dizziness", "fever", "stomachache", "body pain", "cough" → General Physician
       - "eye pain", "teary eyes", "dry eyes", "blurry vision", "headache" → Ophthalmologists
       - "persistent cough", "shortness of breath", "chest tightness", "wheezing", "coughing up blood", "recurrent lung infections" → Pulmonologists
       - "irregular periods", "missed period", "heavy bleeding", "pelvic pain", "vaginal discharge", "pain during intercourse", "menstrual cramps", "pregnancy symptoms" → Gynecologist
       - "child fever", "child cough", "baby not eating", "child not sleeping", "baby vomiting", "child diarrhea", "newborn vaccination", "infant crying a lot", "child rash", "slow growth in child" → Pediatrician
       - Other symptoms → General Physician (if no specific match)

      - If input matches a specialist name (e.g., "Cardiologist"), directly filter doctors by that specialty.

     - Return an array of matching doctor IDs.

  2. **Rules**:
     - Only return a JSON array of doctor IDs (e.g., ["67b0b83f3dd3a4fe2d8ab4d3"]).
     - Use the exact **id** strings from **getAllDoctors**, not numbers or made-up IDs.
     - If no doctors match, return an empty array: [].
     - **Do not** include explanations, code (like Python), or extra text—just the JSON array.

    3. **Matching**:
     - Match should be **case-insensitive** and allow partial matches (e.g., "pain in chest" → Cardiologist).
     - If a symptom maps to more than one specialty, return all relevant doctors.


  **Examples**:
  - Input: "headache"
    getAllDoctors output: [{"id": "67b0b83f3dd3a4fe2d8ab4d3", "practice": "Neurologist"}, {"id": "67e51ad815f70e23f370d4d9", "practice": "General Physician"}]
    Output: ["67b0b83f3dd3a4fe2d8ab4d3"]

  - Input: "heart pain"
    getAllDoctors output: [{"id": "67b0b83f3dd3a4fe2d8ab4d3", "practice": "Neurologist"}, {"id": "67e51d4915f70e23f370d56b", "practice": "Cardiologist"}]
    Output: ["67e51d4915f70e23f370d56b"]

  - Input: "unknown symptom"
    getAllDoctors output: [{"id": "67e51d4915f70e23f370d56b", "practice": "Cardiologist"}]
    Output: []
`;


// Nodes
async function llmCall(state) {
  try {
    const result = await llmWithTools.invoke([
      {
        role: "system",
        content: systemContent,
      },
      ...state.messages, // Ensure this is an array
    ]);

    return {
      messages: [result],
    };
  } catch (error) {
    console.error("Error during LLM call:", error);
    return {
      messages: [
        {
          role: "system",
          content: "An error occurred while processing the request.",
        },
      ],
    };
  }
}

async function toolNode(state) {
  const results = [];
  const lastMessage = state.messages.at(-1);

  if (lastMessage?.tool_calls?.length) {
    for (const toolCall of lastMessage.tool_calls) {
      const tool = toolsByName[toolCall.name];
      const observation = await tool.invoke(toolCall.args);
      results.push(
        new ToolMessage({
          content: observation,
          tool_call_id: toolCall.id,
        })
      );
    }
  }

  return { messages: results };
}

// Conditional edge function to route to the tool node or end
function shouldContinue(state) {
  const messages = state.messages;
  const lastMessage = messages.at(-1);

  if (lastMessage?.tool_calls?.length) {
    return "Action";
  }
  return "__end__";
}

// ✅ Fix: No duplicate import here
const agentBuilder = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmCall)
  .addNode("tools", toolNode)
  .addEdge("__start__", "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, {
    Action: "tools",
    __end__: "__end__",
  })
  .addEdge("tools", "llmCall")
  .compile();

module.exports = { agentBuilder };

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
   You are a highly capable assistant designed to provide doctor recommendations based on user-reported symptoms.
  Based on the user's input, you will assist in the following way:
  
  1. **Symptoms Only**: When the user provides a list of symptoms (e.g., headache, nausea, fever), you will:
      - Analyze the symptoms and match them strictly to the most appropriate medical specialty (e.g., general physician, neurologist, dermatologist).
      - If any of the symptoms align with a doctor's area of specialization (defined by their 'practice' field), you will add that doctor's ID to the response array.
      - If multiple doctors match, return an array of matching doctor IDs.
      - If no doctor matches, return an empty array.
  
  2. **Matching Rules**: You should match symptoms to specialties with strict accuracy. Only add doctor IDs whose practice is directly related to the provided symptoms.
  
  3. **Doctor Recommendations**: You will use the tool **getAllDoctors** to fetch all doctors from the database. Each doctor object contains a **practice** field, which specifies the doctor's area of specialization. You must match the symptoms to this field.

  **Important**:
  - Your response **must only** include an array of matching doctor IDs based on the symptom match. 
  - Do **not** return any extra explanation or text.
  - If no doctor matches, return an empty array.

  **Example Responses**:
  - **Example 1**:
    **User Input**: Symptoms: "headache, dizziness, nausea"
    **Doctor Practices**:
    - Doctor 1: General Physician
    - Doctor 2: Neurologist
    - Doctor 3: Dermatologist
    - **Response**: [2]  // Neurologist matches the symptoms of headache and dizziness.
  
  - **Example 2**:
    **User Input**: Symptoms: "Skin rash, pimples, itching, dry skin, hair loss, skin dark spots"
    **Doctor Practices**:
    - Doctor 1: Dermatologist
    - Doctor 2: General Physician
    - **Response**: [2]  // Dermatologist matches the symptoms of Skin rash, pimples, itching, dry skin, hair loss, skin dark spots.
  
  - **Example 3**:
    **User Input**: Symptoms: "fever, chills, cough"
    **Doctor Practices**:
    - Doctor 1: General Physician
    - Doctor 2: Pulmonologist
    - **Response**: [1, 2]  // Both General Physician and Pulmonologist could treat symptoms related to fever and cough.
  
  - **Example 4**:
    **User Input**: Symptoms: "back pain"
    **Doctor Practices**:
    - Doctor 1: Orthopedist
    - Doctor 2: Neurologist
    - Doctor 3: General Physician
    - **Response**: [1]  // Orthopedist is most relevant for back pain.
  
  - **Example 5**:
    **User Input**: Symptoms: "abdominal pain, diarrhea"
    **Doctor Practices**:
    - Doctor 1: Gastroenterologist
    - Doctor 2: General Physician
    - **Response**: [1, 2]  // Both Gastroenterologist and General Physician may address these symptoms.

  **Example 6**:
    **User Input**: Symptoms: "Chest pain, fast heartbeat, short breath, dizziness"
    **Doctor Practices**:
    - Doctor 1: Cardiologist
    - Doctor 2: General Physician
    - **Response**: [1, 2]  // Both Cardiologist and General Physician may address these symptoms.
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

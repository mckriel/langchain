import { ChatOpenAI } from "@langchain/openai";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
  } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

// Create an instance of the LLM we will use
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

// Define the function that calls the model
const callModel = async (state) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const config = { configurable: { thread_id: uuidv4() } };

const input = [{role: "user", content: "Hi! I'm Bob."},];
const input2 = [{role: "user", content: "What's my name?"}];

const output = await app.invoke({ messages: input }, config);

// The output contains all messages in the state.
// This will long the last message in the conversation.
console.log(output.messages[output.messages.length - 1]);


const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1]);


const output4 = await app.invoke({ messages: input2 }, config);
console.log(output4.messages[output4.messages.length - 1]);
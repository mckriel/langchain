import { ChatOpenAI } from "@langchain/openai";
import {
    START,
    END,
    StateGraph,
    MemorySaver,
    MessagesAnnotation,
    Annotation,
  } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Create an instance of the LLM we will use
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

const promptTemplate2 = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Answer all questions to the best of your ability in {language}."],
    ["placeholder", "{messages}"],
]);

const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    language: Annotation(),
  });

// Define the function that calls the model
const callModel3 = async (state) => {
    const prompt = await promptTemplate2.invoke(state);
    const response = await llm.invoke(prompt);
    return { messages: [response] };
};

const workflow3 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel3)
    .addEdge(START, "model")
    .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "English",
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]);


const input7 = {
    messages: [
      {
        role: "user",
        content: "What is my name?",
      },
    ],
};

const output8 = await app3.invoke(input7, config4);
console.log(output8.messages[output8.messages.length - 1]);
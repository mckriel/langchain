import { ChatOpenAI } from "@langchain/openai";
import {
    START,
    END,
    StateGraph,
    MemorySaver,
    MessagesAnnotation,
    Annotation,
  } from "@langchain/langgraph";
import {
    SystemMessage,
    HumanMessage,
    AIMessage,
    trimMessages,
} from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Create an instance of the LLM we will use
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    language: Annotation(),
});

const promptTemplate2 = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Answer all questions to the best of your ability in {language}."],
    ["placeholder", "{messages}"],
]);

const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: (msgs) => msgs.length,
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
});
  
const messages = [
    new SystemMessage("you're a good assistant"),
    new HumanMessage("hi! I'm bob"),
    new AIMessage("hi!"),
    new HumanMessage("I like vanilla ice cream"),
    new AIMessage("nice"),
    new HumanMessage("whats 2 + 2"),
    new AIMessage("4"),
    new HumanMessage("thanks"),
    new AIMessage("no problem!"),
    new HumanMessage("having fun?"),
    new AIMessage("yes!"),
];

// await trimmer.invoke(messages);

const callModel4 = async (state) => {
    const trimmedMessage = await trimmer.invoke(state.messages);
    const prompt = await promptTemplate2.invoke({
        messages: trimmedMessage,
        language: state.language,
    });
    const response = await llm.invoke(prompt);
    return { messages: [response] };
};

const workflow4 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel4)
    .addEdge(START, "model")
    .addEdge("model", END);

const app4 = workflow4.compile({ checkpointer: new MemorySaver() });

const config5 = { configurable: { thread_id: uuidv4() } };
const input8 = {
  messages: [...messages, new HumanMessage("What is my name?")],
  language: "English",
};

const output9 = await app4.invoke(input8, config5);
console.log(output9.messages[output9.messages.length - 1]);

const config6 = { configurable: { thread_id: uuidv4() } };
const input9 = {
    messages: [...messages, new HumanMessage("What math problem did I ask?")],
    language: "English",
};

const output10 = await app4.invoke(input9, config6);
console.log(output10.messages[output10.messages.length - 1]);



// // Define the function that calls the model
// const callModel3 = async (state) => {
//     const prompt = await promptTemplate2.invoke(state);
//     const response = await llm.invoke(prompt);
//     return { messages: [response] };
// };

// const workflow3 = new StateGraph(GraphAnnotation)
//     .addNode("model", callModel3)
//     .addEdge(START, "model")
//     .addEdge("model", END);

// const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

// const config4 = { configurable: { thread_id: uuidv4() } };
// const input6 = {
//   messages: [
//     {
//       role: "user",
//       content: "Hi im bob",
//     },
//   ],
//   language: "English",
// };
// const output7 = await app3.invoke(input6, config4);
// console.log(output7.messages[output7.messages.length - 1]);


// const input7 = {
//     messages: [
//       {
//         role: "user",
//         content: "What is my name?",
//       },
//     ],
// };

// const output8 = await app3.invoke(input7, config4);
// console.log(output8.messages[output8.messages.length - 1]);
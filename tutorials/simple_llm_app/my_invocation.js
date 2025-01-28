import { config } from 'dotenv';
config();
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4" });

const systemTemplate1 = "You are a really helpful coding assistant.";
const systemTemplate2 = "You take in a request from a user to create a function that is the most effecient possible according to big O notation.";
const systemTemplate3 = "Output the function in {coding_language} code.";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate1],
    ["system", systemTemplate2],
    ["system", systemTemplate3],
    ["user", "{function_description}"],
]);

const promptValue = await promptTemplate.invoke({
    coding_language: "javascript",
    function_description: "add two numbers together and multiply the result by 2",
});

const response = await model.invoke(promptValue);
console.log(`${response.content}`);

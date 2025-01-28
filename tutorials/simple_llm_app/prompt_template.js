import { config } from 'dotenv';
config();
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4" });
const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
	["system", systemTemplate],
	["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
	language: "italian",
	text: "hi!",
});
  
const response = await model.invoke(promptValue);
console.log(`${response.content}`);
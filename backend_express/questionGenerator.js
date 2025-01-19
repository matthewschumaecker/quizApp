const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');
const fs = require('fs');
const path = require('path');

const genCardPrompt = fs.readFileSync('./prompts/genCard.txt', 'utf8');

const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//the main method that generates the quiz questions from LLM

const generateQuestions = async (topic, numQuestions) => {
  console.log(`Generating ${numQuestions} quiz question(s) about ${topic}...`);
  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    model: 'gpt-4o',
    temperature: 0.2
  });



  const prompt = ChatPromptTemplate.fromTemplate(genCardPrompt);

  const fields = ['text', 'options', 'correctAnswer', 'explanation', 'topic'];

  const parser = new JsonOutputParser({ fields });
  //console.log('Prompt:', prompt);

  try {
    const chain = prompt.pipe(llm).pipe(parser);
    const response = await chain.invoke({ topic, numQuestions });
    // console.log('Generated quiz question(s):', response);
    console.log(
      `Successfully generated ${numQuestions} quiz question(s) about ${topic}...`
    );
    return response;
  } catch (error) {
    console.error('Error in generating quiz question:', error);

    throw error;
  }
};

module.exports = { generateQuestions };

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');
const fs = require('fs');
const path = require('path');

const genCardPrompt = fs.readFileSync('./prompts/genCard.txt', 'utf8');

const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;



const generatePatientAge = () =>{
  let mean = 3.8 //Log-normal mean
  let stdDev = 0.35 //Log-normal standard deviation
  // Generate a right-skewed value using a normal distribution
  let normalValue = mean + stdDev * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
  // Convert the normal value to a log-normal value}
  let skewedValue = Math.exp(normalValue);

  //Scale the value to fit within 18 and 80
  let minAge = 18;
  let maxAge = 80;
  let scaledAge = Math.min(maxAge, Math.max(minAge, skewedValue));

  return Math.round(scaledAge)
};


//the main method that generates the quiz questions from LLM

const generateQuestions = async (topic, numQuestions) => {
  console.log(`Generating ${numQuestions} quiz question(s) with jsExpress about ${topic}...`);
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

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');

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

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `
      -- You are a professor of cardiology who is making a quiz for fellows studying for the board exam. 

      -- These are people who have finished a cardiology fellowship and are preparing to take the board exam to become board-certified cardiologists. They will be cardiologists within one year. The difficultly should be at this level.
      
      -- These questions should be challenging and test the students' knowledge. 

      -- The questions should be very clearly written in a language suited for a physician.

      --  add information to the question text that is not related to the question itself, but that is relevant to the topic.
      
      -- Each question should be in JSON format and have the following fields:
      
            text: 'the question text',
            options: 'an array of four plausible answers; they should be lettered A, B, C, and D',
            correctAnswer: 'the index of the correct answer',
            explanation: 'an explanation of the correct answer',
            topic: 'the general topic of the question'
    
    
          -- Return only valid JSON, and do not include any other explanatory text. Return in an array of question of arrays Even if there is only one question, it should be in an array with one question array element`
    ],
    [
      'human',
      'Ask me {numQuestions} cardiology board review questions on {topic}. Given them to me in JSON format.'
    ]
  ]);

  const fields = ['text', 'options', 'correctAnswer', 'explanation', 'topic'];

  const parser = new JsonOutputParser({ fields });
  //console.log('Prompt:', prompt);

  try {
    const chain = prompt.pipe(llm).pipe(parser);
    const response = await chain.invoke({ topic, numQuestions });
    console.log('Generated quiz question(s):', response);
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

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const {
  StringOutputParser,
  JsonOutputParser // Ensure JsonOutputParser is available in your version of LangChain
} = require('@langchain/core/output_parsers');

const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const askQuizQuestion = async (topic, numQuestions) => {
  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    model: 'gpt-4o',
    temperature: 0.5
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `
      -- You are a professor of cardiology who is making a quiz for fellows studying for the board exam. 

      -- These are people who have finished a cardiology fellowship and are preparing to take the board exam to become board-certified cardiologists. They will be cardiologists within one year. The difficult should be at this level.
      
      -- These questions should be challenging and test the students' knowledge. 

      -- The questions should be very clearly written in a language suited for a physician.

      -- it is reasonable to add information to the question text that is not related to the question itself, but that is relevant to the topic.
      
      -- Each question should be in JSON format and have the following fields:
      
            text: 'the question text',
            options: 'an array of four plausible answers; they should be lettered A, B, C, and D',
            correctAnswer: 'the index of the correct answer',
            explanation: 'an explanation of the correct answer',
            topic: 'the general topic of the question'`
    ],
    [
      'human',
      'Ask me {numQuestions} cardiology board review question(s) on {topic}.'
    ]
  ]);

  const fields = ['text', 'options', 'correct_answer', 'explanation', 'topic'];
  const parser = new JsonOutputParser({ fields });

  try {
    const chain = prompt.pipe(llm).pipe(parser);
    const response = await chain.invoke({ topic, numQuestions });
    return response;
  } catch (error) {
    console.error('Error in generating quiz question:', error);
    throw error;
  }
};

module.exports = { askQuizQuestion };

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const genCardPrompt = fs.readFileSync('./prompts/genCard.txt', 'utf8');
const mostRecentQuestion = require('./routes/questionRoutes');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const refineQuestion = async (feedback) => {
  console.log('Refining question...');
  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    model: 'gpt-4o',
    temperature: 2.0
  });

  template = `

  Your audience consists of physicians who have completed their cardiology fellowship and are preparing for their board certification exam. The questions should reflect the high level of expertise expected of soon-to-be board-certified cardiologists.

Guidelines for creating questions:
1. Difficulty: Aim for a fellow-level difficulty, appropriate for those about to become board-certified cardiologists.
2. Clarity: Write questions in clear, precise medical language suitable for physicians.
3. Depth: Test deep understanding and application of cardiology concepts, not just factual recall.
4. Context: Incorporate relevant clinical scenarios or recent research findings to add depth to the questions.
5. Comprehensive: Cover a wide range of cardiology subtopics within the specified area.
You are an expert cardiologist and medical educator tasked with creating challenging board exam questions for cardiology fellows.
Question Format:
Each question should be in JSON format within an array, even for a single question. Include the following fields:


  "text": "The question text, including any relevant clinical context or patient information",
  "options": 
    "A. First plausible answer",
    "B. Second plausible answer",
    "C. Third plausible answer",
    "D. Fourth plausible answer"
  
  "correctAnswer": 0, // Index of the correct answer (0-3)
  "explanation": "A detailed explanation of the correct answer, including key concepts and why other options are incorrect",
  "topic": "Specific cardiology subtopic (e.g., 'Acute Coronary Syndromes', 'Electrophysiology', 'Heart Failure')",
  "level": "fellow" // Difficulty level (student, resident, fellow, attending)

    You already proposed the question ${mostRecentQuestion}.
    
    Based on the feedback you received, you need to refine the question. The feedback is {feedback}
    
    Please refine the question accordingly. Provide only the JSON for the refined question without any additional text. The JSON should include the following fields: text, options, correctAnswer, explanation, and topic.`;

  const prompt = ChatPromptTemplate.fromTemplate(template);
  const fields = ['text', 'options', 'correctAnswer', 'explanation', 'topic'];
  const parser = new JsonOutputParser({ fields });

  try {
    const chain = prompt.pipe(llm).pipe(parser);
    const response = await chain.invoke({ feedback });
    console.log('Refined question:', response);
    return response;
  } catch (error) {
    console.error('Error in refining question at the function level:', error);
    throw error;
  }
};

module.exports = { refineQuestion };

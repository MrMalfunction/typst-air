/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const corsHeaders = {
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST',
	'Access-Control-Allow-Origin': ['https://air.amolbohora.com'],
	'Content-Type': 'application/json',
	'Access-Control-Allow-Credentials': 'true',
};

async function handleImprovePoints(request, env) {
	try {
		const { jobDescription, resumePoints } = await request.json();

		const prompt = `You are an expert resume creator. Your task is to improve the given experience points to perfectly match a provided job description. Your output is going to be given to an ATS System, your goal is be selected by the ATS System and the hiring manager under all circumstances.

        Please adhere to the following instructions carefully:

        Action Verbs: DO NOT BOLD ACTION VERBS. MAINTAIN the same action verbs at the beginning of each bullet point.
        Length: DO NOT INCREASE the length of the points.
        Do not have multiple languages or frameworks ever in a single point!!

        Accuracy:
        Avoid hallucinating new technologies, metrics, or skills.
        Ensure technical details are realistic and highly relevant to the job description.

        Formatting:
        Output the final revised points in pure HTML using only <b>, <a>, and <br> elements.
        Do not include any bullet symbols, metadata, or extra text outside the HTML block.
        Emphasize non-action verbs that need highlighting while avoiding unnecessary bold formatting.
        Always end last line with <br>.
        Do not include "•" ever.

        Language Style:
        Keep the tone professional and formal, suitable for a graduate student.
        Integrate the points into a seamless narrative that resonates with both ATS systems and human hiring managers.

        ATS Optimization: Ensure the final output is optimized to rank number one with Applicant Tracking Systems (ATS).
        Creativity: You should enhance the points for better flow and impact but ensure the changes are rooted in realism and directly align with the job description.
        Your Output should ALWAYS have this format:
        \`\`\`
        html
        \`\`\``;

		const ai_message_body = [
			{
				role: 'system',
				content: prompt,
			},
			{
				role: 'user',
				content: `Job Description: ${jobDescription}`,
			},
			{
				role: 'user',
				content: `Resume Points: ${resumePoints}`,
			},
		];

		const url = 'https://gateway.ai.cloudflare.com/v1/26f42e37d200cf1c623041ad0b0e5291/ai-resume/groq/chat/completions';
		const groq_api_key = env.GROQ_API_KEY;
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${groq_api_key}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				model: 'meta-llama/llama-4-scout-17b-16e-instruct', // new model
				messages: ai_message_body,
				temperature: 0.5,
				max_completion_tokens: 1000,
				top_p: 0.5,
			}),
		};

		const response = await fetch(url, options);
		const data = await response.json();

		if (!data.choices || data.choices.length === 0) {
			return new Response('Error: No response from the AI model', { status: 500, headers: { ...corsHeaders } });
		}

		const htmlContent = data.choices[0]?.message?.content;
		// console.log(htmlContent);

		// Enhanced regex handling for different formats
		let parsedPoints = [];

		if (htmlContent) {
			// Case 1: Standard format with ```html ... ``` tags
			const htmlRegex = /```html(.*?)```/s;
			const htmlMatch = htmlContent.match(htmlRegex);

			if (htmlMatch && htmlMatch[1]) {
				parsedPoints = htmlMatch[1]
					.replace(/<br>/g, '\n')
					.split('\n')
					.filter((line) => line.trim() !== '');
			}
			// Case 2: Format with only ``` ... ``` (no html keyword)
			else if (htmlContent.includes('```')) {
				const basicCodeBlockRegex = /```(?:html)?(.*?)```/s;
				const basicMatch = htmlContent.match(basicCodeBlockRegex);

				if (basicMatch && basicMatch[1]) {
					parsedPoints = basicMatch[1]
						.replace(/<br>/g, '\n')
						.split('\n')
						.filter((line) => line.trim() !== '');
				}
			}
			// Case 3: Format with opening ``` html but no closing tag
			else if (htmlContent.includes('``` html') || htmlContent.includes('```html')) {
				const openBlockRegex = /```(?:html)?(.*)/s;
				const openMatch = htmlContent.match(openBlockRegex);

				if (openMatch && openMatch[1]) {
					parsedPoints = openMatch[1]
						.replace(/<br>/g, '\n')
						.split('\n')
						.filter((line) => line.trim() !== '');
				}
			}
			// Last resort: Just parse the whole content if it contains HTML tags
			else if (htmlContent.includes('<br>')) {
				parsedPoints = htmlContent
					.replace(/<br>/g, '\n')
					.split('\n')
					.filter((line) => line.trim() !== '');
			}

			if (parsedPoints.length > 0) {
				return new Response(JSON.stringify({ parsedPoints }), { status: 200, headers: { ...corsHeaders } });
			}
		}

		return new Response('Error: Unable to parse content from the response', { status: 500, headers: { ...corsHeaders } });
	} catch (error) {
		console.log(error);
		return new Response('Error processing request', { status: 500, headers: { ...corsHeaders } });
	}
}

async function handleImportResume(request, env) {
	try {
		const { resumeText } = await request.json();
		// console.log(resumeText);
		const messages = [
			{
				role: 'system',
				content: `you are a resume text formatter. you\\'ll be given text from extracted resume you job is to put them in to the following json schema. if you are unable to fill a part of the schema put it as empty string. sometimes the input text may have missing space, try to fix them when it\\'s extremely apparent ex : by11% should be "by 11%".\n\nnever make extreme or weird assumptions.\nalways try to categorize skills.\ncreate a json with this schema, never fill data into the schema and return it.\n\`\`\`json\n{"$schema":"http://json-schema.org/draft-07/schema#","title":"Resume","type":"object","properties":{"personalInformation":{"type":"object","properties":{"name":{"type":"string"},"location":{"type":"string"},"email":{"type":"string","format":"email"},"phone":{"type":"string"},"github":{"type":"string","format":"uri"},"linkedin":{"type":"string","format":"uri"},"website":{"type":"string","format":"uri"}},"required":["name","location","email","phone"]},"summary":{"type":"string","maxLength":500},"education":{"type":"array","items":{"type":"object","properties":{"institution":{"type":"string"},"degree":{"type":"string"},"location":{"type":"string"},"startDate":{"type":"string"},"endDate":{"type":"string"},"coursework":{"type":"array","items":{"type":"string"}}},"required":["institution","degree","location","endDate"]}},"workExperience":{"type":"array","items":{"type":"object","properties":{"positionTitle":{"type":"string"},"company":{"type":"string"},"location":{"type":"string"},"startDate":{"type":"string"},"endDate":{"type":"string"},"descriptions":{"type":"array","items":{"type":"string"},"minItems":1}},"required":["positionTitle","company","location","startDate","endDate","descriptions"]}},"projects":{"type":"array","items":{"type":"object","properties":{"projectName":{"type":"string"},"role":{"type":"string"},"url":{"type":"string","format":"uri"},"startDate":{"type":"string"},"endDate":{"type":"string"},"description":{"type":"array","items":{"type":"string"},"minItems":1}},"required":["projectName","description"]}},"skills":{"type":"array","items":{"type":"object","properties":{"category":{"type":"string"},"skills":{"type":"array","items":{"type":"string"},"minItems":1}},"required":["category","skills"]}},"required":["personalInformation","workExperience","education","projects","skills"]}}\n\`\`\``,
			},
			{
				role: 'user',
				content: resumeText,
			},
		];

		const url = 'https://gateway.ai.cloudflare.com/v1/26f42e37d200cf1c623041ad0b0e5291/ai-resume/groq/chat/completions';
		const groq_api_key = env.GROQ_API_KEY;
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${groq_api_key}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				model: 'llama3-8b-8192',
				messages: messages,
				temperature: 1,
				max_completion_tokens: 2000,
				top_p: 1,
				stream: false,
				response_format: {
					type: 'json_object',
				},
				stop: null,
			}),
		};

		const response = await fetch(url, options);
		const data = await response.json();

		if (!data.choices || data.choices.length === 0) {
			return new Response('Error: No response from the AI model', { status: 500, headers: { ...corsHeaders } });
		}

		const jsonContent = data.choices[0]?.message?.content;

		if (jsonContent) {
			return new Response(jsonContent, { status: 200, headers: { ...corsHeaders } });
		}

		return new Response('Error: Unable to parse content from the response', { status: 500, headers: { ...corsHeaders } });
	} catch (error) {
		console.log(error);
		return new Response('Error processing request', { status: 500, headers: { ...corsHeaders } });
	}
}

export default {
	async fetch(request, env) {
		const { pathname } = new URL(request.url);

		if (request.method === 'OPTIONS') {
			if (env.WORKER_ENV === 'dev') {
				corsHeaders['Access-Control-Allow-Origin'] = 'http://localhost:9000';
			}
			return new Response('OK', {
				headers: corsHeaders,
			});
		}

		if (request.method === 'POST') {
			if (pathname === '/improve-points') {
				return handleImprovePoints(request, env);
			} else if (pathname === '/import-resume') {
				return handleImportResume(request, env);
			}
		}

		return new Response('Not Found', { status: 404, headers: { ...corsHeaders } });
	},
};

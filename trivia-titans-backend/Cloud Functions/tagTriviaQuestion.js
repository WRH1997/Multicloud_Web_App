const functions = require('@google-cloud/functions-framework');
const { LanguageServiceClient } = require('@google-cloud/language');

async function tagTriviaQuestion(req, res) {
    try {
      const extraString = ". and ourselves as herserf for each all above into through nor me and then by doing and for each above through into";
      const general = "general";
      const question = req.body.question + extraString;

      const words = question.split(" ");
      const wordCount = words.length;
      if (wordCount < 20) {
        question = question + extraString;
      }

      const client = new LanguageServiceClient();
      const document = {
        content: question,
        type: 'PLAIN_TEXT',
      };

      const [response] = await client.classifyText({ document });

      const predefinedCategories = ['movies', 'history', 'sports'];
      const categories = [];

      for (const category of response.categories) {
        const arr = category.name.split("/");
        for(const x of arr){
          if (predefinedCategories.includes(x.toLowerCase())) {
            categories.push(x.toLowerCase());
          }
        }
      }

      if(categories.length === 0){
        categories.push(general);
      }

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
    }
}

function handleCors(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods','*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Headers','Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    tagTriviaQuestion(req, res);
  }
}

functions.http('helloHttp', handleCors);
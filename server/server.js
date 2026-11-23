const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =========================
// MODEL SETTINGS
// (change models here only)
// =========================


const MODEL_A = {
  name: "DeepSeek",
  id: "deepseek/deepseek-chat"
};

const MODEL_B = {
  name: "ERNIE 5.5",
  id: "baidu/ernie-5.5-flash-preview:free"
};

// Use DeepSeek as the independent AI Judge
const JUDGE_MODEL = MODEL_A.id;

// Map old frontend model IDs to ERNIE
const MODEL_ALIASES = {
  "openai/gpt-oss-20b:free": MODEL_B.id,
  "openai/gpt-oss-20b": MODEL_B.id,
  "openai/gpt-oss-120b:free": MODEL_B.id,
  "openai/gpt-oss-120b": MODEL_B.id
};


// =========================
// HELPER: CALL OPENROUTER
// (retries a couple of times if rate-limited)
// =========================

async function askModel(modelId, content, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: modelId,
          messages: [
            {
              role: "user",
              content,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Empty response from model");
      }

      return text;
    } catch (err) {
      if (err.response?.status === 429 && attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 4000 * (attempt + 1))
        );
        continue;
      }

      throw err;
    }
  }
}

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Backend Working");
});

// =========================
// GENERATE ROUTE
// =========================

app.post("/generate", async (req, res) => {

  try {

    const {
      business,
      audience,
      style,
      platform,
      model,
    } = req.body;

    // =========================
    // DYNAMIC AI-LIKE OUTPUT
    // =========================

    const prompt = `
You are a branding expert.

Business Type: ${business}
Target Audience: ${audience}
Design Style: ${style}
Platform: ${platform}

Generate:

1. Professional Slogan
2. Marketing Caption
3. 10 Trending Hashtags

Return only clean formatted content.
`;

    const chosenModel =
      MODEL_ALIASES[model] || model || MODEL_A.id;

    const output = await askModel(chosenModel, prompt);

    // =========================
    // BUSINESS RELATED IMAGE
    // =========================

    let imageUrl = "";

    const businessType = business.toLowerCase();

    // GYM / FITNESS
    if (
      businessType.includes("gym") ||
      businessType.includes("fitness")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";
    }

    // CAFE / COFFEE
    else if (
      businessType.includes("cafe") ||
      businessType.includes("coffee")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80";
    }

    // BAKERY
    else if (
      businessType.includes("bakery") ||
      businessType.includes("cake")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80";
    }

    // FASHION
    else if (
      businessType.includes("fashion") ||
      businessType.includes("clothing")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80";
    }

    // RESTAURANT / FOOD
    else if (
      businessType.includes("restaurant") ||
      businessType.includes("food")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
    }

    // TECH / SOFTWARE
    else if (
      businessType.includes("tech") ||
      businessType.includes("software")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
    }

    // TRAVEL
    else if (
      businessType.includes("travel") ||
      businessType.includes("tour")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
    }

    // PHOTOGRAPHY
    else if (
      businessType.includes("photography") ||
      businessType.includes("camera")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80";
    }

    // EDUCATION
    else if (
      businessType.includes("education") ||
      businessType.includes("school")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80";
    }

    // MEDICAL
    else if (
      businessType.includes("medical") ||
      businessType.includes("hospital")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80";
    }

    // REAL ESTATE
    else if (
      businessType.includes("real estate") ||
      businessType.includes("property")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";
    }

    // BEAUTY
    else if (
      businessType.includes("beauty") ||
      businessType.includes("salon")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80";
    }

    // JEWELRY
    else if (
      businessType.includes("jewelry") ||
      businessType.includes("gold")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80";
    }

    // GAMING
    else if (
      businessType.includes("gaming") ||
      businessType.includes("games")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
    }

    // MUSIC
    else if (
      businessType.includes("music") ||
      businessType.includes("studio")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80";
    }

    // SPORTS
    else if (
      businessType.includes("sports") ||
      businessType.includes("football")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80";
    }

    // FINANCE
    else if (
      businessType.includes("finance") ||
      businessType.includes("bank")
    ) {

      imageUrl =
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80";
    }

    // DEFAULT
    else {

      imageUrl =
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";
    }

    // =========================
    // SEND RESPONSE
    // =========================

    res.json({
      output,
      image: imageUrl,
    });

  } catch (error) {

    console.log("SERVER ERROR:");

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      output: "Generation Failed",
      image: "",
    });

  }

});

// =========================
// COMPARE ROUTE
// =========================

const PORT = 8000;

app.post("/compare", async (req, res) => {

  try {

    const {
      business,
      audience,
      style,
      platform,
    } = req.body;

    const prompt = `
Business Type: ${business}
Target Audience: ${audience}
Style: ${style}
Platform: ${platform}

Generate:

1. Professional Slogan
2. Marketing Caption
3. 10 Trending Hashtags
`;

    const models = [MODEL_A, MODEL_B];

    const results = await Promise.all(

      models.map(async (model) => {

        try {

          const output = await askModel(model.id, prompt);

          return {
            model: model.name,
            output,
          };

        } catch (err) {

          console.log(
            "ERROR FOR MODEL:",
            model.name
          );

          console.log(
            err.response?.data || err.message
          );

          return {
            model: model.name,
            output: "Generation Failed",
          };

        }

      })

    );

    // If a model failed, don't ask the judge to score "Generation Failed"
    if (results.some((r) => r.output === "Generation Failed")) {

      const empty = {
        creativity: 0,
        relevance: 0,
        marketing: 0,
        hashtags: 0,
        overall: 0,
      };

      return res.json({
        comparison: results,
        evaluation: {
          DeepSeek: empty,
          ERNIE: empty,
          winner: "Not available (a model failed, try again)",
        },
      });

    }

    
const judgePrompt = `
You are an expert AI evaluator.

Compare these two branding outputs.

DeepSeek Output:
${results[0].output}

ERNIE 5.5 Output:
${results[1].output}

Evaluate both outputs and score them from 0-100 for:

1. Creativity
2. Brand Relevance
3. Marketing Effectiveness
4. Hashtag Quality
5. Overall Score

Return ONLY valid JSON in this exact structure:

{
  "DeepSeek": {
    "creativity": 0,
    "relevance": 0,
    "marketing": 0,
    "hashtags": 0,
    "overall": 0
  },
  "ERNIE": {
    "creativity": 0,
    "relevance": 0,
    "marketing": 0,
    "hashtags": 0,
    "overall": 0
  },
  "winner": ""
}

Use actual scores based on the two outputs.
The winner must be the model with the higher overall score.
Do not always select the same model.
`;


    const rawResponse = await askModel(JUDGE_MODEL, judgePrompt);

    // Keep only the JSON part, in case the model adds extra text
    const start = rawResponse.indexOf("{");
    const end = rawResponse.lastIndexOf("}");

    const evaluation = JSON.parse(
      rawResponse.slice(start, end + 1)
    );

    res.json({
      comparison: results,
      evaluation,
    });

  } catch (error) {

    console.log("COMPARE ERROR:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Comparison Failed",
    });

  }

});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
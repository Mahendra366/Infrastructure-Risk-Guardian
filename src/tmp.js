// Node 18+ required (has fetch built-in)

const API_KEY = "AIzaSyAP84zIAk74E3T1wRHrZh1bz56ibCzFmQA";

async function test() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Say hello in one line" }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("FULL RESPONSE:\n", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("\nAI OUTPUT:\n", text);

  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
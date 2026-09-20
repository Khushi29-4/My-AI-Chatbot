import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const defaultInstructions = `
You are a helpful and friendly AI assistant.
When a file is uploaded, identify its actual type correctly.
- If the uploaded file is an image, refer to it as an image.
- If the uploaded file is a PDF, refer to it as a PDF or document.
- If the uploaded file is a DOCX, refer to it as a DOCX document.
- If the uploaded file is a text file, refer to it as a text file.
Never call a PDF, DOCX, or text file an image.

Follow these rules:
- Explain things in simple and clear language.
- Give direct answers.
- Use examples when they make the explanation easier.
- For programming questions, explain the code clearly.
- If the user asks for a short answer, keep it short.
- Be polite and professional.

AI modes:

- If the selected AI mode is "normal", answer normally as a helpful assistant.
- If the selected AI mode is "study", explain concepts clearly and step-by-step. Use simple language and examples when useful.
- If the selected AI mode is "code", focus on programming. Give correct code, explain the important parts, and point out errors when relevant.
- If the selected AI mode is "interview", answer in an interview-friendly way. Keep answers clear, structured, and easy to speak in an interview.
- If the selected AI mode is "creative", help with brainstorming, ideas, writing, captions, stories, and creative alternatives.
Always follow the selected mode while answering, but do not mention the mode unless the user asks about it.
`;

app.post("/chat", async (req, res) => {

    try {

        const conversation = req.body.conversation;
        const image = req.body.image;
        const pdf = req.body.pdf;
        const textFile = req.body.textFile;
        const docxFile = req.body.docxFile;
        const instructions = req.body.instructions;
        const aiMode = req.body.aiMode;



        if (!conversation || conversation.length === 0) {

            return res.status(400).json({
                error: "No conversation provided."
            });

        }


        let contents = conversation.map(message => ({

            role:
                message.role === "model"
                    ? "model"
                    : "user",

            parts: [
                {
                    text: message.text || ""
                }
            ]

        }));


        if (
            contents.length === 0 ||
            contents[contents.length - 1].role === "model"
        ) {

            contents.push({

                role: "user",

                parts: [
                    {
                        text: ""
                    }
                ]

            });

        }


        // ===============================
        // IMAGE
        // ===============================

        if (image) {

            const latestMessage =
                contents[contents.length - 1];

            const [header, base64Data] =
                image.split(",");

            const mimeMatch =
                header.match(/data:(.*);base64/);

            if (mimeMatch) {

                latestMessage.parts.push({

                    inlineData: {

                        mimeType:
                            mimeMatch[1],

                        data:
                            base64Data

                    }

                });

            }

        }


        // ===============================
        // PDF
        // ===============================

        if (pdf) {

            const latestMessage =
                contents[contents.length - 1];

            const [header, base64Data] =
                pdf.split(",");

            latestMessage.parts.push({

                inlineData: {

                    mimeType:
                        "application/pdf",

                    data:
                        base64Data

                }

            });

        }
        if (textFile) {

            const latestMessage =
                contents[contents.length - 1];

            latestMessage.parts.push({
                text:
                    "\n\n--- Uploaded text file ---\n" +
                    textFile +
                    "\n--- End of uploaded text file ---"
            });
        }
        if (docxFile) {

            const latestMessage =
                contents[contents.length - 1];

            const [header, base64Data] =
                docxFile.split(",");

            const buffer =
                Buffer.from(
                    base64Data,
                    "base64"
                );

            const result =
                await mammoth.extractRawText({
                    buffer: buffer
                });

            latestMessage.parts.push({
                text:
                    "\n\n--- Uploaded DOCX file ---\n" +
                    result.value +
                    "\n--- End of uploaded DOCX file ---"
            });
        }

        // ===============================
        // STREAMING RESPONSE
        // ===============================

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        res.setHeader(
            "Transfer-Encoding",
            "chunked"
        );


        try {

            const response =
                await ai.models.generateContentStream({

                    model: "gemini-3.6-flash",

                    config: {

                        systemInstruction: `
${instructions || defaultInstructions}

Selected AI mode: ${aiMode || "normal"}
Follow this mode while answering:
- normal: Answer normally as a helpful assistant.
- study: Explain step-by-step in simple language and use examples.
- code: Focus on programming and explain code clearly.
- interview: Give clear, structured, interview-friendly answers.
- creative: Help with ideas, writing, brainstorming, and creative alternatives.

`



                    },

                    contents:
                        contents

                });


            for await (
                const chunk of response
            ) {

                const text =
                    chunk.text;

                if (text) {

                    res.write(text);

                }

            }


            res.end();

        }


        catch (error) {

            console.error(
                "Gemini streaming error:",
                error
            );


            if (error.status === 429) {

                res.write(
                    "Gemini free-tier limit reached. Please try again later."
                );

            }

            else {

                res.write(
                    "Sorry, something went wrong with Gemini."
                );

            }

            res.end();

        }

    }


    catch (error) {

        console.error(
            "SERVER ERROR:",
            error
        );

        res.status(500).send(
            "Server error."
        );

    }

});


app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});
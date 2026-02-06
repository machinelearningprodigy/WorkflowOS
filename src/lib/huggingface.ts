import { HfInference } from "@huggingface/inference";

export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Recommended models for logic and JSON generation
export const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

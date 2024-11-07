"""Implement a chatbot using HuggingFace pipeline."""
from langchain_huggingface import HuggingFacePipeline
import gradio as gr

pipeline = HuggingFacePipeline.from_model_id(
    model_id="BSC-LT/salamandra-2b-instruct",
    task="text-generation",
    pipeline_kwargs={"max_new_tokens": 100},
    device_map="auto"
)

# Define a function to generate text
def generate_text(user_input):
    messages = [{"role": "user", "content": user_input}]
    response = pipeline(messages)
    generated_text = response[0]['generated_text'][1]["content"]
    return generated_text


# Create a Gradio interface
iface = gr.Interface(
    fn=generate_text,
    inputs="text",
    outputs="text",
    title="Text Generation with Transformers",
    description="Enter a prompt to generate text using the BSC-LT/salamandra-2b-instruct model."
)

# Launch the interface
iface.launch()


print("Done")

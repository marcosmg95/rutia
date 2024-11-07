from transformers import pipeline
import gradio as gr

# Initialize the pipeline
pipe = pipeline(
    "text-generation",
    model="BSC-LT/salamandra-2b-instruct",
    max_new_tokens=100,
    device_map="auto"  # This will automatically place layers on CPU/GPU as needed
)


# Define a function to generate text
def generate_text(user_input):
    messages = [{"role": "user", "content": user_input}]
    response = pipe(messages)
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
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate


# example contexts
# '20.30 h  Durada aproximada: 1 hora i 15 minuts'
# 'Els tallers es faran a les 12 h'
# '11 h'
# '18.15 h'
# ''12 h  \xa0 Durada 65 minuts.'
# 'De 17 a 20 h'
# 'Durant tot el matí'
# '18 h presentació del concert: 17 h'

# Answer: Let's think step by step.
TEMPLATE = """Question: {question}
Context: {context}
Start hour:"""
prompt = PromptTemplate.from_template(TEMPLATE)

pipeline = HuggingFacePipeline.from_model_id(
    model_id="BSC-LT/salamandra-2b-instruct",
    task="text-generation",
    pipeline_kwargs={"max_new_tokens": 200},
    device_map="auto"
)

chain = prompt | pipeline

question = "Extract start hour from event context"
context = "20.30 h  Durada aproximada: 1 hora i 15 minuts"

answer = chain.invoke({"question": question, "context": context})
print("Answer:", answer)

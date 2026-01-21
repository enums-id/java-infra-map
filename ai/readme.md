Prompting the AI to generate the news. Generates `../public/news/*.json`. must be executed in here.

```bash
export OPENAI_API_KEY="sk-p...."

python -m venv .venv
. ./.venv/bin/activate
pip install -r requirements.txt
python main.py
```

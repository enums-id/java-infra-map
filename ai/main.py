from openai import OpenAI
import json
def main():
    client = OpenAI()

    with open("../public/catalog.json", "r") as f:
        catalog = json.load(f)

    promptResult = {}
    for record in catalog:
        if len(record["prompt"]) == 0:
            continue
        project_names = ",".join(record["prompt"])
        toMerge = projectName(record["name"], project_names, client)
        promptResult[record["name"]] = toMerge

        with open(f"../public/news/{record["name"].replace(".geojson",".json")}", "w") as f:
            json.dump(toMerge, f,indent=4)
    
    return 0 


def projectName(name: str, projectNames: str,client: OpenAI):
    print(f"Prompting for {name}: {projectNames}")
    response = client.responses.create(
        model="gpt-4o",
        tools=[
            {
                "type": "web_search"
            }
        ],
        input=[
            {
                "role": "system",
                "content": (
                    "You are a news research assistant. "
                    "Search the web for recent news and return structured JSON only."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Find the latest relevant 5 news articles about this project: ({projectNames}) with published date of the articles.\n\n"
                    "Return ONLY valid raw JSON, not markdown, in this format:\n"
                    "[\n"
                    "  {\"newsTitle\": string, \"datePublished\": string \"summary\": string, \"link\": string}\n"
                    "]"
                    "summary is the summary of the article in one sentence"
                    "The link must be the URL to the corresponding news which starts with https://"
                    "datePublished is the article's published date, must be unix timestamp."
                )
            }
        ],
    )

    output_text = response.output_text
    
    print("output", output_text)
    return json.loads(output_text)


if __name__ == "__main__":
    main()
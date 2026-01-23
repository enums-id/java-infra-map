from openai import OpenAI
import argparse

import json
def main():
    parser = argparse.ArgumentParser(description="Process an optional GeoJSON file")
    parser.add_argument(
        "file",
        nargs="?",          # makes it optional
        default=None,       # value if not provided
        help="Path to the GeoJSON file"
    )

    args = parser.parse_args()

    if args.file:
        print("Parsed file:", args.file)
    else:
        print("No file provided")



    client = OpenAI()

    with open("../public/catalog.json", "r") as f:
        catalog = json.load(f)

    promptResult = {}
    for record in catalog:
        if (args.file) and (record["name"] != args.file):
            continue
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
                    "You are a news research assistant about infrastructure projects in Indonesia. You speak English."
                    "Search the web for recent news and return structured JSON only. No notes. Only raw JSON!"
                    "You are here to help a website by providing news summary in JSON."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Find, from the internet, the LATEST relevant 5 news articles in the year of 2025 and 2026 about this project: ({projectNames}) with published date of the articles.\n\n"
                    f"Prioritise the news about infrastructure development related to {projectNames}."
                    "Prioritise English news. If the news is indonesian, translate the summary AND title into English."
                    "Return ONLY valid raw JSON, not markdown, in this schema:\n"
                    "[\n"
                    "  {\"newsTitle\": string, \"datePublished\": string \"summary\": string, \"link\": string}\n"
                    "]"
                    "newsTitle is the news title. Translate the title into English."
                    "summary is the summary of the article in one sentence in English"
                    "The link must be the URL to the corresponding news which starts with https://"
                    "datePublished is the article's published date in 2025 or 2026, must be unix timestamp. Read the news article, determine the published date, obtain the published date from the news article. IT MUST BE IN 2025 OR 2026."
                    "remember, the result must be in JSON as it will be saved as a json file."
                    "Do not add notes or anything, just return the JSON value! I cannot accept output other than the specified JSON schema"
                )
            }
        ],
    )

    output_text = response.output_text
    
    print("output", output_text)
    return json.loads(output_text)


if __name__ == "__main__":
    main()
export function cleanUpRedditText (text?: string): string {
    if (!text) {
        return "";
    }

    // Remove weird fancy pants editor stuff
    text = text.replace(/&#x200B;/g, "");

    // Deduplicate newlines
    text = text.replace(/\n\n+/g, "\n");

    // Remove leading and trailing whitespace
    text = text.trim();

    // If the text is just a single >, it's meant to look like an empty comment
    if (text === ">") {
        return "";
    }

    return text;
}

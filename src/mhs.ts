const MHS_SCORE_ENDPOINT = "https://api.moderatehatespeech.com/api/v1/moderate/";
const MHS_REPORT_ENDPOINT = "https://api.moderatehatespeech.com/api/v1/report/";

export type ModerateHatespeechResponse = {
    confidence: number;
    response: string;
    class: "flag" | "normal";
}

/**
 * A false negative is a comment that was not flagged as hate speech, but should have been.
 * A false positive is a comment that was flagged as hate speech, but should not have been.
 */
export enum ModerateHatespeechReportType {
    FalseNegative = 1,
    FalsePositive = 2,
}

export function isModerateHatespeechResponse (response: unknown): response is ModerateHatespeechResponse {
    if (!response || typeof response !== "object") {
        return false;
    }
    if (!("confidence" in response) || !("class" in response) || !("response" in response)) {
        return false;
    }
    if (typeof response.confidence !== "number" || typeof response.class !== "string" || typeof response.response !== "string") {
        return false;
    }
    if (response.class !== "flag" && response.class !== "normal") {
        return false;
    }
    return true;
}

export class ModerateHatespeechClient {
    constructor (protected apiKey: string) {}

    /**
     * ModerateHatespeech returns a confidence score between 0.5 and 1, with either a class of "flag" for hate speech and "normal" for non-hate speech.
     * This function linearizes the confidence score so that 100% normal confidence is 0 and 100% flag confidence is 1.
     * @param confidence Confidence score from ModerateHatespeech
     * @param class_ Prediction class from ModerateHatespeech
     * @returns A linearized confidence score between 0 and 1.
     */
    public linearizeConfidence (confidence: number, class_: "flag" | "normal"): number {
        if (class_ === "flag") {
            return confidence;
        }
        return 1 - confidence;
    }

    /**
     * Checks whether the given text is hate speech.
     * @param text Input text
     * @param confidence Minimum confidence score for the text to be considered hate speech
     * @returns Whether the text is hate speech
     */
    public async isHatespeech (text: string, confidence: number): Promise<boolean> {
        const score = await this.getScore(text);
        const linearizedConfidence = this.linearizeConfidence(score.confidence, score.class);
        console.log(`ModerateHatespeech returned a confidence of ${linearizedConfidence}`);
        return linearizedConfidence >= confidence;
    }

    /**
     * Gets the hate speech score for the given text from ModerateHatespeech.
     * @param text Input text
     * @returns Object containing the confidence score, prediction class, and response from ModerateHatespeech
     */
    public async getScore (text: string): Promise<ModerateHatespeechResponse> {
        const response = await fetch(MHS_SCORE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: this.apiKey,
                text,
            }),
        });

        const scoreJson: unknown = await response.json();
        if (!isModerateHatespeechResponse(scoreJson)) {
            throw new Error(`Invalid response from ModerateHatespeech:\n${JSON.stringify(scoreJson)}`);
        }
        if (scoreJson.response.toLowerCase() !== "success") {
            throw new Error(`ModerateHatespeech returned an error:\n${scoreJson.response}`);
        }
        return scoreJson;
    }

    /**
     * This is used to report false positives and false negatives to ModerateHatespeech.
     * @param text Previously checked text
     * @param reportType Whether the previous check resulted in a false positive or a false negative
     */
    public async reportMistake (text: string, reportType: ModerateHatespeechReportType): Promise<void> {
        await fetch(MHS_REPORT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: this.apiKey,
                text,
                intended: reportType,
            }),
        });
    }
}
